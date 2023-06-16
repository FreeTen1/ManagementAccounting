// функция для заполнение выпадающим списком
function fillDropDownLists(sel_elem, values, value_key, inner_text_key, type, all=true) {
    // elem - DOM element
    // values - список словарей 
    values.forEach(item => {
        if (all) {
            if (item["it_is"].toUpperCase() == type.toUpperCase()) {
                let new_option = document.createElement("li")
                new_option.value = item[value_key]
                new_option.innerHTML = item[inner_text_key]
                sel_elem.appendChild(new_option)
            }
        } else {
            if (item["it_is"].toUpperCase() == type.toUpperCase() && item["is_active"]) {
                let new_option = document.createElement("li")
                new_option.value = item[value_key]
                new_option.innerHTML = item[inner_text_key]
                sel_elem.appendChild(new_option)
            }
        }
    })
}

// функция для заполнение выпадающим списком
function fillDropDownListsContractors(sel_elem, values, value_key, inner_text_key, all=true) {
    // elem - DOM element
    // values - список словарей 
    if (all) {
        values.forEach(item => {
            let new_option = document.createElement("li")
            new_option.value = item[value_key]
            new_option.innerHTML = item[inner_text_key]
            sel_elem.appendChild(new_option)
        })
    } else {
        values.forEach(item => {
            if (item["is_active"]) {
                let new_option = document.createElement("li")
                new_option.value = item[value_key]
                new_option.innerHTML = item[inner_text_key]
                sel_elem.appendChild(new_option)
            }
        })
    }
}

// заполнение выпадающим списком всех selects "Контрагент"
queryAPI_GET('lists').then(res => {
    if (res.ok) {
        res.json().then(json => {
            window.contractors_list = json["contractors"]
            window.contract_type_list = json["contract_type"]

            fillDropDownListsContractors(mini_search.querySelector(".contractor_select"), 
                                         window.contractors_list,
                                         "id",
                                         "name") // заполнить списки Контрагентов в мини поиске
            
            fillDropDownListsContractors(full_search.querySelector(".contractor_select"), 
                                         window.contractors_list,
                                         "id",
                                         "name") // заполнить списки Контрагентов в фул поиске
            
            fillDropDownListsContractors(mini_search.querySelector(".contract_type_select"), 
                                         window.contract_type_list,
                                         "id",
                                         "name") // заполнить списки типов

            changeDropDownListInFullSearch()
        })
    } else {
        // Сообщение об ошибке
        console.log(res.status);
        res.json().then(json => {
            errorWin(json["message"]);
        })
    }
})

// изменение выпадающего списка в мини поиске
// mini_search.querySelector(".it_is_mini_search").addEventListener("blur", () => {
//     mini_search.querySelector(".contract_type_select").innerHTML = ''
//     mini_search.querySelector(".type_id_mini_search").value = ''

//     let ev = new Event("blur")
//     mini_search.querySelector(".type_id_mini_search").dispatchEvent(ev)

//     fillDropDownLists(mini_search.querySelector(".contract_type_select"), 
//                       window.contract_type_list,
//                       "id",
//                       "name",
//                       mini_search.querySelector(".it_is_mini_search").value) // заполнить списки типов
// })

// отрисовка строк
showAllRows()

// Сортировка
document.querySelectorAll("th[sort_key]").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelector("#sort_img_div") ? document.querySelector("#sort_img_div").remove() : ''
        let img_div = document.createElement("div")
        img_div.id = 'sort_img_div'
        img_div.className = "absolute flex gap-1 right-0 top-0"

        let curr_val_sort_asc = item.getAttribute("sort_order")
        document.querySelectorAll("div[sort_key]").forEach(other_item => {other_item.setAttribute("sort_order", 'null')})
        item.setAttribute("sort_order", curr_val_sort_asc)
        switch (curr_val_sort_asc){
            case 'null':
                item.setAttribute("sort_order", "ASC")
                img_div.innerHTML = '<img src="./img/sort.svg">↓'
                item.appendChild(img_div)
                showAllRows(`sort_key=${item.getAttribute("sort_key")}&sort_order=${item.getAttribute("sort_order")}`, 1, window.query_token || null)
                break
            case 'ASC':
                item.setAttribute("sort_order", "DESC")
                img_div.innerHTML = '<img src="./img/sort.svg">↑'
                item.appendChild(img_div)
                showAllRows(`sort_key=${item.getAttribute("sort_key")}&sort_order=${item.getAttribute("sort_order")}`, 1, window.query_token || null)
                break
            case 'DESC':
                item.setAttribute("sort_order", "null")
                showAllRows(`sort_key=&sort_order=`, 1, window.query_token || null)
                break
        }
    })
})


// сбор запроса для поиска
function makeQueryForSearch(where) {
    // where - (mini, full) какой поиск мини или расширенный
    let query_dict ={}
    if (where == 'mini') {
        query_dict = {
            "contract_id": mini_search.querySelector(".contract_id_mini_search").value, // id коакта
            "it_is": mini_search.querySelector(".it_is_mini_search").value, // "Доход или Расход",
            "contractor_id": mini_search.querySelector(".contractor_mini_search").getAttribute("id_"), // "ID контрагента", // можно в int или str
            "description": mini_search.querySelector(".description_mini_search").value, // "Описание работ/продукции", // ищет по паттерну like '%value%'
            "type_id": mini_search.querySelector(".type_id_mini_search").getAttribute("id_"), // "ID Тип дохода/расхода", // можно в int или str
            "start_contract_date": mini_search.querySelector(".contract_date_mini_search").value, // "Дата договора", // YYYY-MM-DD
            "end_contract_date": mini_search.querySelector(".contract_date_mini_search").value, // "Дата договора", // YYYY-MM-DD
            "contract": mini_search.querySelector(".contract_mini_search").value, // "Номер договора", // ищет по паттерну like '%value%'
            "order": mini_search.querySelector(".order_mini_search").value, // "Номер заказа", // ищет по паттерну like '%value%'
            "order_price": toNumber(mini_search.querySelector(".order_price_mini_search").value), // "Общая стоимость заказа, с НДС", // можно в float или str // НОВОЕ
            "start_order_deadline": mini_search.querySelector(".order_deadline_mini_search").value, // "Дата окончания заказа" // YYYY-MM-DD
            "end_order_deadline": mini_search.querySelector(".order_deadline_mini_search").value, // "Дата окончания заказа" // YYYY-MM-DD
            "start_order_date": mini_search.querySelector(".order_date_mini_search").value, // "Вывод данных по дате заказа: с ...", // YYYY-MM-DD
            "end_order_date": mini_search.querySelector(".order_date_mini_search").value,// "Вывод данных по дате заказа: по ...", // YYYY-MM-DD
            "invoice_name": mini_search.querySelector(".invoice_name_mini_search").value, // "Счет выставлен: Номер", // ищет по паттерну like '%value%' // NEW наименование счёта
            "start_invoice_date": mini_search.querySelector(".invoice_date_mini_search").value, // "Счет выставлен: Дата", // YYYY-MM-DD
            "end_invoice_date": mini_search.querySelector(".invoice_date_mini_search").value, // "Счет выставлен: Дата", // YYYY-MM-DD
            "invoice_price": toNumber(mini_search.querySelector(".invoice_price_mini_search").value), // "Счет выставлен: Сумма", // ищет по паттерну like '%value%' // НОВОЕ
            "payment_amount": toNumber(mini_search.querySelector(".payment_amount_mini_search").value), // "Платеж получен/отправлен: Сумма, с НДС", // можно в float или str
            "start_payment_date": mini_search.querySelector(".payment_date_mini_search").value, // "Платеж получен/отправлен: Дата", // YYYY-MM-DD
            "end_payment_date": mini_search.querySelector(".payment_date_mini_search").value, // "Платеж получен/отправлен: Дата", // YYYY-MM-DD
            "start_payment_expected_date": mini_search.querySelector(".payment_expected_date_mini_search").value, // "Ожидаемая дата платежа" // YYYY-MM-DD
            "end_payment_expected_date": mini_search.querySelector(".payment_expected_date_mini_search").value, // "Ожидаемая дата платежа" // YYYY-MM-DD
            // "start_repeating_contract": mini_search.querySelector(".start_repeating_contract_mini_search").value, // "месяц платежа"
            // "end_repeating_contract": mini_search.querySelector(".end_repeating_contract_mini_search").value, // "месяц платежа"
            // "start_report_date": mini_search.querySelector(".start_report_date_mini_search").value, // "Дата заказа", // YYYY-MM-DD
            // "end_report_date": mini_search.querySelector(".end_report_date_mini_search").value, // "Дата заказа", // YYYY-MM-DD
        }
    } else if (where == 'full') {
        query_dict = {
            "contract_id": full_search.querySelector(".contract_id_full_search").value, // id контракта
            "it_is": full_search.querySelector("input[type=checkbox]:checked") ? full_search.querySelector("input[type=checkbox]:checked").value : '', // "Доход или Расход",
            "contractor_id": full_search.querySelector(".contractor_full_search").getAttribute("id_"), // "ID контрагента", // можно в int или str
            "description": full_search.querySelector(".description_full_search").value, // "Описание работ/продукции", // ищет по паттерну like '%value%'
            "type_id": full_search.querySelector(".type_id_full_search").getAttribute("id_"), // "ID Тип дохода/расхода", // можно в int или str
            "start_contract_date": full_search.querySelector(".start_contract_date_full_search").value, // "Дата договора", // YYYY-MM-DD
            "end_contract_date": full_search.querySelector(".end_contract_date_full_search").value, // "Дата договора", // YYYY-MM-DD
            "contract": full_search.querySelector(".contract_full_search").value, // "Номер договора", // ищет по паттерну like '%value%'
            "order": full_search.querySelector(".order_full_search").value, // "Номер заказа", // ищет по паттерну like '%value%'
            "order_price": toNumber(full_search.querySelector(".order_price_full_search").value), // "Общая стоимость заказа, с НДС", // можно в float или str // НОВОЕ
            "start_order_deadline": full_search.querySelector(".start_order_deadline_full_search").value, // "Дата окончания заказа" // YYYY-MM-DD
            "end_order_deadline": full_search.querySelector(".end_order_deadline_full_search").value, // "Дата окончания заказа" // YYYY-MM-DD
            "start_order_date": full_search.querySelector(".start_order_date_full_search").value, // "Вывод данных по дате заказа: с ...", // YYYY-MM-DD
            "end_order_date": full_search.querySelector(".end_order_date_full_search").value,// "Вывод данных по дате заказа: по ...", // YYYY-MM-DD
            "invoice_name": full_search.querySelector(".invoice_name_full_search").value, // "Счет выставлен: Номер", // ищет по паттерну like '%value%' // NEW наименование счёта
            "start_invoice_date": full_search.querySelector(".start_invoice_date_full_search").value, // "Счет выставлен: Дата", // YYYY-MM-DD
            "end_invoice_date": full_search.querySelector(".end_invoice_date_full_search").value, // "Счет выставлен: Дата", // YYYY-MM-DD
            "invoice_price": toNumber(full_search.querySelector(".invoice_price_full_search").value), // "Счет выставлен: Сумма", // ищет по паттерну like '%value%' // НОВОЕ
            "payment_amount": toNumber(full_search.querySelector(".payment_amount_full_search").value), // "Платеж получен/отправлен: Сумма, с НДС", // можно в float или str
            "start_payment_date": full_search.querySelector(".start_payment_date_full_search").value, // "Платеж получен/отправлен: Дата", // YYYY-MM-DD
            "end_payment_date": full_search.querySelector(".end_payment_date_full_search").value, // "Платеж получен/отправлен: Дата", // YYYY-MM-DD
            "start_payment_expected_date": full_search.querySelector(".start_payment_expected_date_full_search").value, // "Ожидаемая дата платежа" // YYYY-MM-DD
            "end_payment_expected_date": full_search.querySelector(".end_payment_expected_date_full_search").value, // "Ожидаемая дата платежа" // YYYY-MM-DD
            "start_repeating_contract": full_search.querySelector(".start_repeating_contract_full_search").value, // "месяц платежа"
            "end_repeating_contract": full_search.querySelector(".end_repeating_contract_full_search").value, // "месяц платежа"
            "start_report_date": full_search.querySelector(".start_report_date_full_search").value, // "Дата заказа", // YYYY-MM-DD
            "end_report_date": full_search.querySelector(".end_report_date_full_search").value, // "Дата заказа", // YYYY-MM-DD
        }
    }

    let query_list = []
    Object.keys(query_dict).forEach(key => {
        if (query_dict[key]) {
            query_list.push(`${key}=${query_dict[key]}`)
        }
    })
    return query_list.join("&")
}

// открытие меню мини поиска
active_mini_search.addEventListener("click", () => {
    active_full_search.querySelector("img").classList.contains("rotate-180") ? active_full_search.click() : ''
    active_toggle_hide_columns.querySelector("img").classList.contains("rotate-180") ? active_toggle_hide_columns.click() : ''

    mini_search.classList.toggle("hidden")
})
// сброс данных в мини поиске
reset_mini_search.addEventListener("click", () => {
    Array.from(mini_search.querySelectorAll(".input_text")).forEach(item => {
        item.value = ''
        item.setAttribute('id_', '')
    })
    filter_text_apply.classList.add("hidden")
    showAllRows()
})
// мини поиск
find_mini_search.addEventListener("click", () => {
    filter_text_apply.classList.remove("hidden")
    showAllRows(makeQueryForSearch("mini"))
})

// открытие расширенного поиска
active_full_search.addEventListener("click", () => {
    mini_search.classList.contains("hidden") ? "" : active_mini_search.click()
    active_toggle_hide_columns.querySelector("img").classList.contains("rotate-180") ? active_toggle_hide_columns.click() : ''

    active_full_search.querySelector("img").classList.toggle("rotate-180")

    main_content.classList.toggle("h-[88%]")
    main_content.classList.toggle("h-[46%]")
    
    // full_search.classList.contains("h-0") ? setTimeout(() => {full_search.classList.toggle("invisible")}, 250) : full_search.classList.toggle("invisible")
    full_search.classList.toggle("invisible")
    full_search.classList.toggle("h-0")
    full_search.classList.toggle("h-[42%]")
})
// сброс данных в расширенном поиске
reset_full_search.addEventListener("click", () => {
    Array.from(full_search.querySelectorAll(".input_text")).forEach(item => {
        item.value = ''
        item.setAttribute('id_', '')
    })
    filter_text_apply.classList.add("hidden")
    showAllRows()
})
// меняет список Тип дохода/расхода
function changeDropDownListInFullSearch() {
    full_search.querySelector(".contract_type_select").innerHTML = ''
    full_search.querySelector(".type_id_full_search").value = ''

    let ev = new Event("blur")
    full_search.querySelector(".type_id_full_search").dispatchEvent(ev)

    Array.from(full_search.querySelectorAll("input[type=checkbox]")).forEach(input => {
        if (input.checked) {
            fillDropDownLists(full_search.querySelector(".contract_type_select"), 
                              window.contract_type_list,
                              "id",
                              "name",
                              input.value) // заполнить списки типов
            
        }
    })
}
// event в расширенном поиске
full_search.querySelectorAll("input[type=checkbox]").forEach(input => {
    input.addEventListener("change", () => {
        if (!input.checked) {
            input.checked = false
            full_search.querySelector(".type_id_full_search").disabled = true
        } else {
            full_search.querySelectorAll("input[type=checkbox]").forEach(cb => {cb.checked = false})
            input.checked = true
            full_search.querySelector(".type_id_full_search").disabled = false
        }
        changeDropDownListInFullSearch()
    })
})
// применить расширенный поиск
find_full_search.addEventListener("click", () => {
    filter_text_apply.classList.remove("hidden")
    showAllRows(makeQueryForSearch("full"))
})


// открытие/закрытие функции скрывания столбцов
active_toggle_hide_columns.addEventListener("click", () => {
    mini_search.classList.contains("hidden") ? "" : active_mini_search.click()
    active_full_search.querySelector("img").classList.contains("rotate-180") ? active_full_search.click() : ''

    active_toggle_hide_columns.querySelector("img").classList.toggle("rotate-180")

    main_content.classList.toggle("h-[88%]")
    main_content.classList.toggle("h-[78%]")

    toggle_hide_columns.classList.toggle("invisible")
    toggle_hide_columns.classList.toggle("h-0")
    toggle_hide_columns.classList.toggle("h-[90px]")
})
function checkHiddenColumns() {
    // проверка какие столбцы отображать
    toggle_hide_columns.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
        typeof(localStorage[checkbox.id]) == "undefined" ? localStorage[checkbox.id] = true : ''
        checkbox.checked = eval(localStorage[checkbox.id])
    })

    toggle_hide_columns.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
        let column_class_name = checkbox.id.replace("column_", "") + "_w"
        if (eval(localStorage[checkbox.id])) {
            document.querySelectorAll(`.${column_class_name}`).forEach(element => {
                element.removeAttribute("style")
            })
        } else {
            document.querySelectorAll(`.${column_class_name}`).forEach(element => {
                element.style.display = "none"
            })
        }
    })
    // ф-ция для комбинированных столбцов
    let combiningColumns = (smt_list, main_class_name) => {
        let colspan_number = 0
        smt_list.forEach(item => {
            if (eval(localStorage[item])) {
                colspan_number++
            }
        })
        if (colspan_number == 0) {
            document.querySelectorAll(`.${main_class_name}`).forEach(item => {
                item.style.display = "none"
            })
        } else {
            document.querySelectorAll(`.${main_class_name}`).forEach(item => {
                item.removeAttribute("style")
                item.setAttribute("colspan", colspan_number)
            })
        }
    }
    combiningColumns(["column_invoice_name", "column_invoice_price", "column_invoice_date"], "invoiced_main_w")
    combiningColumns(["column_payment_amount", "column_payment_date"], "payment_main_w")
}
toggle_hide_columns.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        localStorage[checkbox.id] = checkbox.checked
        checkHiddenColumns()
    })
})
reset_toggle_hide_columns.addEventListener("click", () => {
    toggle_hide_columns.querySelectorAll("input[type=checkbox]").forEach(chb => {
        chb.checked = true
        localStorage[chb.id] = chb.checked
    })
    checkHiddenColumns()
})

// открытие окна внесения
function openIncomeWindow(is_it) {
    background.classList.toggle("hidden")
    background.classList.toggle("flex")
    insert_it_is.classList.toggle("hidden")
    insert_it_is.classList.toggle("flex")

    insert_it_is.innerHTML = incomeWindowHtml(is_it)

    insert_it_is.setAttribute("is_it", is_it)
    it_is_span.innerHTML = is_it
    if (is_it == "Доход") {
        income_window_head.classList.add("bg-[#E8ECEA]")
        add_expense.querySelector("span").innerHTML = "РАСХОД"
    } else if (is_it == "Расход"){
        income_window_head.classList.add("bg-[#EEE7E7]")
        add_expense.querySelector("span").innerHTML = "ДОХОД"
    }

    importantEvents()

}

income_btn.addEventListener("click", () => {
    openIncomeWindow("Доход")
})

expense_btn.addEventListener("click", () => {
    openIncomeWindow("Расход")
})

excel_load.addEventListener("click", () => {
    addLoading()
    axios({method: "get", url: `/manage_acc/contracts/export?session=${window.session}&query_token=${window.query_token}`, responseType: "blob"}).then(res => {
        var blob = new Blob([res.data], {
            type: res.headers["content-type"],
        })
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `report_${new Date().getTime()}.xlsx`;
        link.click()
    }).catch().finally(() => {removeLoading()})
})

eventsOnSearchSelects()
