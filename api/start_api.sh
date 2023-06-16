DIRNAME=`dirname $0`
PY3=`which python3.10`
start-stop-daemon -S -b -x $PY3 -d $DIRNAME -m -v -p ./man_acc.pid -- ./main_api.py
