import secrets
from typing import Any, Dict, List, Literal, Tuple

from cachetools import TTLCache
from db_models import (
    PaymentAccount,
    Contractor,
    ContractType,
    User,
    UserDetail,
    UserActionsLog,
    IT_IS_TYPES
)
from my_engine import Session
from sqlalchemy import and_, func, or_, text
from sqlalchemy.orm.query import Query
import my_exceptions as my_exc

query_cache = TTLCache(100, 14400)

def _msg(message):
    return {"message": message}


def _already_contractor(name):
    sess = Session()
    try:
        check_contractor = sess.query(Contractor).filter(Contractor.name == name, Contractor.is_active)
        sess.close()
        if check_contractor.count():
            return True
        return False
    except Exception as e:
        sess.close()
        return False
    

def _already_contract_type(name, it_is):
    sess = Session()
    try:
        check_ctype = sess.query(ContractType).filter(ContractType.name == name, ContractType.it_is == it_is, ContractType.is_active)
        sess.close()
        if check_ctype.count():
            return True
        return False
    except Exception as e:
        sess.close()
        return False


def __insert_log(user, text):
    with Session() as sess:
        sess.add(UserActionsLog(user_id=user, section="Настройки", changes=text))
        sess.commit()


def add_contractor(name, color_hex, user):
    """"""
    if name and color_hex and len(color_hex) == 7:
        contractor: Contractor = Contractor(it_is="Доход", name=name, color_hex=color_hex)
        sess = Session()
        try:
            if _already_contractor(name):
                sess.close()
                return _msg("Контрагент с таким наименованием уже существует"), 400
            sess.add(contractor)
            sess.commit()
            __insert_log(user, f"Добавлен новый контрагент: {name}")
            sess.close()
            return None, 201
        except Exception as e:
            sess.close()
            return _msg("неизвестная ошибка.\nОбратитесь к администратору системы"), 500
    else:
        _msg('Некорректные данные'), 400


def edit_contractor(id, name, color_hex, user):
    """"""
    if name and color_hex and len(color_hex) == 7:
        sess = Session()
        changes = list()
        try:
            contractor: Contractor = sess.get(Contractor, id)
            if contractor is None:
                return _msg("Не найден контрагент. Обновите страницу.\nЕсли ошибка повторится обратитесь к администратору"), 404
            header = f'Изменены данные у контрагента {contractor.name}:'

            if contractor.name != name:
                if _already_contractor(name):
                    sess.close()
                    return _msg("Контрагент с таким наименованием уже существует"), 400
                changes.append(f"<br>  - Наименование стало {name}")
                contractor.name = name
            if contractor.color_hex != color_hex:
                changes.append(f"<br>  - Цвет был {contractor.color_hex}, стал {color_hex}")
                contractor.color_hex = color_hex

            sess.commit()
            if changes:
                __insert_log(user, header + ''.join(changes))
            sess.close()
            return None, 200
        except Exception as e:
            sess.close()
            return _msg("неизвестная ошибка.\n Обратитесь к администратору системы"), 500
    else:
        return _msg('Некорректные данные'), 400
    

def delete_contractor(id, user):
    """"""
    sess = Session()
    try:
        contractor: Contractor = sess.get(Contractor, id)
        if contractor is None:
            return _msg("Не найден контрагент. Обновите страницу.\nЕсли ошибка повторится обратитесь к администратору"), 404
        contractor.is_active = False
        sess.commit()
        __insert_log(user, f"Удалён контрагент: {contractor.name}")
        sess.close()
        return None, 200
    except Exception as e:
        sess.close()
        return _msg("неизвестная ошибка.\n Обратитесь к администратору системы"), 500


def add_contract_type(name, it_is, user):
    """"""
    if name and it_is in IT_IS_TYPES:
        ctype: ContractType = ContractType(it_is=it_is, name=name)
        sess = Session()
        try:
            if _already_contract_type(name, it_is):
                sess.close()
                return _msg("Тип контракта с таким наименованием уже существует"), 400
            sess.add(ctype)
            sess.commit()
            __insert_log(user, f"Добавлен новый тип {it_is.lower()}а: {name}")
            sess.close()
            return None, 201
        except Exception as e:
            sess.close()
            return _msg("неизвестная ошибка.\nОбратитесь к администратору системы"), 500
    else:
        return _msg('Некорректные данные'), 400


def edit_contract_type(id, name, user):
    """"""
    if name:
        sess = Session()
        try:
            ctype: ContractType = sess.get(ContractType, id)
            if ctype is None:
                return _msg("Не найден тип контракта. Обновите страницу.\nЕсли ошибка повторится обратитесь к администратору"), 404

            if ctype.name != name:
                if _already_contract_type(name, ctype.it_is):
                    sess.close()
                    return _msg("Тип контракта с таким наименованием уже существует"), 400
                log_text = f"Изменено наименование {[*ctype.it_is][0].lower()}а. Было {ctype.name} стало {name}"
                ctype.name = name

            sess.commit()
            __insert_log(user, log_text)
            sess.close()
            return None, 200
        except Exception as e:
            sess.close()
            return _msg("неизвестная ошибка.\n Обратитесь к администратору системы"), 500
    else:
        return _msg('Некорректные данные'), 400


def delete_contract_type(id, user):
    """"""
    sess = Session()
    try:
        ctype: ContractType = sess.get(ContractType, id)
        if ctype is None:
            return _msg("Не найден тип контракта. Обновите страницу.\nЕсли ошибка повторится обратитесь к администратору"), 404
        
        ctype.is_active = False
        sess.commit()
        __insert_log(user, f"Удалён тип {[*ctype.it_is][0].lower()}а {ctype.name}")
        sess.close()
        return None, 200
    except Exception as e:
        sess.close()
        return _msg("неизвестная ошибка.\n Обратитесь к администратору системы"), 500


def get_logs(filters: dict) -> tuple[list, int, tuple]:
    """"""
    sess = Session()
    limit_rows = 50
    query_token = filters.get("query_token")
    if query_token:
        logs_query = query_cache.get(query_token)
    else:
        logs_query = None

    if logs_query is None:
        logs_query = sess.query(UserActionsLog).order_by(UserActionsLog.id.desc())
        if filters.get("start_date"):
            logs_query = logs_query.filter(UserActionsLog.created >= filters["start_date"])
        if filters.get("end_date"):
            logs_query = logs_query.filter(UserActionsLog.created <= filters["end_date"])
        if filters.get("login"):
            logs_query = logs_query.filter(UserActionsLog.user_id == filters["login"])
        if filters.get("section"):
            logs_query = logs_query.filter(UserActionsLog.section == filters["section"])
        if filters.get("changes"):
            logs_query = logs_query.filter(UserActionsLog.changes.like(f"%{filters['changes']}%"))
        query_token = secrets.token_hex(16)
    
    query_cache[query_token] = logs_query
    row_count = logs_query.count()

    page_count_stmt = row_count // limit_rows + (1 if row_count % limit_rows else 0)
    logs_query = logs_query.offset(limit_rows * (filters.get('page', 1) - 1))
    logs_query = logs_query.limit(limit_rows)

    try:
        logs =  [_.to_dict() for _ in logs_query]
    except Exception as e:
        raise e
    finally:
        sess.close()


    return logs, 200, ('page_counts', page_count_stmt), ('query_token', query_token)

def get_filters_for_log():
    sess = Session()
    users = [{'login': _.login, 'fio': f"{_.surname} {_.name} {_.middlename}"} for _ in sess.query(UserDetail)]
    result = {
        'login': users,
        'section': [
            'Доход/Расход',
            'Настройки'
        ]
    }
    return result, 200

