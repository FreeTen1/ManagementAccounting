from configparser import ConfigParser
from os import path
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

filename_with_settings = 'settings.ini'

config_with_global = ConfigParser()

def create_config():
    config_with_global.add_section('API')
    host = port = user = password = schema = None
    host = input('Insert ip for API or press Enter (default 127.0.0.1)\n') or '127.0.0.1'
    while not port:
        port = input('Insert port for API (only digits and port >= 5000)\n')
        if port.isdigit():
            if int(port) < 5000:
                print('Port must be >= 5000')
                port = None
        else:
            print('Port must consist of digits')
            port = None
    config_with_global.set('API', 'host', host)
    config_with_global.set('API', 'port', port)
    config_with_global.set('API', 'debug', 'false')
    config_with_global.set('API', 'ttl', '43200')
    config_with_global.set('API', 'maxsize', '10000')

    def request_data_for_db():
        nonlocal user, password, schema
        user = password = schema = None
        while not schema:
            schema = input('Insert name database on MySQL\n')
        while not user:
            user = input('Insert username with ALL_PRIVILEGES on MySQL\n')
        while not password:
            password = input(f'Insert password for "{user}" \n')
        return user, password, schema
    
    
    while test_conection(*request_data_for_db()):
        print('Bad username? password or database name. Try again')
    
    config_with_global.add_section('database')
    config_with_global.set('database', 'user', user)
    config_with_global.set('database', 'password', password)
    config_with_global.set('database', 'schema', schema)
    config_with_global.set('database', 'echo', 'True')

    # config_with_global.add_section('LDAP')
    # config_with_global.set('LDAP', 'user', '')
    # config_with_global.set('LDAP', 'password', '')
    # config_with_global.set('LDAP', 'root_dc', 'DC=MOSMETRO,DC=ru')
    # config_with_global.set('LDAP', 'server', 'main-ad0.mosmetro.ru')

    config_with_global.add_section('mail')
    config_with_global.set('mail', 'login', '')
    config_with_global.set('mail', 'password', '')
    config_with_global.set('mail', 'display_name', '')
    config_with_global.set('mail', 'server_ip', '')
    config_with_global.set('mail', 'server_port', '')
    config_with_global.set('mail', 'href', '')

    # config_with_global.add_section('primary_role')
    # config_with_global.set('mail', 'admin', '')
    # config_with_global.set('mail', 'editor', '')
    # config_with_global.set('mail', 'user', '')

    with open(filename_with_settings, 'w') as config_file:
        config_with_global.write(config_file)

def test_conection(username, password, database):
    try:
        eng = create_engine(f'mysql+mysqlconnector://{username}:{password}@localhost/{database}?auth_plugin=mysql_native_password', echo=True, encoding='utf-8')
        con = eng.connect()
        con.close()
        return None
    except SQLAlchemyError as e:
        print(e)
        return 1



if not path.isfile(filename_with_settings):
    create_config()
else:
    config_with_global.read(filename_with_settings)


API_SETTINGS = config_with_global['API']
# LDAP = config_with_global['LDAP']
MAIL = config_with_global['mail']
MYSQL = config_with_global['database']