function incomeWindowHtml(is_it) {
    const income_window_html = `
    <div class="flex w-full items-center justify-between rounded-t-md px-6 py-3" id="income_window_head">
        <p class="text-base text-[#394858]"><span id="span_for_delete">Внести</span> <Span id="it_is_span"></Span><span id="description_head_span"></span></p>
        <img src="./img/close_button.svg" title="Закрыть" class="cursor-pointer" id="close_insert_it_is">
    </div>
    
    
    <div class="w-full px-6 overflow-y-auto text-xs text-[#564D4E] scrolling" id="main_info_div">
        <div class="flex flex-col w-full h-[340px] border-bottom mb-2 py-2 main_contracts_div">
            <div class="flex w-full justify-between h-[100%]">
                <div class="flex w-[20%] flex-col px-3 pt-2">
                    <div class="w-full h-4"></div>
                    <label class="w-full mt-2 relative">
                        Контрагент:
                        <input type="text" class="input_text contractor_select_value important_field search_select" id_="">
                        <ul class="contractor_select search_select_datalist scrolling" style="display: none;">

                        </ul>
                    </label>
                    <label class="w-full mt-2 is_it_label relative" it_is="${is_it}">
                        Тип ${is_it.toLowerCase()}а:
                        <input type="text" class="input_text contract_type_select_value important_field search_select" id_="">
                        <ul class="contract_type_select search_select_datalist scrolling" style="display: none;">

                        </ul>
                    </label>
                    <label class="w-full mt-2">
                        Описание работ/продукции:
                        <input type="text" class="input_text description important_field">
                    </label>
                    <div class="hidden w-full justify-center mt-2 for_delete_button_div"><div class="bg-[#AC5B5F] button hover:bg-[#ac5b5fab]">Удалить ${is_it.toLowerCase()}</div></div>
                    
                    <label class="flex w-full mt-2 gap-2 items-center payment_month_div">Месяц платежа:
                        <input type="month" class="text-[#564D4EB2] w-[110px] input_text important_field">
                    </label>

                    <div class="flex flex-col w-full mt-2 justify-between">
                        <label class="flex items-center cursor-pointer h-[25px]">
                            <input type="checkbox" class="w-4 h-4 mr-1 monthly_checkbox1">
                            ЕЖЕМЕСЯЧНЫЙ
                        </label>

                        <div class="hidden w-full mt-2 flex-wrap" id="local_hidden1">
                            <label class="flex items-center cursor-pointer w-1/2">С <input type="month" class="ml-1 w-[80%] text-[#564D4EB2] input_text"></label>
                            <label class="flex items-center cursor-pointer w-1/2">ПО <input type="month" class="ml-1 w-[80%] text-[#564D4EB2] input_text"></label>
                        </div>
    
                        <div class="hidden w-full mt-2 flex-wrap" id="local_hidden2">
                            <label class="flex w-full items-center cursor-pointer">
                                <input type="checkbox" class="w-4 h-4 mr-1 monthly_checkbox2">
                                НЕ УЧИТЫВАТЬ ДАННЫЕ В ИНТЕРВАЛЕ
                            </label>
    
                            <div class="hidden justify-between items-center mt-2 w-full" id="local_hidden3">
                                <label class="flex items-center cursor-pointer w-1/2">С <input type="month" class="ml-1 w-[80%] text-[#564D4EB2] input_text"></label>
                                <label class="flex items-center cursor-pointer w-1/2">ПО <input type="month" class="ml-1 w-[80%] text-[#564D4EB2] input_text"></label>
                            </div>
                        </div>
                    </div>
    
                </div>
                
                <div class="flex w-[15%] h-full flex-col bg-[#D9D9D980] rounded-lg px-3 pt-2">
                    <p class="w-full h-4 text-center">ДОГОВОР</p>
                    <label class="w-full mt-2">Номер договора:
                        <input type="text" class="input_text contract">
                    </label>
                    <label class="w-full mt-2">Дата:
                        <input type="date" class="input_text contract_date">
                    </label>
                    <label class="w-full mt-2">Комментарий:
                        <textarea class="input_text comment h-[150px] resize-none py-1 scrolling" maxlength="500"></textarea>
                    </label>
                </div>

                <div class="flex w-[15%] h-full flex-col bg-[#D9D9D980] rounded-lg px-3 pt-2">
                    <p class="w-full h-4 text-center">ЗАКАЗ</p>
                    <label class="w-full mt-2">Номер заказа:
                        <input type="text" class="input_text order">
                    </label>
                    <label class="w-full mt-2">Дата заказа:
                        <input type="date" class="input_text order_date">
                    </label>
                    <label class="w-full mt-2">Общая стоимость, с НДС:
                        <input type="text" class="input_text order_price important_field only_number" oninput="digits_float(this)">
                    </label>
                    <label class="w-full mt-2">Дата окончания заказа:
                        <input type="date" class="input_text order_deadline important_field">
                    </label>
                </div>
    
                <div class="flex flex-col gap-2 w-[48%] h-full">
                    <div class="w-full max-h-[95%] overflow-y-auto scrolling" id="main_score_div">
    
                    </div>
    
                    <div class="flex w-full">
                        <label class="flex items-center h-full gap-1 cursor-pointer bill">
                            <img src="./img/plus_button.svg" class="w-[18px] h-[18px]">
                            ВЫСТАВИТЬ СЧЁТ
                        </label>
                    </div>
                </div>
            </div>
        </div>
    
    </div>
    
    <div class="flex w-full justify-between h-[12%] text-xs text-[#564D4E] px-6">
        <div class="w-[150px]"></div>
        <label class="flex items-center h-full gap-1 cursor-pointer" id="add_expense">
            <img src="./img/plus_button.svg" class="w-[24px] h-[24px]">
            ДОБАВИТЬ <span></span>
        </label>
    </div>
    
    <div class="flex w-full items-center justify-around py-4">
        <div class="button invisible" id="additional_div">Сохранить</div>
        <div class="button" id="save_change_btn">Сохранить</div>
        <div class="button invisible" id="copy_btn">Создать копию</div>
    </div>
    `
    return income_window_html
}

function invoiceDivFilling(payment_name) {
    const invoice_div_filling = `
    <div class="flex flex-col justify-between w-[64%] h-full bg-[#D9D9D980] rounded-lg py-2 px-3">
        <p class="w-full h-4 text-center">СЧЕТ ВЫСТАВЛЕН</p>
        <div class="flex w-full justify-between">
            <div class="flex w-[24%]">
                <label class="flex flex-col justify-end w-full">
                    Номер счёта:
                    <input type="text" class="input_text name">
                </label>
            </div>
            <div class="flex w-[24%]">
                <label class="flex flex-col justify-end w-full">
                    Сумма счёта:
                    <input type="text" class="input_text price important_field only_number" oninput="digits_float(this)">
                </label>
            </div>
            <div class="flex w-[24%]">
                <label class="flex flex-col justify-end w-full">
                    Дата счёта:
                    <input type="date" class="input_text date">
                </label>
            </div>
            <div class="flex w-[24%]">
                <label class="flex flex-col justify-end w-full">
                    Ожидаемая дата платежа:
                    <input type="date" class="input_text payment_expected_date important_field">
                </label>
            </div>
        </div>
    </div>

    <div class="flex flex-col justify-between w-[32%] h-full bg-[#BBC9B780] rounded-lg py-2 px-3">
        <p class="w-full h-4 text-center payment_name">${payment_name}</p>
        <div class="flex w-full justify-between">
            <div class="flex w-[48%]">
                <label class="flex flex-col justify-end w-full">
                    Сумма, с НДС:
                    <input type="text" class="input_text payment_amount only_number" oninput="digits_float(this)">
                </label>
            </div>
            <div class="flex w-[48%]">
                <label class="flex flex-col justify-end w-full">
                    Дата платежа:
                    <input type="date" class="input_text payment_date">
                </label>
            </div>
        </div>
    </div>
    <img class="w-[20px] h-[20px] cursor-pointer" src="./img/close_sad.svg">
    `
    return invoice_div_filling
}

function importantEvents() {
    fillDropDownListsContractors(main_info_div.querySelector(".contractor_select"), window.contractors_list, "id", "name", false) // заполнить списки
    fillDropDownLists(
        main_info_div.querySelector(".contract_type_select"),
        window.contract_type_list,
        "id",
        "name",
        it_is_span.textContent,
        false
    ) // заполнить списки
    eventsOnSearchSelects()
    // во внесении дохода/расхода checkboxes
    document.querySelector(".monthly_checkbox1").addEventListener("change", e => {
        if (e.currentTarget.checked) {
            document.querySelector("#local_hidden1").classList.remove("hidden")
            document.querySelector("#local_hidden1").classList.add("flex")
            document.querySelector("#local_hidden1").querySelectorAll("input")[0].classList.add("important_field")
            document.querySelector("#local_hidden1").querySelectorAll("input")[1].classList.add("important_field")

            document.querySelector("#local_hidden2").classList.remove("hidden")
            document.querySelector("#local_hidden2").classList.add("flex")

            // убрать div "месяц платежа" и убрать с него important_field
            document.querySelector(".payment_month_div").classList.remove("flex")
            document.querySelector(".payment_month_div").classList.add("hidden")
            document.querySelector(".payment_month_div").querySelector("input").value = ""
            document.querySelector(".payment_month_div").querySelector("input").classList.remove("important_field")
        } else {
            document.querySelector("#local_hidden1").classList.add("hidden")
            document.querySelector("#local_hidden1").classList.remove("flex")
            document.querySelector("#local_hidden1").querySelectorAll("input")[0].classList.remove("important_field")
            document.querySelector("#local_hidden1").querySelectorAll("input")[1].classList.remove("important_field")

            document.querySelector("#local_hidden2").classList.add("hidden")
            document.querySelector("#local_hidden2").classList.remove("flex")

            // убрать div "месяц платежа" и убрать с него important_field
            document.querySelector(".payment_month_div").classList.add("flex")
            document.querySelector(".payment_month_div").classList.remove("hidden")
            document.querySelector(".payment_month_div").querySelector("input").value = ""
            document.querySelector(".payment_month_div").querySelector("input").classList.add("important_field")

            main_info_div.querySelectorAll("input[type=month]")[1].value = ""
            main_info_div.querySelectorAll("input[type=month]")[2].value = ""

            document.querySelector(".monthly_checkbox2").checked = false
            let ev_change = new Event("change")
            document.querySelector(".monthly_checkbox2").dispatchEvent(ev_change)
        }
    })
    document.querySelector(".monthly_checkbox2").addEventListener("change", e => {
        if (e.currentTarget.checked) {
            document.querySelector("#local_hidden3").classList.remove("hidden")
            document.querySelector("#local_hidden3").classList.add("flex")
            document.querySelector("#local_hidden3").querySelectorAll("input")[0].classList.add("important_field")
            document.querySelector("#local_hidden3").querySelectorAll("input")[1].classList.add("important_field")
        } else {
            document.querySelector("#local_hidden3").classList.add("hidden")
            document.querySelector("#local_hidden3").classList.remove("flex")
            document.querySelector("#local_hidden3").querySelectorAll("input")[0].classList.remove("important_field")
            document.querySelector("#local_hidden3").querySelectorAll("input")[1].classList.remove("important_field")
            main_info_div.querySelectorAll("input[type=month]")[3].value = ""
            main_info_div.querySelectorAll("input[type=month]")[4].value = ""
        }
    })

    // во внесении дохода/расхода кнопка "выставить счёт"
    document.querySelector(".bill").addEventListener("click", () => {
        let new_div = document.createElement("div")
        new_div.className = "flex w-full items-center justify-between h-[86px] mb-2 invoice_div"
        new_div.innerHTML = invoiceDivFilling(it_is_span.textContent == "Доход" ? "ПЛАТЁЖ ПОЛУЧЕН" : "ПЛАТЁЖ ОТПРАВЛЕН")

        main_score_div.appendChild(new_div)
        new_div.querySelector("img").addEventListener("click", () => {
            new_div.remove()
        })
        // навесить event на поле платёж получен
        paymentUpdateEvents()
    })

    close_insert_it_is.addEventListener("click", () => {
        background.classList.toggle("hidden")
        background.classList.toggle("flex")
        insert_it_is.classList.toggle("hidden")
        insert_it_is.classList.toggle("flex")
    })

    // кнопка "добавить расход"
    add_expense.addEventListener("click", () => {
        let new_div = document.createElement("div")
        new_div.className = "flex flex-col w-full h-[340px] border-bottom mb-2 py-2 transition-height linked_contracts_div"
        new_div.innerHTML = `
        <div class="flex w-full h-[8%] items-center justify-between px-3 additional_bill_head">
            <label class="flex gap-2 cursor-pointer items-center" title="Скрыть">${
                it_is_span.textContent == "Доход" ? "РАСХОД" : "ДОХОД"
            }
                <img src="./img/circle_arrow.svg" class="w-[18px] h-[18px] transition-transform rotate-180">
            </label>
            <img src="./img/close_button_red.svg" class="w-[13px] h-[13px] cursor-pointer del_curr_bill" title="Удалить ${
                it_is_span.textContent == "Доход" ? "расход" : "доход"
            }">
        </div>

        <div class="flex w-full justify-between h-[92%] curr_bill">
            <div class="flex w-[20%] flex-col px-3 pt-2">
                <div class="w-full h-4"></div>
                <label class="w-full mt-2 relative">
                    Контрагент:
                    <input type="text" class="input_text contractor_select_value important_field search_select" id_="">
                    <ul class="contractor_select search_select_datalist scrolling" style="display: none;">

                    </ul>
                </label>
                <label class="w-full mt-2 is_it_label relative" it_is="${it_is_span.textContent == "Доход" ? "Расход" : "Доход"}">
                    Тип ${it_is_span.textContent == "Доход" ? "расхода" : "дохода"}:
                    <input type="text" class="input_text contract_type_select_value important_field search_select" id_="">
                    <ul class="contract_type_select search_select_datalist scrolling" style="display: none;">

                    </ul>
                </label>
                <label class="w-full mt-2">
                    Описание работ/продукции:
                    <input type="text" class="input_text description important_field">
                </label>

                <label class="flex w-full mt-2 gap-2 items-center payment_month_div">Месяц платежа:
                    <input type="month" class="text-[#564D4EB2] w-[110px] input_text important_field">
                </label>

                <div class="flex flex-col w-full mt-2 justify-between">
                    <label class="flex items-center cursor-pointer h-[25px]">
                        <input type="checkbox" class="w-4 h-4 mr-1 monthly_checkbox1">
                        ЕЖЕМЕСЯЧНЫЙ
                    </label>

                    <div class="hidden w-full mt-2 flex-wrap local_hidden1">
                        <label class="flex items-center cursor-pointer w-1/2">С <input type="month" class="ml-1 w-[80%] text-[#564D4EB2] input_text"></label>
                        <label class="flex items-center cursor-pointer w-1/2">ПО <input type="month" class="ml-1 w-[80%] text-[#564D4EB2] input_text"></label>
                    </div>

                    <div class="hidden w-full mt-2 flex-wrap local_hidden2">
                        <label class="flex w-full items-center cursor-pointer">
                            <input type="checkbox" class="w-4 h-4 mr-1 monthly_checkbox2">
                            НЕ УЧИТЫВАТЬ ДАННЫЕ В ИНТЕРВАЛЕ
                        </label>

                        <div class="hidden justify-between items-center mt-2 w-full local_hidden3">
                            <label class="flex items-center cursor-pointer w-1/2">С <input type="month" class="ml-1 w-[80%] text-[#564D4EB2] input_text"></label>
                            <label class="flex items-center cursor-pointer w-1/2">ПО <input type="month" class="ml-1 w-[80%] text-[#564D4EB2] input_text"></label>
                        </div>
                    </div>
                </div>

            </div>

            <div class="flex w-[15%] h-full flex-col bg-[#D9D9D980] rounded-lg px-3 pt-2">
                <p class="w-full h-4 text-center">ДОГОВОР</p>
                <label class="w-full mt-2">Номер договора:
                    <input type="text" class="input_text contract">
                </label>
                <label class="w-full mt-2">Дата:
                    <input type="date" class="input_text contract_date">
                </label>
                <label class="w-full mt-2">Комментарий:
                    <textarea class="input_text comment h-[144px] resize-none py-1 scrolling" maxlength="500"></textarea>
                </label>
            </div>

            <div class="flex w-[15%] h-full flex-col bg-[#D9D9D980] rounded-lg px-3 pt-2">
                <p class="w-full h-4 text-center">ЗАКАЗ</p>
                <label class="w-full mt-2">Номер заказа:
                    <input type="text" class="input_text order">
                </label>
                <label class="w-full mt-2">Дата заказа:
                    <input type="date" class="input_text order_date">
                </label>
                <label class="w-full mt-2">Общая стоимость, с НДС:
                    <input type="text" class="input_text order_price important_field only_number" oninput="digits_float(this)">
                </label>
                <label class="w-full mt-2">Дата окончания заказа:
                    <input type="date" class="input_text order_deadline important_field">
                </label>
            </div>

            <div class="flex flex-col gap-2 w-[48%] h-full">
                <div class="w-full max-h-[94%] overflow-y-auto scrolling main_score_div">

                </div>

                <div class="flex w-full">
                    <label class="flex items-center h-full gap-1 cursor-pointer bill">
                        <img src="./img/plus_button.svg" class="w-[18px] h-[18px]">
                        ВЫСТАВИТЬ СЧЁТ
                    </label>
                </div>
            </div>
        </div>
        `
        main_info_div.appendChild(new_div)
        // управление шапкой расхода
        // свернуть/развернуть
        let head_label = new_div.querySelector(".additional_bill_head").querySelector("label")
        head_label.addEventListener("click", () => {
            head_label.querySelector("img").classList.toggle("rotate-180")

            if (new_div.querySelector(".curr_bill").classList.contains("hidden")) {
                setTimeout(() => {
                    new_div.querySelector(".curr_bill").classList.toggle("hidden")
                }, 250)
                new_div.removeAttribute("style")
            } else {
                new_div.querySelector(".curr_bill").classList.toggle("hidden")

                new_div.style.height = "35px"
            }

            // new_div.querySelector(".curr_bill").classList.toggle("hidden") ? new_div.style.height = "35px" : new_div.removeAttribute("style")
        })
        // удалить расход
        new_div.querySelector(".del_curr_bill").addEventListener("click", () => {
            new_div.remove()
        })

        fillDropDownListsContractors(new_div.querySelector(".contractor_select"), window.contractors_list, "id", "name", false) // заполнить списки
        fillDropDownLists(
            new_div.querySelector(".contract_type_select"),
            window.contract_type_list,
            "id",
            "name",
            it_is_span.textContent == "Доход" ? "РАСХОД" : "ДОХОД",
            false
        ) // заполнить списки
        eventsOnSearchSelects()
        // во внесении дохода/расхода checkboxes
        new_div.querySelector(".monthly_checkbox1").addEventListener("change", e => {
            if (e.currentTarget.checked) {
                new_div.querySelector(".local_hidden1").classList.remove("hidden")
                new_div.querySelector(".local_hidden1").classList.add("flex")

                new_div.querySelector(".local_hidden2").classList.remove("hidden")
                new_div.querySelector(".local_hidden2").classList.add("flex")

                // убрать div "месяц платежа" и убрать с него important_field
                new_div.querySelector(".payment_month_div").classList.remove("flex")
                new_div.querySelector(".payment_month_div").classList.add("hidden")
                new_div.querySelector(".payment_month_div").querySelector("input").value = ""
                new_div.querySelector(".payment_month_div").querySelector("input").classList.remove("important_field")
            } else {
                new_div.querySelector(".local_hidden1").classList.add("hidden")
                new_div.querySelector(".local_hidden1").classList.remove("flex")

                new_div.querySelector(".local_hidden2").classList.add("hidden")
                new_div.querySelector(".local_hidden2").classList.remove("flex")

                // убрать div "месяц платежа" и убрать с него important_field
                new_div.querySelector(".payment_month_div").classList.add("flex")
                new_div.querySelector(".payment_month_div").classList.remove("hidden")
                new_div.querySelector(".payment_month_div").querySelector("input").value = ""
                new_div.querySelector(".payment_month_div").querySelector("input").classList.add("important_field")

                new_div.querySelectorAll("input[type=month]")[1].value = ""
                new_div.querySelectorAll("input[type=month]")[2].value = ""

                new_div.querySelector(".monthly_checkbox2").checked = false
                let ev_change = new Event("change")
                new_div.querySelector(".monthly_checkbox2").dispatchEvent(ev_change)
            }
        })
        new_div.querySelector(".monthly_checkbox2").addEventListener("change", e => {
            if (e.currentTarget.checked) {
                new_div.querySelector(".local_hidden3").classList.remove("hidden")
                new_div.querySelector(".local_hidden3").classList.add("flex")
            } else {
                new_div.querySelector(".local_hidden3").classList.add("hidden")
                new_div.querySelector(".local_hidden3").classList.remove("flex")

                new_div.querySelectorAll("input[type=month]")[3].value = ""
                new_div.querySelectorAll("input[type=month]")[4].value = ""
            }
        })

        // во внесении дохода/расхода кнопка "выставить счёт"
        new_div.querySelector(".bill").addEventListener("click", () => {
            let new_div1 = document.createElement("div")
            new_div1.className = "flex w-full items-center justify-between h-[86px] mb-2 invoice_div"
            new_div1.innerHTML = invoiceDivFilling(it_is_span.textContent == "Доход" ? "ПЛАТЁЖ ОТПРАВЛЕН" : "ПЛАТЁЖ ПОЛУЧЕН")

            new_div.querySelector(".main_score_div").appendChild(new_div1)
            new_div1.querySelector("img").addEventListener("click", () => {
                new_div1.remove()
            })
            // навесить event на поле платёж получен
            paymentUpdateEvents()
        })
    })

    // сбор информации из одного блока
    function collectValues(collect_element) {
        let collectInvoice = () => {
            let result_invoice_list = []
            Array.from(collect_element.querySelectorAll(".invoice_div")).forEach(invoice => {
                result_invoice_list.push({
                    name: invoice.querySelector(".name").value || null,
                    price: toNumber(invoice.querySelector(".price").value) || null,
                    date: invoice.querySelector(".date").value || null,
                    payment_expected_date: invoice.querySelector(".payment_expected_date").value || null,
                    payment_amount: toNumber(invoice.querySelector(".payment_amount").value) || null,
                    payment_date: invoice.querySelector(".payment_date").value || null,
                    id: Number(invoice.getAttribute("invoice_id")) || null,
                })
            })
            return result_invoice_list
        }
        let values = {
            contractor_id: Number(collect_element.querySelector(".contractor_select_value ").getAttribute("id_")),
            type_id: Number(collect_element.querySelector(".contract_type_select_value").getAttribute("id_")),
            description: collect_element.querySelector(".description").value,
            contract: collect_element.querySelector(".contract").value || null,
            comment: collect_element.querySelector(".comment").value || null,
            contract_date: collect_element.querySelector(".contract_date").value || null,
            order: collect_element.querySelector(".order").value || null,
            order_date: collect_element.querySelector(".order_date").value || null,
            order_price: toNumber(collect_element.querySelector(".order_price").value),
            order_deadline: collect_element.querySelector(".order_deadline").value,
            it_is: collect_element.querySelector(".is_it_label").getAttribute("it_is"),
            invoice: collectInvoice(),
            repeating_contract: collect_element.querySelector(".monthly_checkbox1").checked
                ? {
                      start_date: collect_element.querySelectorAll("input[type=month]")[1].value || null,
                      end_date: collect_element.querySelectorAll("input[type=month]")[2].value || null,
                      start_pause_date: collect_element.querySelectorAll("input[type=month]")[3].value || null,
                      end_pause_date: collect_element.querySelectorAll("input[type=month]")[4].value || null,
                  }
                : { start_date: collect_element.querySelectorAll("input[type=month]")[0].value }, // сюда
        }
        // !collect_element.querySelector(".monthly_checkbox1").checked ? alert(`заглушка: месяц платежа ${collect_element.querySelectorAll("input[type=month]")[0].value}`) : "" // go to "сюда"
        return values
    }
    // кнопка сохранить
    save_change_btn.addEventListener("click", e => {
        if (checkImportantFields(main_info_div)) {
            // если всё заполнено
            // проверка на правильность ввода сумм (чисел)
            let only_number = Array.from(main_info_div.querySelectorAll(".only_number"))
            if (
                only_number.some(field => {
                    return (
                        (field.classList.contains("important_field") && !toNumber(field.value)) ||
                        (field.value && !field.classList.contains("important_field") && !toNumber(field.value))
                    )
                })
            ) {
                // не все поля верные
                only_number.forEach(field => {
                    if (
                        (field.classList.contains("important_field") && !toNumber(field.value)) ||
                        (field.value && !field.classList.contains("important_field") && !toNumber(field.value))
                    ) {
                        field.style.background = "#ac5b5f7d"
                        setTimeout(() => {
                            field.removeAttribute("style")
                        }, 500)
                    }
                })
            } else {
                // если все числа можно перевести в числа (всё хорошо)
                let body = collectValues(insert_it_is.querySelector(".main_contracts_div"))
                let linked_contracts_list = []
                if (span_for_delete.textContent) {
                    Array.from(insert_it_is.querySelectorAll(".linked_contracts_div")).forEach(linked_contract_div => {
                        linked_contracts_list.push(collectValues(linked_contract_div))
                    })
                    body["linked_contracts"] = linked_contracts_list
                    console.log(body)
                    console.log(JSON.stringify(body))
                    queryAPI_POST(body, `contracts`).then(res => {
                        if (res.ok) {
                            close_insert_it_is.click()
                            showAllRows()
                            successfullyWin()
                        } else {
                            // Сообщение об ошибке
                            console.log(res.status)
                            res.json().then(json => {
                                errorWin(json["message"])
                            })
                        }
                    })
                } else {
                    Array.from(insert_it_is.querySelectorAll(".linked_contracts_div")).forEach(linked_contract_div => {
                        linked_contracts_list.push(collectValues(linked_contract_div))
                        linked_contracts_list[linked_contracts_list.length - 1]["id"] =
                            Number(linked_contract_div.getAttribute("id_row")) || null
                    })
                    body["linked_contracts"] = linked_contracts_list
                    body["id"] = Number(e.currentTarget.getAttribute("id_row"))
                    body["invoice"].forEach(invoice => {
                        invoice["contract_id"] = body["id"]
                    })
                    body["repeating_contract"]["id"] = body["id"]

                    console.log(body)
                    console.log(JSON.stringify(body))

                    let drawAccept = () => {
                        // рисуем кнопки подтверждения/отмены
                        let new_button_no = document.createElement("div")
                        new_button_no.classList.add("button")
                        new_button_no.innerHTML = "Отмена"
                        new_button_no.style.marginLeft = "15px"

                        let new_button_yes = document.createElement("div")
                        new_button_yes.id = "new_button_yes"
                        new_button_yes.classList.add("button")
                        new_button_yes.innerHTML = "Сохранить"

                        save_change_btn.parentElement.appendChild(new_button_yes)
                        save_change_btn.parentElement.appendChild(new_button_no)

                        save_change_btn.classList.add("hidden")
                        // скрываем кнопку создать копию
                        copy_btn.classList.add("hidden")
                        additional_div.classList.add("hidden")
                        // пишем текст уведомляющий о действиях
                        let new_p = document.createElement("p")
                        new_p.style =
                            "display: flex; font-size: 16px; text-align: center; width: 60%; align-items: flex-start; color: #D42C35;"
                        new_p.innerHTML = `<img src="./img/warning.svg">Данные изменения удалят все созданные (не прошедшие) ежемесячные заказы из заданного ранее интервала! Внести изменения и удалить заказы?`
                        add_expense.parentElement.insertBefore(new_p, add_expense)

                        new_button_no.addEventListener("click", () => {
                            new_button_yes.remove()
                            new_button_no.remove()
                            new_p.remove()
                            save_change_btn.classList.remove("hidden")
                            copy_btn.classList.remove("hidden")
                            additional_div.classList.remove("hidden")
                            close_insert_it_is.click()
                        })
                    }

                    function repeatingPUT(my_body) {
                        let repeating_contract_save = my_body["repeating_contract"]
                        my_body["repeating_contract"] = null
                        queryAPI_PUT(my_body, `contracts`).then(res => {
                            if (res.ok) {
                                my_body["repeating_contract"] = repeating_contract_save
                                queryAPI_PUT(my_body, `contracts`).then(res => {
                                    if (res.ok) {
                                        close_insert_it_is.click()
                                        showAllRows(
                                            window.filter,
                                            Number(
                                                document
                                                    .querySelector("#main_pagination_div")
                                                    .querySelector(".pagination-divs-selected").textContent
                                            ),
                                            null
                                        )
                                        successfullyWin()
                                    } else {
                                        // Сообщение об ошибке
                                        console.log(res.status)
                                        res.json().then(json => {
                                            errorWin(json["message"])
                                        })
                                    }
                                })
                            } else {
                                // Сообщение об ошибке
                                console.log(res.status)
                                res.json().then(json => {
                                    errorWin(json["message"])
                                })
                            }
                        })
                    }

                    // если редактировались поля ежемесячно
                    // if (body["repeating_contract"] && !window.curr_is_repeated_check) {
                    // если нет галочки ежемесячный, то просто обновляй
                    if (!body["repeating_contract"]["end_date"] && window.curr_is_repeated_check) {
                        // если нужно будет подтверждение то сюда вставить
                        // drawAccept()
                        // new_button_yes.addEventListener("click", () => {repeatingPUT(body)})
                        repeatingPUT(body)
                    } else if (body["repeating_contract"]["end_date"] && !window.curr_is_repeated_check) {
                        queryAPI_PUT(body, `contracts`).then(res => {
                            if (res.ok) {
                                close_insert_it_is.click()
                                showAllRows(
                                    window.filter,
                                    Number(
                                        document.querySelector("#main_pagination_div").querySelector(".pagination-divs-selected")
                                            .textContent
                                    ),
                                    null
                                )
                                successfullyWin()
                            } else {
                                // Сообщение об ошибке
                                console.log(res.status)
                                res.json().then(json => {
                                    errorWin(json["message"])
                                })
                            }
                        })
                    } else if (
                        body["repeating_contract"]["end_date"] &&
                        (body["repeating_contract"]["start_date"] != window.curr_month1 ||
                            body["repeating_contract"]["end_date"] != window.curr_month2 ||
                            body["repeating_contract"]["start_pause_date"] != window.curr_month3 ||
                            body["repeating_contract"]["end_pause_date"] != window.curr_month4)
                    ) {
                        drawAccept()

                        new_button_yes.addEventListener("click", () => {
                            let now_month = new Date().getMonth() + 1
                            let now_year = new Date().getFullYear()

                            let start_date = body["repeating_contract"]["start_date"]
                            let end_date = body["repeating_contract"]["end_date"]
                            let start_pause_date = body["repeating_contract"]["start_pause_date"]
                            let end_pause_date = body["repeating_contract"]["end_pause_date"]
                            /*if (Number(start_date.split("-")[0]) < now_year || (Number(start_date.split("-")[0]) == now_year && Number(start_date.split("-")[1]) < now_month)) {
                                errorWin("Дата начала повторения должна быть больше или равна текущему месяцу")
                            } else */ if (
                                Number(end_date.split("-")[0]) < Number(start_date.split("-")[0]) ||
                                (Number(end_date.split("-")[0]) == Number(start_date.split("-")[0]) &&
                                    Number(end_date.split("-")[1]) <= Number(start_date.split("-")[1]))
                            ) {
                                errorWin("Ошибка в датах. Дата начала должна быть меньше даты конца")
                            } else if (
                                start_pause_date &&
                                (Number(start_pause_date.split("-")[0]) < Number(start_date.split("-")[0]) ||
                                    (Number(start_pause_date.split("-")[0]) == Number(start_date.split("-")[0]) &&
                                        Number(start_pause_date.split("-")[1]) <= Number(start_date.split("-")[1])))
                            ) {
                                errorWin("Ошибка в датах. Дата начала исключения меньше или равна дате начала повторения")
                            } else if (
                                start_pause_date &&
                                (Number(start_pause_date.split("-")[0]) > Number(end_date.split("-")[0]) ||
                                    (Number(start_pause_date.split("-")[0]) == Number(end_date.split("-")[0]) &&
                                        Number(start_pause_date.split("-")[1]) >= Number(end_date.split("-")[1])))
                            ) {
                                errorWin("Ошибка в датах. Дата начала исключения больше или равна дате конца повторения")
                            } else if (
                                end_pause_date &&
                                start_pause_date &&
                                (Number(end_pause_date.split("-")[0]) < Number(start_pause_date.split("-")[0]) ||
                                    (Number(end_pause_date.split("-")[0]) == Number(start_pause_date.split("-")[0]) &&
                                        Number(end_pause_date.split("-")[1]) <= Number(start_pause_date.split("-")[1])))
                            ) {
                                errorWin("Ошибка в датах. Дата конца исключения меньше или равна дате начала исключения")
                            } else if (
                                end_pause_date &&
                                (Number(end_pause_date.split("-")[0]) > Number(end_date.split("-")[0]) ||
                                    (Number(end_pause_date.split("-")[0]) == Number(end_date.split("-")[0]) &&
                                        Number(end_pause_date.split("-")[1]) >= Number(end_date.split("-")[1])))
                            ) {
                                errorWin("Ошибка в датах. Дата конца исключения больше или равна дате конца повторения")
                            } else {
                                repeatingPUT(body)
                            }
                        })
                    } else {
                        // простое обновление
                        queryAPI_PUT(body, `contracts`).then(res => {
                            if (res.ok) {
                                close_insert_it_is.click()
                                showAllRows(
                                    window.filter,
                                    Number(
                                        document.querySelector("#main_pagination_div").querySelector(".pagination-divs-selected")
                                            .textContent
                                    ),
                                    null
                                )
                                successfullyWin()
                            } else {
                                // Сообщение об ошибке
                                console.log(res.status)
                                res.json().then(json => {
                                    errorWin(json["message"])
                                })
                            }
                        })
                    }
                }
            }
        }
    })
}

function detailInfo(info, main_element) {
    // заполнение основной записи
    // заполнить статичные input
    main_element.querySelector(".contractor_select_value").value = info["contractor"]
    main_element.querySelector(".contractor_select_value").setAttribute("id_", info["contractor_id"])
    main_element.querySelector(".contract_type_select_value").value = info["type"]
    main_element.querySelector(".contract_type_select_value").setAttribute("id_", info["type_id"])
    main_element.querySelector(".description").value = info["description"]
    main_element.querySelector(".contract").value = info["contract"]
    main_element.querySelector(".contract_date").value = info["contract_date"]
    main_element.querySelector(".comment").value = info["comment"]
    main_element.querySelector(".order").value = info["order"]
    main_element.querySelector(".order_date").value = info["order_date"]
    main_element.querySelector(".order_price").value = info["order_price"]
    main_element.querySelector(".order_deadline").value = info["order_deadline"]
    // заполнение ежемесячной штуки
    let months_inputs = main_element.querySelectorAll("input[type=month]")
    timeChange = str_time => {
        let format = str_time.split("-")
        format.pop()
        return format.join("-")
    }
    if (info["is_repeated"]) {
        main_element.querySelector(".monthly_checkbox1").click()
        months_inputs[1].value = timeChange(info["repeating_contract"]["start_date"])
        months_inputs[2].value = timeChange(info["repeating_contract"]["end_date"])
        if (info["repeating_contract"]["start_pause_date"] && info["repeating_contract"]["end_pause_date"]) {
            main_element.querySelector(".monthly_checkbox2").click()
            months_inputs[3].value = timeChange(info["repeating_contract"]["start_pause_date"])
            months_inputs[4].value = timeChange(info["repeating_contract"]["end_pause_date"])
        }
        // months_inputs.forEach(elem => {
        //     main_element.querySelector(".monthly_checkbox2").disabled = true
        //     elem.disabled =  true
        // })
        // main_element.querySelector(".monthly_checkbox1").addEventListener("change", e => {
        //     e.currentTarget.disabled = true
        // })
    } else {
        months_inputs[0].value = info["repeating_contract"]["start_date"]
            ? timeChange(info["repeating_contract"]["start_date"])
            : ""
    }

    // invoice[price date payment_expected_date payment_amount payment_date]
    // заполнение счетов
    info["invoice"].forEach(single_invoice => {
        main_element.querySelector(".bill").click()
        let last_div = main_element.querySelectorAll(".invoice_div")[main_element.querySelectorAll(".invoice_div").length - 1]
        last_div.setAttribute("invoice_id", single_invoice["id"])

        last_div.querySelector(".name").value = single_invoice["name"]
        last_div.querySelector(".price").value = single_invoice["price"]
        last_div.querySelector(".date").value = single_invoice["date"]
        last_div.querySelector(".payment_expected_date").value = single_invoice["payment_expected_date"]
        last_div.querySelector(".payment_amount").value = single_invoice["payment_amount"]
        last_div.querySelector(".payment_date").value = single_invoice["payment_date"]
    })
}

// single open row
function fillDetailInfo(all_info) {
    span_for_delete.innerHTML = "" // убрать слово "Внести" в заголовке

    // Добавить месяц-год для ежемесячных
    if (all_info["repeating_month"]) {
        description_head_span.innerHTML = ` (${repeating_month(all_info["repeating_month"])})`
    }

    let contracts_div = document.querySelector(".main_contracts_div")
    detailInfo(all_info, contracts_div)
    window.curr_month1 = contracts_div.querySelectorAll("input[type=month]")[1].value || null
    window.curr_month2 = contracts_div.querySelectorAll("input[type=month]")[2].value || null
    window.curr_month3 = contracts_div.querySelectorAll("input[type=month]")[3].value || null
    window.curr_month4 = contracts_div.querySelectorAll("input[type=month]")[4].value || null

    window.curr_is_repeated_check = all_info["is_repeated"]
    save_change_btn.setAttribute("id_row", all_info["id"])

    // Показать кнопку копирования
    copy_btn.classList.remove("invisible")
    // event на кнопку копирования
    copy_btn.addEventListener("click", () => {
        copy_btn.classList.add("invisible")
        save_change_btn.removeAttribute("id_row")
        document.querySelectorAll(".linked_contracts_div").forEach(item => {
            item.remove()
        })
        span_for_delete.textContent = "Внести"
        description_head_span.innerHTML = " (Создать копию)"
        // убрать кнопку удаления
        contracts_div.querySelector(".for_delete_button_div").classList.toggle("hidden")
        contracts_div.querySelector(".for_delete_button_div").classList.toggle("flex")
    })

    // показать кнопку удаления
    contracts_div.querySelector(".for_delete_button_div").classList.toggle("hidden")
    contracts_div.querySelector(".for_delete_button_div").classList.toggle("flex")

    // event на удаление записи
    contracts_div
        .querySelector(".for_delete_button_div")
        .querySelector(".button")
        .addEventListener("click", () => {
            queryAPI_DELETE({}, `contract/${all_info["id"]}`).then(res => {
                if (res.ok) {
                    successfullyWin("Запись удалена")
                    close_insert_it_is.click()
                    showAllRows(
                        window.filter,
                        Number(
                            document.querySelector("#main_pagination_div").querySelector(".pagination-divs-selected").textContent
                        ),
                        null
                    )
                } else {
                    // Сообщение об ошибке
                    console.log(res.status)
                    res.json().then(json => {
                        errorWin(json["message"])
                    })
                }
            })
        })

    // заполнить привязанные контракты
    all_info["linked_contracts"].forEach(linked_contract => {
        add_expense.click()
        document
            .querySelectorAll(".linked_contracts_div")
            [document.querySelectorAll(".linked_contracts_div").length - 1].querySelector(".del_curr_bill").style.display = "none"
        document
            .querySelectorAll(".linked_contracts_div")
            [document.querySelectorAll(".linked_contracts_div").length - 1].setAttribute("id_row", linked_contract["id"])
        detailInfo(
            linked_contract,
            document.querySelectorAll(".linked_contracts_div")[document.querySelectorAll(".linked_contracts_div").length - 1]
        )
    })

    // сделать event "input" для пользовательского отображения сумм
    let input_event = new Event("input")
    document.querySelectorAll(".only_number").forEach(num_input => {
        num_input.dispatchEvent(input_event)
    })

    // навесить event на поле платёж получен
    paymentUpdateEvents()
}

// платёж получен, делает important_field если сумма или дата не пустая
function paymentUpdateEvents() {
    let func = (main_elem, dependent_elem) => {
        let change_event = new Event("change")
        main_info_div.querySelectorAll(`.${main_elem}`).forEach(item => {
            item.addEventListener("change", () => {
                let parent_elem = item.parentElement.parentElement.parentElement.querySelector(`.${dependent_elem}`)
                if (item.value) {
                    parent_elem.classList.contains("important_field") ? "" : parent_elem.classList.add("important_field")
                } else {
                    parent_elem.classList.remove("important_field")
                }
            })
            item.dispatchEvent(change_event)
        })
    }
    func("payment_amount", "payment_date")
    func("payment_date", "payment_amount")
}
