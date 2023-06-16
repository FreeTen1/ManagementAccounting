from typing import Any, Dict, List, Literal, Tuple
from db_models import (
    Role,
    User,
    UserDetail,
)
from my_engine import Session
from sqlalchemy import func, select, text, or_, and_
from hashlib import blake2b
import secrets
import my_exceptions as my_exc

def _gen_password(password: str, salt: str):
    return blake2b(password.encode(), salt=salt.encode()).hexdigest()

def check_user(login:str, password:str):
    sess = Session()
    try:
        user: User = sess.query(User).filter(
            User.login == login,
            User.is_active
        ).limit(1).scalar()
        if user is None:
            raise my_exc.BadAuth

        salt_begin = user.password[:10]
        db_pass = user.password[10:-6]
        salt_end = user.password[-6:]

        if _gen_password(password, f"{salt_begin}{salt_end}") != db_pass:
            raise my_exc.BadAuth

        user_data: UserDetail = sess.get(UserDetail, login)
        fio = f"{user_data.surname.capitalize()} {user_data.name[0].upper()}.{user_data.middlename[0].upper()}."

        return {'fio': fio, 'login': login, 'role': user.role}, 201
    except my_exc.BadAuth:
        return {"message": "Неправильный логин или пароль"}, 401
    except Exception as e:
        return None, 500
    finally:
        sess.close()


def insert_user(login: str, password: str, role='adm'):
    salt = secrets.token_urlsafe(12)
    password = _gen_password(password, salt=salt)

    sess = Session()
    try:
        user = User(login=login, password=f'{salt[:10]}{password}{salt[-6:]}', role=role)
        sess.add(user)
        sess.commit()
        sess.close()
        return 201
    except Exception as e:
        sess.close()
        return 500
