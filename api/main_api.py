from datetime import date
import secrets
from functools import wraps

from cachetools import TTLCache
from flask import Flask, Response, json, request, send_file
from flask.wrappers import Request
from flask_restful import Api, Resource, reqparse

from config import API_SETTINGS
from business_logic import (
    delete_contract,
    export_contracts,
    get_account,
    get_contracts,
    get_contact_details,
    get_dashboard_debit_credit,
    get_lists,
    get_relationship,
    insert_contract,
    update_contract,
    change_relationship,
)
from db_models import IT_IS_TYPES
from reports import (
    balance_forecast, 
    expenses_by_contract_type, 
    export_balance_forecast, 
    income_by_contract_type, 
    total_income, 
    total_income_by_years, 
    unpaid,
)
from authentification import check_user
from admin import (
    add_contract_type,
    edit_contract_type,
    delete_contract_type,
    add_contractor,
    edit_contractor,
    delete_contractor,
    get_filters_for_log,
    get_logs,
)


app = Flask(__name__)
api = Api(app, prefix='/man_acc')


class AnyJsonRequest(Request):
    def on_json_loading_failed(self, e):
        if e is not None:
            return super().on_json_loading_failed(e)

app.request_class = AnyJsonRequest

CACHE_SESSION = TTLCache(maxsize=API_SETTINGS.getint('maxsize'), ttl=API_SETTINGS.getint('ttl'))

CACHE_USER = TTLCache(maxsize=API_SETTINGS.getint('maxsize'), ttl=API_SETTINGS.getint('ttl'))

CACHE_SESSION['test'] = {
    "fio": "test",
    "login": "test",
    "role": "adm",
    "session": "test"
}

CACHE_USER['test'] = 'test'


## WRAPS
def admin_only(func):

    @wraps(func)
    def wrapper(*args, **kwargs):
        _json = request.get_json(silent=True) or {}

        session = request.args.get("session") or _json.get("session")
        user = CACHE_SESSION.get(session)
        if user['role'] == 'adm':
            return func(*args, **kwargs)
        else:
            return Response(json.dumps({'message': 'Нет прав доступа'}, ensure_ascii=False), mimetype='application/json', status=403)
    return wrapper


def check_session(func):

    @wraps(func)
    def wrapper(*args, **kwargs):
        _json = request.get_json(silent=True) or {}

        session = request.args.get("session") or _json.get("session")
        user = CACHE_SESSION.get(session)
        if user:
            CACHE_SESSION[session] = user
            CACHE_USER[user['login']] = session
            kwargs['user'] = user
            return func(*args, **kwargs)
        else:
            return Response(json.dumps({'message': 'Сессия устарела. Обновите страницу'}, ensure_ascii=False), mimetype='application/json', status=401)
    return wrapper


def cls_check_session(cls):
    # Get all callable attributes of the class
    restful_method = ("get", "post", "put", "delete")
    callable_attributes = {k:v for k, v in cls.__dict__.items() 
                           if k in restful_method}
    # Decorate each callable attribute of to the input class
    for name, func in callable_attributes.items():
        decorated = check_session(func)
        setattr(cls, name, decorated)
    return cls


## MAIN

class _Resource(Resource):
    # parser = reqparse.RequestParser(trim=True)
    # parser.add_argument('parser', type=str, default=False, required=True, choices=('M', 'F'), help='Bad choice: {error_msg}')

    @staticmethod
    def return_json(body, status, *headers):
        response = Response(json.dumps(body, ensure_ascii=False), mimetype='application/json', status=status)
        if headers:
            for h in headers:
                response.headers.add(*h)
        return response

    @staticmethod
    def return_status(status):
        return Response(status=status)


class Auth(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('login', type=str, required=True)
    parser.add_argument('password', type=str, required=True)

    @check_session
    def get(self, user):
        return self.return_status(200)

    def post(self):
        args: dict = self.parser.parse_args()
        
        user, status = check_user(**args)
        if status != 201:
            return self.return_json(user, status)
        
        token = CACHE_USER.get(args['login'])
        if CACHE_SESSION.get(token):
            CACHE_SESSION.pop(token)
        
        token = secrets.token_urlsafe(16)
        CACHE_SESSION[token] = user
        CACHE_USER[user['login']] = token
        user['session'] = token

        return self.return_json(user, status)

class _date():
    def __new__(self, date_str: str) -> date:
        year, month, *day = date_str.split('-')
        if day:
            return date(year=int(year), month=int(month), day=int(day[0]))
        else:
            return date(year=int(year), month=int(month), day=1)

@cls_check_session
class Contract(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('it_is', type=str, required=True, choices=IT_IS_TYPES)
    parser.add_argument('contractor_id', type=int, required=True)
    parser.add_argument('type_id', type=int, required=True)
    parser.add_argument('description', type=str, required=True)
    parser.add_argument('comment', type=str)
    parser.add_argument('contract', type=str)
    parser.add_argument('contract_date', type=str)
    parser.add_argument('order', type=str)
    parser.add_argument('order_date', type=str)
    parser.add_argument('order_price', type=float)
    parser.add_argument('order_deadline', type=str, required=True)
    parser.add_argument('user_id', type=str, store_missing=False)
    parser.add_argument('invoice', type=dict, action='append', default=[])
    parser.add_argument('linked_contracts', type=dict, action='append', default=[])
    parser.add_argument('repeating_contract', type=dict, default={})
    parser.add_argument('id', type=int, store_missing=False)

    parser_get = parser.copy()
    parser_get.remove_argument('linked_contracts')
    parser_get.remove_argument('repeating_contract')
    parser_get.remove_argument('id')
    parser_get.remove_argument('user_id')
    parser_get.remove_argument('invoice')
    parser_get.remove_argument('order_date')
    parser_get.remove_argument('contract_date')
    parser_get.remove_argument('order_deadline')
    parser_get.remove_argument('repeating_contract')

    parser_get.add_argument('contract_id', type=int, default=1)
    parser_get.add_argument('invoice_name', type=str)
    parser_get.add_argument('start_report_date', type=_date)
    parser_get.add_argument('end_report_date', type=_date)
    parser_get.add_argument('start_invoice_date', type=_date)
    parser_get.add_argument('end_invoice_date', type=_date)
    parser_get.add_argument('invoice_price', type=float)
    parser_get.add_argument('payment_amount', type=float)
    parser_get.add_argument('start_payment_date', type=_date)
    parser_get.add_argument('end_payment_date', type=_date)
    parser_get.add_argument('start_payment_expected_date', type=_date)
    parser_get.add_argument('end_payment_expected_date', type=_date)
    parser_get.add_argument('page', type=int, default=1)
    parser_get.add_argument('query_token', type=str, default='default')
    parser_get.add_argument('sort_key', type=str)
    parser_get.add_argument('sort_order', type=str, default='ASC')
    parser_get.add_argument('start_order_date', type=_date)
    parser_get.add_argument('end_order_date', type=_date)
    parser_get.add_argument('start_contract_date', type=_date)
    parser_get.add_argument('end_contract_date', type=_date)
    parser_get.add_argument('start_order_deadline', type=_date)
    parser_get.add_argument('end_order_deadline', type=_date)
    parser_get.add_argument('start_repeating_contract', type=_date)
    parser_get.add_argument('end_repeating_contract', type=_date)

    for arg in parser_get.args:
        if arg.name in ['session', 'page']:
            continue
        arg.required = False
        arg.store_missing = False


    def get(self, user, contract_id=None):
        filters = self.parser_get.parse_args()
        if contract_id:
            return self.return_json(*get_contact_details(contract_id))
        return self.return_json(*get_contracts(filters))
    
    def post(self, user):
        args = self.parser.parse_args()
        error_message, status = insert_contract(args, user['login'])
        if status == 201:
            return self.return_status(status)
        else:
            return self.return_json(error_message, status)

    def put(self, user, contract_id=None):
        args = self.parser.parse_args()
        error_message, status = update_contract(args['id'], args, user['login'])
        if status == 200:
            return self.return_status(status)
        else:
            return self.return_json(error_message, status)
    
    def delete(self, user, contract_id):
        status = delete_contract(contract_id, user['login'])
        return self.return_status(status)

@cls_check_session
class ContractExport(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('query_token', type=str, default='default')

    def get(self, user):
        args = self.parser.parse_args()
        result = export_contracts(args['query_token'])
        if isinstance(result, tuple):
            return self.return_json(*result)
        return send_file(result, download_name='Выгрузка.xlsx', as_attachment=True)


@cls_check_session
class Relationship(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('relationship', default=[], action='append', type=int)

    def get(self, user, contract_id):
        return self.return_json(*get_relationship(contract_id))

    def put(self, user, contract_id):
        args = self.parser.parse_args()
        return self.return_status(change_relationship(contract_id, args['relationship']))


@cls_check_session
class Account(_Resource):

    def get(self, user):
        return self.return_json(*get_account())


@cls_check_session
class Background(_Resource):

    def get(self, user):
        return self.return_json(*get_lists())


@cls_check_session
class AdminBackground(_Resource):

    @admin_only
    def get(self, user):
        return self.return_json(*get_lists())


@cls_check_session
class Dashboard(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('start_date', type=str)
    parser.add_argument('end_date', type=str)

    def get(self, user):
        args = self.parser.parse_args()
        return self.return_json(*get_dashboard_debit_credit(args['start_date'], args['end_date']))


@cls_check_session
class Report(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('start_date', type=str)
    parser.add_argument('end_date', type=str)

    def get(self, user, report_type, contractor_id = None):
        args = self.parser.parse_args()
        if report_type == 'total_income':
            if contractor_id:
                body, status = total_income_by_years(contractor_id)
            else:
                body, status = total_income(**args)
        elif report_type == 'income_by_contract_types':
            body, status = income_by_contract_type(**args)
        elif report_type == 'expenses_by_contract_types':
            body, status = expenses_by_contract_type(**args)
        elif report_type == 'unpaid':
            body, status = unpaid(**args)
        elif report_type == 'we_unpaid':
            body, status = unpaid(**args, it_is='Расход')
        elif report_type == 'balance_forecast':
            body, status = balance_forecast(args['end_date'])
        else:
            body = None
            status = 405

        return self.return_json(body, status)


@cls_check_session
class ReportExport(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('start_date', type=str)
    parser.add_argument('end_date', type=str)

    def get(self, user, report_type, contractor_id = None):
        args = self.parser.parse_args()
        if report_type == 'total_income':
            if contractor_id:
                body, status = total_income_by_years(contractor_id)
            else:
                body, status = total_income(**args)
        elif report_type == 'income_by_contract_types':
            body, status = income_by_contract_type(**args)
        elif report_type == 'expenses_by_contract_types':
            body, status = expenses_by_contract_type(**args)
        elif report_type == 'unpaid':
            body, status = unpaid(**args)
        elif report_type == 'balance_forecast':
            name = "Прогноз_остатка"
            body, status = export_balance_forecast(args['end_date'])
        else:
            body = None
            status = 405

            
        if status == 200:
            return send_file(body, download_name=f'{name}.xlsx', as_attachment=True)
        else:
            return self.return_json(body, status)


@cls_check_session
class Contractor(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('name', type=str)
    parser.add_argument('color_hex', type=str)
    
    @admin_only
    def post(self, user):
        args = self.parser.parse_args()
        msg, status = add_contractor(**args, user=user['login'])
        if msg:
            return self.return_json(msg, status)
        else:
            return self.return_status(status)

    @admin_only
    def put(self, id, user):
        args = self.parser.parse_args()
        msg, status = edit_contractor(id, **args, user=user['login'])
        if msg:
            return self.return_json(msg, status)
        else:
            return self.return_status(status)

    @admin_only
    def delete(self, id, user):
        msg, status = delete_contractor(id, user=user['login'])
        if msg:
            return self.return_json(msg, status)
        else:
            return self.return_status(status)


@cls_check_session
class Contract_type(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('name', type=str)
    parser.add_argument('it_is', type=str, choices=IT_IS_TYPES)
    
    @admin_only
    def post(self, user):
        args = self.parser.parse_args()
        msg, status = add_contract_type(**args, user=user['login'])
        if msg:
            return self.return_json(msg, status)
        else:
            return self.return_status(status)

    @admin_only
    def put(self, id, user):
        args = self.parser.parse_args()
        msg, status = edit_contract_type(id, args['name'], user=user['login'])
        if msg:
            return self.return_json(msg, status)
        else:
            return self.return_status(status)

    @admin_only
    def delete(self, id, user):
        msg, status = delete_contract_type(id, user=user['login'])
        if msg:
            return self.return_json(msg, status)
        else:
            return self.return_status(status)


@cls_check_session
class Log(_Resource):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('start_date', type=str)
    parser.add_argument('end_date', type=str)
    parser.add_argument('login', type=str)
    parser.add_argument('section', type=str)
    parser.add_argument('changes', type=str)
    parser.add_argument('page', type=int, default=1)
    parser.add_argument('query_token', type=str)


    @admin_only
    def get(self, user, menu = None):
        args = self.parser.parse_args()
        if menu == "filters":
            return self.return_json(*get_filters_for_log())
        return self.return_json(*get_logs(args))


api.add_resource(Contract, '/contracts', '/contract/<int:contract_id>')
api.add_resource(Background, '/lists')
api.add_resource(AdminBackground, '/admin')
api.add_resource(Relationship, '/contract/<int:contract_id>/relationship')
api.add_resource(Account, '/account')
api.add_resource(ContractExport, '/contracts/export')
api.add_resource(Dashboard, '/dashboard')
api.add_resource(Report, '/report/<string:report_type>', '/report/<string:report_type>/<int:contractor_id>')
api.add_resource(ReportExport, '/report/<string:report_type>/export')
api.add_resource(Auth, '/auth')
api.add_resource(Contractor, '/admin/contractor', '/admin/contractor/<int:id>')
api.add_resource(Contract_type, '/admin/ctype', '/admin/ctype/<int:id>')
api.add_resource(Log, '/logs', '/log/<string:menu>')

if __name__ == '__main__':
    app.run(
        host=API_SETTINGS.get('host'), 
        port=API_SETTINGS.getint('port'), 
        debug=API_SETTINGS.getboolean('debug'),
    )
