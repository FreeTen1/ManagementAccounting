# coding: utf-8
from datetime import date, datetime, time
from sqlalchemy import Column, ForeignKey, text
from sqlalchemy.dialects.mysql import (
    DATE,
    VARCHAR,
    INTEGER,
    TINYINT,
    SMALLINT,
    DECIMAL,
    SET,
    BOOLEAN,
    CHAR,
    TIMESTAMP,
    TEXT,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import my_engine

Base = declarative_base(my_engine.engine, my_engine.metadata)

IT_IS_TYPES = ('Доход', 'Расход')

INT = INTEGER(unsigned=True)
TINY_INT = TINYINT(unsigned=True)
MONEY = DECIMAL(15, 2, False)

COLUMN_IS_ACTIVE = Column(BOOLEAN, nullable=False, server_default='1')
COLUMN_UPDATED = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))


class ToDictMixin():

    @staticmethod
    def assert_args(args, is_insert = True):
        pass

    @staticmethod
    def check_year(d: str):
        if d is None or d == '':
            return True
        if d.find('-') == 4 and d.find('20') == 0:
            return True
        return False

    def __is_column(self, name):
        if (
            '__' in name
            or '_sa_' in name
            or name in [
                'registry',
                'metadata',
            ]
            or isinstance(self.__getattribute__(name), (type(self.assert_args), type(self.to_dict)))
        ):
            return False
        return True
    
    def __change_value(self, value):

        if isinstance(value, datetime):
            return value.strftime('%Y-%m-%d %H:%M')
        if isinstance(value, date):
            return value.strftime('%Y-%m-%d')
        if isinstance(value, time):
            return value.strftime('%H:%M')
        return value

    def to_dict(self) -> dict:
        return {
            _: self.__change_value(self.__getattribute__(_))
            for _ in self.__dir__() 
            if self.__is_column(_)
        }
            


class Role(ToDictMixin, Base):
    __tablename__ = 'roles'
    __table_args__ = {'comment': 'Пользователи'}
    name = Column(CHAR(3), primary_key=True)


class User(ToDictMixin, Base):
    __tablename__ = 'users'
    __table_args__ = {'comment': 'Пользователи'}
    login = Column(VARCHAR(50), primary_key=True)
    password = Column(VARCHAR(144), nullable=False)
    role = Column(ForeignKey(Role.name))
    is_active = COLUMN_IS_ACTIVE.copy()


class UserDetail(ToDictMixin, Base):
    __tablename__ = 'user_details'
    __table_args__ = {'comment': 'Пользователи'}

    login = Column(ForeignKey(User.login), primary_key=True)
    surname = Column(VARCHAR(100))
    name = Column(VARCHAR(50))
    middlename = Column(VARCHAR(100), comment='Отчество')

    fk__login = relationship(User)


class PaymentAccount(ToDictMixin, Base):
    __tablename__ = 'payment_account'
    __table_args__ = {'comment': 'Расчётный счёт с корректной суммой на дату'}

    id = Column(TINY_INT, primary_key=True, comment='Уникальный идентификатор')
    start_date = Column(DATE)
    Money = Column(MONEY, nullable=False)
    is_active = COLUMN_IS_ACTIVE.copy()


class Contractor(ToDictMixin, Base):
    __tablename__ = 'contractor'
    __table_args__ = {'comment': 'Таблица контрагентов'}

    id = Column(SMALLINT(unsigned=True), primary_key=True, comment='Уникальный идентификатор')
    it_is = Column(SET(*IT_IS_TYPES), nullable=False, comment='Тип договора. Доход или расход')
    name = Column(VARCHAR(300))
    color_hex = Column(CHAR(7))
    is_active = COLUMN_IS_ACTIVE.copy()

    def to_dict(self):
        result = super().to_dict()
        result['it_is'] = list(result['it_is'])[0]

        return result


class ContractType(ToDictMixin, Base):
    __tablename__ = 'contract_types'
    __table_args__ = {'comment': 'Типы договоров'}

    id = Column(TINY_INT, primary_key=True, comment='Уникальный идентификатор')
    it_is = Column(SET(*IT_IS_TYPES), nullable=False, comment='Тип договора. Доход или расход')
    name = Column(VARCHAR(300), nullable=False)
    is_active = COLUMN_IS_ACTIVE.copy()

    def to_dict(self):
        result = super().to_dict()
        result['it_is'] = list(result['it_is'])[0]

        return result


class RepeatingContract(ToDictMixin, Base):
    __tablename__ = 'repeating_contracts'
    __table_args__ = {'comment': 'таблица с повторяющимися договорами'}

    id = Column(INT, primary_key=True, comment='Уникальный идентификатор')
    rate = Column(TINY_INT, default=1)
    start_date = Column(DATE, nullable=False)
    end_date = Column(DATE, nullable=False)
    start_pause_date = Column(DATE)
    end_pause_date = Column(DATE)

    @staticmethod
    def assert_args(args, is_insert = True):
        if is_insert:
            return all((
                ToDictMixin.check_year(args.get('start_date')),
                ToDictMixin.check_year(args.get('end_date')),
                ToDictMixin.check_year(args.get('start_pause_date')),
                ToDictMixin.check_year(args.get('end_pause_date')),
            ))


class Contract(ToDictMixin, Base):
    __tablename__ = 'contracts'
    __table_args__ = {'comment': 'Основная таблица с договорами'}

    id = Column(INT, primary_key=True, comment='Уникальный идентификатор')
    it_is = Column(SET(*IT_IS_TYPES), nullable=False, comment='Тип договора. Доход или расход')
    contractor_id = Column(ForeignKey(Contractor.id), nullable=False, index=True)
    type_id = Column(ForeignKey(ContractType.id), nullable=False, index=True)
    description = Column(VARCHAR(300), nullable=False)
    contract = Column(VARCHAR(100), nullable=True)
    contract_date = Column(DATE, nullable=True)
    order = Column(VARCHAR(100), nullable=True)
    order_date = Column(DATE, nullable=True)
    order_price = Column(MONEY, nullable=False, comment="Общая стоимость заказа")
    order_deadline = Column(DATE, nullable=False, comment="Дата окончания заказа")
    user_id = Column(ForeignKey(User.login), nullable=False)
    repeating_contract_id = Column(ForeignKey(RepeatingContract.id), index=True)
    repeating_month = Column(DATE, comment="месяц оплаты контракта")
    comment = Column(VARCHAR(500), nullable=True)
    updated = COLUMN_UPDATED.copy()
    is_active = COLUMN_IS_ACTIVE.copy()
    
    fk__contractor = relationship(Contractor)
    fk__type = relationship(ContractType)
    fk__user = relationship(User)
    fk__repeating_contract = relationship(RepeatingContract, uselist=False)
    fk__invoice = relationship("Invoice", back_populates='fk__contract')
    fk__debit = relationship("DebitCredit", primaryjoin='Contract.id == DebitCredit.debit', back_populates='fk__debit')
    fk__credit = relationship("DebitCredit", primaryjoin='Contract.id == DebitCredit.credit', back_populates='fk__credit')

    def to_dict(self):
        result = super().to_dict()
        result['contractor'] = self.fk__contractor.name
        result['type'] = self.fk__type.name
        result['it_is'] = list(result['it_is'])[0]

        if result.pop('repeating_contract_id'):
            result['is_repeated'] = True
        else:
            result['is_repeated'] = False
            

        result['invoice'] = [_.to_dict() for _ in self.fk__invoice]
        
        if self.fk__debit or self.fk__credit:
            result['is_linked'] = True
        else:
            result['is_linked'] = False

        return result
    
    def to_export(self):
        result = list()
        if self.fk__invoice:
            invoice: Invoice
            for invoice in self.fk__invoice:
                result.append((
                    self.id,
                    list(self.it_is)[0],
                    self.repeating_month,
                    self.fk__contractor.name,
                    self.fk__type.name,
                    self.description,
                    self.contract,
                    self.contract_date,
                    self.order,
                    self.order_date,
                    self.order_price,
                    self.order_deadline,
                    invoice.price,
                    invoice.date,
                    invoice.payment_expected_date,
                    invoice.payment_amount,
                    invoice.payment_date,
                ))
        else:
            result.append((
                self.id,
                list(self.it_is)[0],
                self.repeating_month,
                self.fk__contractor.name,
                self.fk__type.name,
                self.description,
                self.contract,
                self.contract_date,
                self.order,
                self.order_date,
                self.order_price,
                self.order_deadline,
                None,
                None,
                None,
                None,
                None,
            ))
            
        return result
            

    @staticmethod
    def assert_args(args, is_insert = True):
        if is_insert:
            return all((
                bool(args.get('it_is')),
                bool(args.get('contractor_id')),
                bool(args.get('type_id')),
                bool(args.get('description')),
                bool(args.get('order_price')),
                bool(args.get('order_deadline')),
                ToDictMixin.check_year(args.get('order_date')),
                ToDictMixin.check_year(args.get('contract_date')),
                ToDictMixin.check_year(args.get('order_deadline')),
                ToDictMixin.check_year(args.get('repeating_month')),
            ))
    
    def get_difference(self, args: dict) -> None:
        current_args = super().to_dict()
        temp_list = list(args.items())
        for key, value in temp_list:
            if value == current_args.get(key):
                args.pop(key)


class Invoice(ToDictMixin, Base):
    __tablename__ = 'invoices'
    __table_args__ = {'comment': 'Счета по договорам'}

    id = Column(INT, primary_key=True, comment='Уникальный идентификатор')
    name = Column(VARCHAR(100))
    date = Column(DATE, comment="Дата счёта")
    payment_expected_date = Column(DATE, nullable=False)
    price = Column(MONEY, nullable=False, comment="Сумма в выставленном счёте")
    payment_amount = Column(MONEY, comment="фактически оплачено")
    payment_date = Column(DATE)
    contract_id = Column(ForeignKey(Contract.id), index=True, nullable=False)
    updated = COLUMN_UPDATED.copy()

    fk__contract = relationship(Contract, back_populates='fk__invoice')

    @staticmethod
    def assert_args(args, is_insert = True):
        if is_insert:
            return all((
                bool(args.get('payment_expected_date')),
                bool(args.get('price')),
                bool(args.get('payment_date')) == bool(args.get('payment_amount')),
                ToDictMixin.check_year(args.get('date')),
                ToDictMixin.check_year(args.get('payment_expected_date')),
                ToDictMixin.check_year(args.get('payment_date')),
            ))
    
    def get_difference(self, args: dict) -> None:
        current_args = super().to_dict()
        temp_list = list(args.items())
        for key, value in temp_list:
            if value == current_args.get(key):
                args.pop(key)



class DebitCredit(ToDictMixin, Base):
    __tablename__ = 'debit_credit'
    __table_args__ = {'comment': 'Связка доходов с расходами'}

    debit = Column(ForeignKey(Contract.id), primary_key=True, comment='Доход')
    credit = Column(ForeignKey(Contract.id), primary_key=True, comment='Расход')

    fk__debit = relationship(Contract, primaryjoin='Contract.id == DebitCredit.debit')
    fk__credit = relationship(Contract, primaryjoin='Contract.id == DebitCredit.credit')
    
    @staticmethod
    def assert_args(args, is_insert = True):
        if is_insert:
            check = (
                args.get('debit')
                and args.get('credit')
            )
            return bool(check)


class UserActionsLog(ToDictMixin, Base):
    __tablename__ = 'user_actions_log'
    __table_args__ = {'comment': 'Действие пользователей в разделах Доход/Расход и Справочники'}

    id = Column(INT, primary_key=True, comment='Уникальный идентификатор')
    created = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))
    user_id = Column(ForeignKey(UserDetail.login), nullable=False)
    section = Column(VARCHAR(100))
    changes = Column(TEXT)

    fk__user = relationship(UserDetail)

    def to_dict(self) -> dict:
        result = super().to_dict()
        result['fio'] = f"{self.fk__user.surname} {self.fk__user.name} {self.fk__user.middlename}"
        return result


my_engine.metadata.create_all(checkfirst=True)