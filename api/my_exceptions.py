class DateNotEnough(Exception):
    """Не хватает даты начала или конца"""


class NotContracts(Exception):
    """В Кэше нет запроса по заданному ключу"""


class BadAuth(Exception):
    """В Кэше нет запроса по заданному ключу"""