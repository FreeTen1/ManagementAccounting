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
        ini_set('session.gc_maxlifetime', 2592000);
        ini_set('session.cookie_lifetime', 2592000);
        session_start();
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
                <a class="text-[#979797] hover:a-selected" href="./income_expenses.php">Доход/Расход</a>
                <a class="text-[#979797] hover:a-selected a-selected" href="./reports.php">Отчеты</a>
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

        <div class="hidden items-end absolute top-0 right-[144px] h-[140px] w-[585px] z-10 cursor-pointer" id="dropdown_info_header">
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

    <div class="flex w-full h-[94%] justify-center items-center py-5 px-4 text-sm text-[#564D4E]" id="container">
        <div class="flex flex-col h-full w-[12%] min-w-[214px] gap-2" id="sidebar">
            <div class="w-full h-28 p-2 cursor-pointer rounded-l-md transition-all duration-500 overflow-hidden" id="transform_div1">
                <p>ПОЛУЧЕННЫЙ ДОХОД</p>
                <div class="hidden flex-col gap-2 w-full mt-4 pl-14">
                    <p class="hover:underline selectable_p underline" id="total_income">ОБЩИЙ ДОХОД</p>
                    <p class="hover:underline selectable_p" id="for_type_income">ПО ТИПАМ ДОХОДА</p>
                </div>
            </div>

            <div class="w-full h-8 p-2 cursor-pointer rounded-l-md transition-all duration-500">
                <p class="hover:underline selectable_p" id="paid_to_contractors">ВСЕ РАСХОДЫ</p>
            </div>
            <div class="w-full h-28 p-2 cursor-pointer rounded-l-md transition-all duration-500 overflow-hidden" id="transform_div2">
                <p>НЕ ОПЛАЧЕНО</p>
                <div class="hidden flex-col gap-2 w-full mt-4 pl-14">
                    <p class="hover:underline selectable_p underline" id="not_paid">КОНТРАГЕНТАМИ</p>
                    <p class="hover:underline selectable_p" id="we_not_paid">МЕТРО-ТЕЛЕКОМ</p>
                </div>
            </div>
            <div class="w-full h-8 p-2 cursor-pointer rounded-l-md transition-all duration-500">
                <p class="hover:underline selectable_p" id="remaining_forecast">ПРОГНОЗ ОСТАТКА</p>
            </div>
        
        </div>

        <div class="flex flex-col h-full w-[88%] px-7 bg-sidebar-select relative">

            <div class="flex w-full h-[6%] justify-between relative">
                <p class="pt-3">ТЕКУЩИЕ ДАННЫЕ ЗА <span id="curr_month_span"></span></p>

                <div class="hidden h-full w-full justify-between items-end absolute" id="filter_div1">
                    <div class="w-[20%]"></div>
                    <div class="flex gap-2">
                        <p>Вывод данных по </p><label class="flex items-end"><input type="month" class="input_text" id="end_date1"></label>
                        <div class="button" id="go_filter1">Показать данные</div>
                        <div class="button invisible" id="reset_filter1">Сбросить фильтр</div>
                    </div>

                    <div class="flex gap-2 items-center">
                        <p>Выберите месяц:</p>
                        <label class="flex relative">
                            <input type="text" class="input_text important_field search_select" id_="">
                            <ul class="load_excel_datalist search_select_datalist scrolling" style="display: none;">

                            </ul>
                        </label>
                        <div class="button" id="load_excel_remaining_forecast">Выгрузить</div>
                    </div>
                </div>

                <div class="flex gap-7 h-full items-end" id="filter_div2">
                    <p>Вывод данных по дате</p>
                    <label class="flex gap-2 items-end">с <input type="month" class="input_text" id="start_date"></label>
                    <label class="flex gap-2 items-end">по <input type="month" class="input_text" id="end_date"></label>
                    <div class="button" id="go_filter2">Показать данные</div>
                    <div class="button invisible" id="reset_filter2">Сбросить фильтр</div>
                </div>
            </div>

            <div class="flex w-full h-[94%] py-8" id="analitics_content">
                <!--  -->

            </div>
            
            <div class="absolute left-4 bottom-4 cursor-pointer" id="info_button"><img src="./img/info_btn.svg" alt=""></div>
        </div>
    </div>
    <div class="hidden w-full h-full bg-[#212529db] absolute top-0 left-0 cursor-pointer" id="background_info"></div>


    <script src="./js/effects.js"></script>
    <script src="./js/general_functions.js"></script>
    <script src="./js/connect.js"></script>
    <script src="./js/header.js"></script>
    <script src="./js/axios/axios.js"></script>

    <!-- for charts -->
    <script src="./js/highcharts/highcharts.js"></script>
    <script src="./js/highcharts/exporting.js"></script>
    <script src="./js/highcharts/export-data.js"></script>
    <script src="./js/highcharts/accessibility.js"></script>
    
    
    <script src="./js/charts.js"></script>
    <script src="./js/analyses_html.js"></script>
    <script src="./js/reports.js"></script>

</body>
</html>