<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Система финансового планирования и анализа</title>
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
                <a class="text-[#979797] hover:a-selected a-selected" href="./index.php">Дашборд</a>
                <a class="text-[#979797] hover:a-selected" href="./income_expenses.php">Доход/Расход</a>
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

    <div class="flex w-full h-[5%] items-center justify-center text-sm relative">
        <div class="flex justify-center items-center w-[60%] gap-4" id="filters">
            <p>Вывод данных по дате</p>
            <label class="flex gap-1 items-center">c <input type="month" class="input_text"></label>
            <label class="flex gap-1 items-center">по <input type="month" class="input_text"></label>
            <div class="button" id="apply_filter">Показать данные</div>
            <div class="invisible button" id="reset_filter">Сбросить фильтр</div>
        </div>

        <!-- <div class="absolute left-4 top-2 cursor-pointer" id="info_button"><img src="./img/info_btn.svg" alt=""></div> -->
    </div>

    <div class="flex flex-col justify-around min-h-[89%] pb-[25px] w-full overflow-auto">
        <div><p class="text-center" id="head_years"></p></div>
        <div class="flex w-full h-1/2 justify-center items-center mt-5">
            <div id="chart_delta_div"></div>
        </div>
        <div class="flex w-full h-1/2 justify-around items-center flex-wrap">
            <div class= "mt-5" id="chart_debit_div"></div>
            <div class= "mt-5" id="chart_credit_div"></div>
        </div>
    </div>
    <div class="hidden w-full h-full bg-[#212529ba] absolute top-0 left-0 cursor-pointer" id="background_info"></div>

    <script src="./js/effects.js"></script>
    <script src="./js/general_functions.js"></script>
    <script src="./js/connect.js"></script>
    <script src="./js/header.js"></script>

    <!-- for charts -->
    <script src="./js/highcharts/highcharts.js"></script>
    <script src="./js/highcharts/exporting.js"></script>
    <script src="./js/highcharts/export-data.js"></script>
    <script src="./js/highcharts/accessibility.js"></script>
    
    <script src="./js/charts.js"></script>
    <script src="./js/dashboard.js"></script>
</body>
</html>