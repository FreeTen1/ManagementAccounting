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

        if ($_COOKIE["role"] != 'adm') {
            header('Location: ./');
        }
    ?>
    <header class="flex w-full h-[6%] bg-[#212429] items-center justify-between relative">
        <div class="flex justify-between items-center gap-7">
            <p class="text-[#DEE2E6] w-[315px]">Система</p>
            <div class="flex gap-6">
                <a class="text-[#979797] hover:a-selected" href="./index.php">Дашборд</a>
                <a class="text-[#979797] hover:a-selected" href="./income_expenses.php">Доход/Расход</a>
                <a class="text-[#979797] hover:a-selected" href="./reports.php">Отчеты</a>
                <?php 
                    if ($_COOKIE["role"] == 'adm') {
                        echo '<a class="text-[#979797] hover:a-selected a-selected" href="./settings.php">Настройки</a>';
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

    <!-- вкладки -->
    <div class="flex w-full h-[4%] justify-center" style="box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.1);">
        <div class="w-[1200px] h-full flex" id="tabs">
            <div class="flex w-[150px] justify-center items-center text-base font-semibold cursor-pointer hover:bg-[#DEE2E6] tab-selected" label="container_manuals" id="manuals">Справочники</div>
            <div class="flex w-[150px] justify-center items-center text-base font-semibold cursor-pointer hover:bg-[#DEE2E6]" label="container_logs" id="logs">Логи</div>
        </div>
    </div>

    <!-- контейнер -->
    <div class="flex w-full h-[90%] bg-[#F0EFEF] justify-center py-2">
        <!-- справочники -->
        <div class="single_container" id="container_manuals">
            <div class="flex justify-between w-full h-[5%] px-6">
                <div class="w-[150px]"></div>
                <p class="flex items-center">Справочники</p>
                <label class="w-[150px] flex items-center justify-end gap-2 cursor-pointer" id="show_hide_all"><span>Скрыть все</span> <img class="transition-transform duration-300" src="./img/arrow_up.svg"></label>
            </div>

            <div class="w-full h-[95%] overflow-y-auto scrolling text-sm">

                <!-- вся строка "Контрагенты" -->
                <div class="main_manuals_div" open="false" style="height: 35px;">
                    <!-- шапка -->
                    <div class="row_manuals head_manuals">
                        <label class="flex gap-2 items-center cursor-pointer"><img class="transition-transform duration-300 rotate-180" src="./img/arrow_up.svg">Контрагенты</label>
                        <span></span>
                    </div>
                    
                    <!-- мини строки (сюда добавлять) -->
                    <div id="contractors">

                        <!-- мини строка с кнопкой -->
                        <div class="justify-center row_manuals">
                            <label class="flex gap-2 items-center cursor-pointer add_new_row" color="true"><img class="w-[20px] h-[20px]" src="./img/plus_button.svg">ДОБАВИТЬ НОВЫЙ</label>
                        </div>
                        
                        <!-- мини строка для создания -->
                        <!-- <div class="row_manuals">
                            <input type="text" class="input_text" placeholder="Введите новое значение">
                            <div class="flex gap-4 items-center justify-end w-[200px]">
                                <input class="choose_color_div important_field" value="" placeholder="Выберите цвет">
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer" src="./img/cross.svg" title="Закрыть"></div>
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer" src="./img/diskette.svg" title="Сохранить"></div>
                            </div>
                        </div> -->

                        <!-- мини строка списка -->
                        <!-- <div class="row_manuals row_event" id_row="1">
                            <p>ПАОаа</p>
                            <div class="flex gap-4 items-center justify-end w-[200px]">
                                <input class="choose_color_div" value="#FFF000" disabled>
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer edit" src="./img/edit.svg" title="Отредактировать"></div>
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer w-[24px] h-[24px] delete" src="./img/close_sad.svg" title="Удалить"></div>
                            </div>
                        </div> -->

                    </div>
                </div>

                <!-- вся строка "Типы дохода" -->
                <div class="main_manuals_div" open="false" style="height: 35px;">
                    <!-- шапка -->
                    <div class="row_manuals head_manuals">
                        <label class="flex gap-2 items-center cursor-pointer"><img class="transition-transform duration-300 rotate-180" src="./img/arrow_up.svg">Типы дохода</label>
                        <span></span>
                    </div>
                    
                    <!-- мини строки (сюда добавлять) -->
                    <div id="type_income">

                        <!-- мини строка с кнопкой -->
                        <div class="justify-center row_manuals">
                            <label class="flex gap-2 items-center cursor-pointer add_new_row" it_is="Доход" color="false"><img class="w-[20px] h-[20px]" src="./img/plus_button.svg">ДОБАВИТЬ НОВЫЙ</label>
                        </div>
                        
                        <!-- мини строка для создания -->
                        <!-- <div class="row_manuals">
                            <input type="text" class="input_text" placeholder="Введите новое значение">
                            <div class="flex gap-4 items-center justify-end w-[200px]">
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer" src="./img/cross.svg" title="Закрыть"></div>
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer" src="./img/diskette.svg" title="Сохранить"></div>
                            </div>
                        </div> -->

                        <!-- мини строка списка -->
                        <div class="row_manuals row_event" id_row="2">
                            <p>ПАО</p>
                            <div class="flex gap-4 items-center justify-end w-[200px]">
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer edit" src="./img/edit.svg" title="Отредактировать"></div>
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer w-[24px] h-[24px] delete" src="./img/close_sad.svg" title="Удалить"></div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- вся строка "Типы расхода" -->
                <div class="main_manuals_div" open="false" style="height: 35px;">
                    <!-- шапка -->
                    <div class="row_manuals head_manuals">
                        <label class="flex gap-2 items-center cursor-pointer"><img class="transition-transform duration-300 rotate-180" src="./img/arrow_up.svg">Типы расхода</label>
                        <span></span>
                    </div>
                    
                    <!-- мини строки (сюда добавлять) -->
                    <div id="type_consumption">

                        <!-- мини строка с кнопкой -->
                        <div class="justify-center row_manuals">
                            <label class="flex gap-2 items-center cursor-pointer add_new_row" it_is="Расход" color="false"><img class="w-[20px] h-[20px]" src="./img/plus_button.svg">ДОБАВИТЬ НОВЫЙ</label>
                        </div>
                        
                        <!-- мини строка для создания -->
                        <!-- <div class="row_manuals">
                            <input type="text" class="input_text" placeholder="Введите новое значение">
                            <div class="flex gap-4 items-center justify-end w-[200px]">
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer" src="./img/cross.svg" title="Закрыть"></div>
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer" src="./img/diskette.svg" title="Сохранить"></div>
                            </div>
                        </div> -->

                        <!-- мини строка списка -->
                        <div class="row_manuals row_event" id_row="2">
                            <p>ПфывАО</p>
                            <div class="flex gap-4 items-center justify-end w-[200px]">
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer edit" src="./img/edit.svg" title="Отредактировать"></div>
                                <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer w-[24px] h-[24px] delete" src="./img/close_sad.svg" title="Удалить"></div>
                            </div>
                        </div>

                    </div>
                </div>
            
            </div>

        </div>
        
        <!-- логи -->
        <div class="single_container flex justify-between flex-col hidden" id="container_logs">
            <form class="flex w-full h-[10%] min-h-[80px] px-9 py-3 text-[#6C757E] text-xs justify-between" id="logs_filter">
                <div>ПОИСК</div>
                <div class="flex flex-col justify-between">
                    <div class="flex items-center gap-1"><p class="w-[20px] text-right">С</p><input class="input_text w-auto start_date_filter" type="date"><input class="input_text w-auto start_date_filter" type="time"></div>
                    <div class="flex items-center gap-1"><p class="w-[20px] text-right">ПО</p><input class="input_text w-auto end_date_filter" type="date"><input class="input_text w-auto end_date_filter" type="time"></div>
                </div>
                <div class="flex flex-col justify-between w-[40%]">
                    <div>
                        <label class="flex flex-col w-full relative">
                            <input type="text" class="input_text search_select" id="login_filter" placeholder="Выбрать ФИО" id_="" autocomplete="off">
                            <ul class="search_select_datalist scrolling" id="login_filter_datalist" style="display: none;">
                                <!-- <li value="1">Тестовый 1</li> -->
                            </ul>
                        </label>
                    </div>
                    <div class="flex justify-between">
                        <label class="flex flex-col w-[30%] relative">
                            <input type="text" class="input_text search_select" id="section_filter" placeholder="Выбрать раздел" id_="" autocomplete="off">
                            <ul class="search_select_datalist scrolling" id="section_filter_datalist" style="display: none;">
                                <!-- <li value="1">Тестовый 1</li> -->
                            </ul>
                        </label>
                        <input type="text" class="input_text w-[68%]" id="changes_filter" placeholder="Текст">
                    </div>
                </div>
                <div class="flex flex-col justify-between">
                    <div class="button" id="apply_filter">Показать данные</div>
                    <div class="button" id="reset_filter">Сбросить фильтр</div>
                </div>
                <!-- <div class="flex items-end cursor-pointer"><img src="./img/smt_img.svg" alt=""></div> -->
            </form>

            <div class="h-[84%] overflow-y-auto scrolling">
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-[#DEE2E6] sticky top-0 z-10">
                        <tr>
                            <th scope="col" class="px-9 py-3">Дата/Время</th>
                            <th scope="col" class="px-9 py-3">ФИО</th>
                            <th scope="col" class="px-9 py-3">Раздел</th>
                            <th scope="col" class="px-9 py-3">История</th>
                        </tr>
                    </thead>
                    <tbody id="main_table_scroll">
                        <tr class="bg-white border-b">
                            <td class="px-9 py-2">10.01.2023  13:32</td>
                            <td class="px-9 py-2">Иванов Иван Иванович</td>
                            <td class="px-9 py-2">Доход/Расход</td>
                            <td class="px-9 py-2">Изменены данные: Иванов Иван Иванович</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex w-full justify-between items-center h-[4%] min-h-[33px]">
                <div class="w-[10%]"></div>

                <div class="flex h-5/6 justify-between text-[#6C757E] text-xs" id="main_pagination_div">
                    <div class="pagination-divs rounded-l"><img class="w-1/2 h-1/2" src="./img/pagination_arrow_2.svg" alt=""></div>
                    <div class="pagination-divs"><img class="w-1/2 h-1/2" src="./img/pagination_arrow.svg" alt=""></div>
                    <div class="pagination-divs pagination-divs-selected">1</div>
                    <div class="pagination-divs">2</div>
                    <div class="pagination-divs">3</div>
                    <div class="pagination-divs">4</div>
                    <div class="pagination-divs">5</div>
                    <div class="pagination-divs"><img class="w-1/2 h-1/2 rotate-180" src="./img/pagination_arrow.svg" alt=""></div>
                    <div class="pagination-divs rounded-r"><img class="w-1/2 h-1/2 rotate-180" src="./img/pagination_arrow_2.svg" alt=""></div>
                </div>

                <div class="flex w-[10%] h-full text-xs items-center text-[#716D6D]" id="all_count_rows_pag"></div>
            </div>
        </div>
    
    </div>

    <script src="./js/effects.js"></script>
    <script src="./js/general_functions.js"></script>
    <script src="./js/connect.js"></script>
    <script src="./js/header.js"></script>
    <script src="./js/pagination.js"></script>
    
    <script src="./js/color_picker/colorPicker.data.js"></script>
    <script src="./js/color_picker/colorPicker.js"></script>
    <script src="./js/color_picker/colors.js"></script>
    <script src="./js/color_picker/jsColor.js"></script>
    <script src="./js/confirm_alert/smoke-pure.js"></script>

    <script src="./js/settings_manuals.js"></script>
    <script src="./js/settings_logs.js"></script>
    <script src="./js/settings.js"></script>

</body>
</html>