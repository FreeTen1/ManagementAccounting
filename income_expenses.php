<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Система</title>
    <link rel="stylesheet" href="./css/main.css">
    <link rel="stylesheet" href="./fonts/font.css">
</head>
<body class="scrolling">
    <?php
        $session = $_COOKIE["session"];
        if (!$session) {
            header('Location: auth');
        } else {
            $strHeader = get_headers('http://'.$_SERVER["HTTP_HOST"].'/manage_acc/auth?session='.$session)[0];
            $statusCode = substr($strHeader, 9, 3);
            if ($statusCode == 401 || $statusCode == 503) {
                header('Location: auth');
            } else {
                echo '<script>window.session = "'.$session.'"</script>';
            }
        }
    ?>
    <header class="flex w-full h-[6%] bg-[#212429] items-center justify-between relative">
        <div class="flex justify-between items-center gap-7">
            <p class="text-[#DEE2E6] w-[315px]">Система</p>
            <div class="flex gap-6">
                <a class="text-[#979797] hover:a-selected" href="./index.php">Дашборд</a>
                <a class="text-[#979797] hover:a-selected a-selected" href="./income_expenses.php">Доход/Расход</a>
                <a class="text-[#979797] hover:a-selected" href="./reports.php">Отчеты</a>
                <?php 
                    if ($_COOKIE["role"] == 'adm') {
                        echo '<a class="text-[#979797] hover:a-selected" href="./settings.php">Настройки</a>';
                    }
                ?>
            </div>
        </div>

        <div class="flex gap-6 items-center">
            <img class="cursor-pointer" src="./img/logo_rub.svg" alt="" id="rub_img">
            <p class="a-selected" id="fio"><?php echo $_COOKIE["fio"]?></p>
            
            <div class="hidden flex-col justify-end absolute right-9 h-[75px] cursor-pointer z-10" id="log_out_btn_div">
                <div class="exit_button" id="log_out_btn">Выйти</div>
            </div>
            
        </div>

        <div class="hidden items-end absolute top-0 right-[144px] h-[140px] w-[585px] z-50 cursor-pointer" id="dropdown_info_header">
            <div class="flex w-full h-20 bg-[#212429] rounded-b-md py-4 px-5 justify-between text-[#DEE2E6] text-xs">
                <div class="flex flex-col justify-between w-[72%] h-full">
                    <div class="flex w-full items-center justify-end gap-1">
                        ФАКТИЧЕСКИЙ ОСТАТОК:
                        <div class="flex justify-center items-center w-28 h-5 border-[1px] rounded" id="fact"></div>
                    </div>
                    <div class="flex w-full items-center justify-end gap-1">
                        ПЛАНОВЫЙ ОСТАТОК НА КОНЕЦ МЕСЯЦА:
                        <div class="flex justify-center items-center w-28 h-5 border-[1px] rounded" id="plan"></div>
                    </div>
                </div>
                <div class="flex flex-col justify-between w-[25%] h-full">
                    <div class="flex w-full items-center justify-end gap-1">
                        НА:
                        <div class="flex justify-center items-center w-28 h-5 border-[1px] rounded" id="rub_date"></div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="flex w-full h-[6%] items-center justify-between px-2 relative" id="function_header">
        <div class="flex gap-12 min-w-[560px]">
            <div class="button" id="excel_load">Выгрузить в Excel</div>
            <div class="flex gap-1 cursor-pointer text-[#6C757E]" id="active_mini_search">
                <img src="./img/search.svg" alt="">
                <p>ПОИСК</p>
            </div>
        </div>
        <div class="hidden text-[#9bc8f8]" id="filter_text_apply"><p>Применена фильтрация</p></div>
        <div class="flex gap-7">
            <div class="flex gap-1 cursor-pointer items-center text-[#6C757E]" id="active_full_search">
                <p>РАСШИРЕННЫЙ ПОИСК</p>
                <img src="./img/search_arrow.svg" alt="" class="transition-transform duration-500">
            </div>
            <div class="flex gap-1 cursor-pointer items-center text-[#6C757E]" id="active_toggle_hide_columns">
                <p>СТОЛБЦЫ</p>
                <img src="./img/search_arrow.svg" alt="" class="transition-transform duration-500">
            </div>
            <div class="button" id="income_btn">Внести доход</div>
            <div class="button" id="expense_btn">Внести расход</div>
        </div>
    </div>

    <div class="flex w-full h-0 transition-height items-center justify-center invisible text-xs overflow-hidden" id="full_search">
        <div class="flex flex-col w-[77%] h-[98%] rounded-md bg-[#ECECEC] px-5">
            <div class="flex w-full h-[13%] items-center gap-4">
                <p>Вывод данных по датам оплаты (плановым и фактическим)</p>
                <label class="flex h-full gap-1 items-center">с <input type="date" class="input_text start_report_date_full_search"></label>
                <label class="flex h-full gap-1 items-center">по <input type="date" class="input_text end_report_date_full_search"></label>
            </div>
            <div class="flex w-full h-[83%] justify-between">
                <div class="flex h-full w-[20%] flex-col py-1 gap-2">
                    <div class="flex w-full h-[7%]  justify-around items-center">
                        <label class="flex gap-2 cursor-pointer items-center">
                            <input class="w-[20px] h-[20px]" type="checkbox" name="checkbox_type" value="Доход">ДОХОД
                        </label>
                        <label class="flex gap-2 cursor-pointer items-center">
                            <input class="w-[20px] h-[20px]" type="checkbox" name="checkbox_type" value="Расход">РАСХОД
                        </label>
                    </div>
                    <div class="flex flex-col justify-between w-full gap-2">
                        <label class="flex flex-col w-full relative">id: 
                            <input type="text" class="input_text contract_id_full_search" oninput="only_regex(this, /\d/g)">
                        </label>
                        <label class="flex flex-col w-full relative">Контрагент: 
                            <input type="text" class="input_text contractor_full_search search_select" id_="">
                            <ul class="contractor_select search_select_datalist scrolling" style="display: none;">

                            </ul>
                        </label>
                        <label class="flex flex-col w-full relative">Тип дохода/расхода: 
                            <input type="text" class="input_text type_id_full_search search_select" id_="">
                            <ul class="contract_type_select search_select_datalist scrolling z-auto" style="display: none;">

                            </ul>
                        </label>
                        <label class="flex flex-col w-full">Описание работ/продукции: <input type="text" class="input_text description_full_search"></label>

                        <div class="flex flex-col gap-1 w-full border-[0.5px] border-dashed border-[#7C8A98] rounded-md py-1 px-[7px]">
                            <p>Месяц платежа:</p>
                            <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">с:</p><input type="month" class="input_text start_repeating_contract_full_search"></label>
                            <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">по:</p><input type="month" class="input_text end_repeating_contract_full_search"></label>
                        </div>
                    </div>
                </div>
                <div class="flex h-full w-[15%] flex-col gap-2 py-1 bg-[#D9D9D980] rounded-lg px-3">
                    <p>ДОГОВОР</p>
                    <label class="flex flex-col w-full">Номер договора: <input type="text" class="input_text contract_full_search"></label>
                    <div class="flex flex-col gap-1 w-full border-[0.5px] border-dashed border-[#7C8A98] rounded-md py-1 px-[7px]">
                        <p>Дата договора:</p>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">с:</p><input type="date" class="input_text start_contract_date_full_search"></label>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">по:</p><input type="date" class="input_text end_contract_date_full_search"></label>
                    </div>
                    
                </div>
                <div class="flex h-full w-[15%] flex-col gap-2 py-1 bg-[#D9D9D980] rounded-lg px-3">
                    <p>ЗАКАЗ</p>
                    <label class="flex flex-col w-full">Номер заказа: <input type="text" class="input_text order_full_search"></label>
                    <!-- <label class="flex flex-col w-full">Дата заказа: <input type="date" class="input_text order_date_full_search"></label> -->
                    <div class="flex flex-col gap-1 w-full border-[0.5px] border-dashed border-[#7C8A98] rounded-md py-1 px-[7px]">
                        <p>Дата заказа:</p>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">с:</p><input type="date" class="input_text start_order_date_full_search"></label>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">по:</p><input type="date" class="input_text end_order_date_full_search"></label>
                    </div>
                    <label class="flex flex-col w-full">Общая стоимость, с НДС: <input type="text" class="input_text order_price_full_search" oninput="digits_float(this)"></label>
                    <!-- <label class="flex flex-col w-full">Дата окончания заказа: <input type="date" class="input_text order_deadline_full_search"></label> -->
                    <div class="flex flex-col gap-1 w-full border-[0.5px] border-dashed border-[#7C8A98] rounded-md py-1 px-[7px]">
                        <p>Дата окончания заказа:</p>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">с:</p><input type="date" class="input_text start_order_deadline_full_search"></label>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">по:</p><input type="date" class="input_text end_order_deadline_full_search"></label>
                    </div>
                </div>
                <div class="flex h-full w-[15%] flex-col gap-2 py-1 bg-[#D9D9D980] rounded-lg px-3">
                    <p>СЧЕТ ВЫСТАВЛЕН</p>
                    <label class="flex flex-col w-full">Номер счёта: <input type="text" class="input_text invoice_name_full_search"></label>
                    <label class="flex flex-col w-full">Сумма счёта: <input type="text" class="input_text invoice_price_full_search" oninput="digits_float(this)"></label>
                    <!-- <label class="flex flex-col w-full">Дата счёта: <input type="date" class="input_text invoice_date_full_search"></label> -->
                    <div class="flex flex-col gap-1 w-full border-[0.5px] border-dashed border-[#7C8A98] rounded-md py-1 px-[7px]">
                        <p>Дата счёта:</p>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">с:</p><input type="date" class="input_text start_invoice_date_full_search"></label>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">по:</p><input type="date" class="input_text end_invoice_date_full_search"></label>
                    </div>
                    <!-- <label class="flex flex-col w-full">Ожидаемая дата платежа: <input type="date" class="input_text payment_expected_date_full_search"></label> -->
                    <div class="flex flex-col gap-1 w-full border-[0.5px] border-dashed border-[#7C8A98] rounded-md py-1 px-[7px]">
                        <p>Ожидаемая дата платежа:</p>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">с:</p><input type="date" class="input_text start_payment_expected_date_full_search"></label>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">по:</p><input type="date" class="input_text end_payment_expected_date_full_search"></label>
                    </div>
                </div>
                <div class="flex h-full w-[15%] flex-col gap-2 py-1 bg-[#BBC9B780] rounded-lg px-3">
                    <p>ПЛАТЕЖ ПОЛУЧЕН/ОТПРАВЛЕН</p>
                    <label class="flex flex-col w-full">Сумма, с НДС: <input type="text" class="input_text payment_amount_full_search" oninput="digits_float(this)"></label>
                    <!-- <label class="flex flex-col w-full">Дата платежа: <input type="date" class="input_text payment_date_full_search"></label> -->
                    <div class="flex flex-col gap-1 w-full border-[0.5px] border-dashed border-[#7C8A98] rounded-md py-1 px-[7px]">
                        <p>Дата платежа:</p>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">с:</p><input type="date" class="input_text start_payment_date_full_search"></label>
                        <label class="flex w-full gap-1"><p class="flex items-center justify-end min-w-[17px]">по:</p><input type="date" class="input_text end_payment_date_full_search"></label>
                    </div>
                </div>
                <div class="flex h-full w-[15%] flex-col gap-2 py-1 justify-center items-center">
                    <div class="button" id="find_full_search">Найти</div>
                    <div class="button" id="reset_full_search">Сбросить</div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex w-full h-0 transition-height invisible overflow-hidden px-2 flex-col leading-3 z-20" id="toggle_hide_columns">
        <table class="w-full text-[12px] border-separate border-spacing-0">
            <thead class="bg-[#D9D9D9] sticky top-0 z-10">
                <tr class="h-[20px]">
                    <th rowspan="2" class="col-div text-center">id</th>
                    <th rowspan="2" class="col-div text-center">Доход/Расход</th>
                    <th rowspan="2" class="col-div text-center">Контрагент</th>
                    <th rowspan="2" class="col-div text-center">Тип дохода/расхода</th>
                    <th rowspan="2" class="col-div text-center">Описание работ/продукции</th>
                    <th rowspan="2" class="col-div text-center">Номер договора</th>
                    <th rowspan="2" class="col-div text-center">Дата договора</th>
                    <th rowspan="2" class="col-div text-center">Номер заказа</th>
                    <th rowspan="2" class="col-div text-center">Дата заказа</th>
                    <th rowspan="2" class="col-div text-center">Общая стоимость заказа, с НДС</th>
                    <th rowspan="2" class="col-div text-center">Дата окончания заказа</th>
                    <th colspan="3" class="col-div text-center bg-[#CDCBCB]">Счет выставлен</th>
                    <th rowspan="2" class="col-div text-center">Ожидаемая дата платежа</th>
                    <th colspan="2" class="col-div text-center bg-[#CCD4C9]">Платеж получен/отправлен</th>
                    <th rowspan="2" class="col-div"></th>
                </tr>
                <tr class="">
                    <th class="col-div text-center bg-[#CDCBCB]">Номер</th>
                    <th class="col-div text-center bg-[#CDCBCB]">Сумма</th>
                    <th class="col-div text-center bg-[#CDCBCB]">Дата</th>
                    <th class="col-div text-center bg-[#CCD4C9]">Сумма, с НДС</th>
                    <th class="col-div text-center bg-[#CCD4C9]">Дата</th>
                </tr>

                <tr class="bg-white" id="">
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_contract_id">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_it_is">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_contractor">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_type">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_description">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_contract">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_contract_date">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_order">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_order_date">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_order_price">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_order_deadline">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_invoice_name">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_invoice_price">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_invoice_date">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_payment_expected_date">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_payment_amount">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th class="col-div px-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" id="column_payment_date">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </th>
                    <th colspan="2" class="col-div px-1">
                        <div class="button w-24 my-1 mx-auto" id="reset_toggle_hide_columns">Сбросить</div>
                    </th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="flex flex-col w-full h-[88%] px-2 overflow-auto transition-height" id="main_content">
        <div class="w-full overflow-auto h-[96%] scrolling">
            <table class="w-full text-[12px] border-separate border-spacing-0">
                <thead class="bg-[#D9D9D9] sticky top-0 z-10">
                    <tr class="h-[20px]">
                        <th rowspan="2" class="col-div text-center cursor-pointer relative contract_id_w" sort_order="null" sort_key="contract_id">id</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative it_is_w" sort_order="null" sort_key="it_is"></th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative contractor_w" sort_order="null" sort_key="contractor_id">Контрагент</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative type_w" sort_order="null" sort_key="type_id">Тип дохода/расхода</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative description_w" sort_order="null" sort_key="description">Описание работ/продукции</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative contract_w" sort_order="null" sort_key="contract">Номер договора</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative contract_date_w" sort_order="null" sort_key="contract_date">Дата договора</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative order_w" sort_order="null" sort_key="order">Номер заказа</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative order_date_w" sort_order="null" sort_key="order_date">Дата заказа</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative order_price_w" sort_order="null" sort_key="order_price">Общая стоимость заказа, с НДС</th>
                        <th rowspan="2" class="col-div text-center cursor-pointer relative order_deadline_w" sort_order="null" sort_key="order_deadline">Дата окончания заказа</th>
                        <th colspan="3" class="col-div text-center bg-[#CDCBCB] invoiced_main_w">Счет выставлен</th>
                        <th rowspan="2" class="col-div text-center payment_expected_date_w">Ожидаемая дата платежа</th>
                        <th colspan="2" class="col-div text-center bg-[#CCD4C9] payment_main_w">Платеж получен/отправлен</th>
                        <th rowspan="2" class="col-div chain_w"></th>
                        <th rowspan="2" class="col-div plus_w"></th>
                    </tr>
                    <tr class="">
                        <th class="col-div text-center bg-[#CDCBCB] invoice_name_w">Номер</th>
                        <th class="col-div text-center bg-[#CDCBCB] invoice_price_w">Сумма</th>
                        <th class="col-div text-center bg-[#CDCBCB] invoice_date_w">Дата</th>
                        <th class="col-div text-center bg-[#CCD4C9] payment_amount_w">Сумма, с НДС</th>
                        <th class="col-div text-center bg-[#CCD4C9] payment_date_w">Дата</th>
                    </tr>

                    <tr class="bg-white h-2">
                        <td colspan="25"></td>
                    </tr>

                    <tr class="hidden bg-white" id="mini_search">
                        <th class="col-div px-1 border-none contract_id_w"><input type="text" class="input_text contract_id_mini_search"></th>
                        <th class="col-div px-1 border-none it_is_w">
                            <label class="flex flex-col w-full relative">
                                <input type="text" class="input_text it_is_mini_search search_select" id_="">
                                <ul class="search_select_datalist scrolling" style="display: none;">
                                    <li value="Доход">Доход</li>
                                    <li value="Расход">Расход</li>
                                </ul>
                            </label>
                        </th>
                        <th class="col-div px-1 border-none contractor_w">
                            <label class="flex flex-col w-full relative">
                                <input type="text" class="input_text contractor_mini_search search_select" id_="">
                                <ul class="contractor_select search_select_datalist scrolling min-w-[235px]" style="display: none;">

                                </ul>
                            </label>
                        </th>
                        <th class="col-div px-1 border-none type_w">
                            <label class="flex flex-col w-full relative">
                                <input type="text" class="input_text type_id_mini_search search_select" id_="">
                                <ul class="contract_type_select search_select_datalist scrolling" style="display: none;">

                                </ul>
                            </label>
                        </th>
                        <th class="col-div px-1 border-none description_w"><input type="text" class="input_text description_mini_search"></th>
                        <th class="col-div px-1 border-none contract_w"><input type="text" class="input_text contract_mini_search"></th>
                        <th class="col-div px-1 border-none contract_date_w"><input type="date" class="input_text contract_date_w contract_date_mini_search"></th>
                        <th class="col-div px-1 border-none order_w"><input type="text" class="input_text order_mini_search"></th>
                        <th class="col-div px-1 border-none order_date_w"><input type="date" class="input_text order_date_w order_date_mini_search"></th>
                        <th class="col-div px-1 border-none order_price_w"><input type="text" class="input_text order_price_mini_search" oninput="digits_float(this)"></th>
                        <th class="col-div px-1 border-none order_deadline_w"><input type="date" class="input_text order_deadline_w order_deadline_mini_search"></th>
                        <th class="col-div px-1 border-none invoice_name_w"><input type="text" class="input_text invoice_name_mini_search"></th>
                        <th class="col-div px-1 border-none invoice_price_w"><input type="text" class="input_text invoice_price_mini_search"></th>
                        <th class="col-div px-1 border-none invoice_date_w"><input type="date" class="input_text invoice_date_w invoice_date_mini_search"></th>
                        <th class="col-div px-1 border-none payment_expected_date_w"><input type="date" class="input_text payment_expected_date_w payment_expected_date_mini_search"></th>
                        <th class="col-div px-1 border-none payment_amount_w"><input type="text" class="input_text payment_amount_mini_search"  oninput="digits_float(this)"></th>
                        <th class="col-div px-1 border-none payment_date_w"><input type="date" class="input_text payment_date_w payment_date_mini_search"></th>
                        <th colspan="2" class="col-div px-1 border-none"><div class="flex flex-col gap-1"><div class="button w-24" id="find_mini_search">Найти</div><div class="button w-24" id="reset_mini_search">Сбросить</div></div></th>
                    </tr>

                    <tr class="bg-white h-2">
                        <td colspan="25"></td>
                    </tr>
                </thead>
                <tbody id="main_table_scroll">
                    <!-- <tr class="bg-g-row">
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                        <td class="col-div">lorem2</td>
                    </tr> -->
                </tbody>
            </table>
        </div>
        
        <div class="flex w-full justify-between items-center h-[4%] min-h-[33px]">
            <div class="w-[10%]"></div>

            <div class="flex h-5/6 justify-between text-[#6C757E] text-xs" id="main_pagination_div">
                <!-- <div class="pagination-divs rounded-l"><img class="w-1/2 h-1/2" src="./img/pagination_arrow_2.svg" alt=""></div>
                <div class="pagination-divs"><img class="w-1/2 h-1/2" src="./img/pagination_arrow.svg" alt=""></div>
                <div class="pagination-divs pagination-divs-selected">1</div>
                <div class="pagination-divs">2</div>
                <div class="pagination-divs">3</div>
                <div class="pagination-divs">4</div>
                <div class="pagination-divs">5</div>
                <div class="pagination-divs"><img class="w-1/2 h-1/2 rotate-180" src="./img/pagination_arrow.svg" alt=""></div>
                <div class="pagination-divs rounded-r"><img class="w-1/2 h-1/2 rotate-180" src="./img/pagination_arrow_2.svg" alt=""></div> -->
            </div>

            <div class="flex w-[10%] h-full text-xs items-center text-[#716D6D]" id="all_count_rows_pag"></div>
        </div>

    </div>

    <div class="hidden w-full h-full bg-[#363636A6] absolute top-0 left-0 justify-center items-center min-w-[1547px] z-20" id="background">
        <div class="hidden w-[80%] min-h-[500px] max-h-[825px] bg-white flex-col justify-between rounded-md" id="insert_it_is" is_it="">
            
            <!--  -->

            <!--  -->

        </div>
    </div>

    <script src="./js/effects.js"></script>
    <script src="./js/general_functions.js"></script>
    <script src="./js/connect.js"></script>
    <script src="./js/header.js"></script>
    <script src="./js/axios/axios.js"></script>

    <script src="./js/pagination.js"></script>
    <script src="./js/table.js"></script>
    <script src="./js/income_window_html.js"></script>
    <script src="./js/main.js"></script>
</body>
</html>