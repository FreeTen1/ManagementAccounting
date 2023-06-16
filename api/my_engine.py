from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, Session as t_session

from config import MYSQL


engine = create_engine(
    f'mysql+mysqlconnector://{MYSQL.get("user")}:{MYSQL.get("password")}@localhost/{MYSQL.get("schema")}?auth_plugin=mysql_native_password',
    echo=MYSQL.getboolean('echo'), 
    pool_pre_ping=True
)
Session = sessionmaker(bind=engine)
metadata = MetaData(bind=engine)