// отрисовка строк
function drawRows(row_list, flag, elem_insert, checkbox_checked=false) {
    // flag - значения:(checkbox, plus, null) указывающий отрисовывать плюсы, checkbox или ничего в последний столбец
    // checkbox_checked - что не понятно?
    // elem_insert - DOMelement куда вставлять
    let showInvoice = function (invoice_list, key) {
        let list_ = []
        invoice_list.forEach(invoice => {
            list_.push(`<p class="my-1">${invoice[key] || ''}</p>`)
        })
        return list_.join("")
    }
    let showInvoiceDate = function (invoice_list, key) {
        let list_ = []
        invoice_list.forEach(invoice => {
            list_.push(`<p class="my-1">${changeDate(invoice[key]) || ''}</p>`)
        })
        return list_.join("")
    }
    let showInvoiceSum = function (invoice_list, key) {
        let list_ = []
        invoice_list.forEach(invoice => {
            list_.push(`<p class="my-1">${toLocalString(invoice[key]) || ''}</p>`)
        })
        return list_.join("")
    }
    row_list.forEach(row => {
        let last_column = ''
        switch(flag) {
            case "checkbox":
                // нужно добавлять checked если в linked_contracts главная строка содержит id этих строк
                last_column = `<input class="input_checkbox" type="checkbox" ${checkbox_checked ? "checked" : ''} id_row="${row["id"]}">`
                break
    
            case "plus":
                last_column = `<img class="cursor-pointer mx-auto plus_button_img transition-transform duration-700 hover:rotate-180" src="./img/plus_button.svg" alt="" it_is="${row["it_is"]}" id_row="${row["id"]}">`
                break
    
            case null:
                last_column = ""
        }

        let new_row = document.createElement("tr")
        new_row.className = `${row["it_is"] == "Доход" ? "bg-g-row" : "bg-r-row"} active_row cursor-pointer hover:bg-[#8080804f] active:bg-[#583f3f4f]`
        new_row.innerHTML = `
            <td class="col-div contract_id_w"><p>${row["id"]}</p></td>
            <td class="col-div it_is_w"><div class="flex flex-col"><p class="flex items-center gap-1 flex-wrap">${row["it_is"]}${row["is_repeated"] ? '<img src="./img/calendar.svg">' : ""}</p><span class="text-[9px]">${row["repeating_month"] ? repeating_month_reduction(row["repeating_month"]) : 'Месяц'}</span></div></td>
            <td class="col-div contractor_w"><p>${row["contractor"]}</p></td>
            <td class="col-div type_w"><p>${row["type"]}</p></td>
            <td class="col-div description_w"><p>${row["description"]}</p></td>
            <td class="col-div contract_w"><p>${row["contract"] || ''}</p></td>
            <td class="col-div contract_date_w"><p>${changeDate(row["contract_date"])}</p></td>
            <td class="col-div order_w"><p>${row["order"] || ""}</p></td>
            <td class="col-div order_date_w"><p>${changeDate(row["order_date"])}</p></td>
            <td class="col-div order_price_w"><p>${toLocalString(row["order_price"])}</p></td>
            <td class="col-div order_deadline_w"><p>${changeDate(row["order_deadline"])}</p></td>
            
            <td class="col-div invoice_name_w">${showInvoice(row["invoice"], "name")}</td>
            <td class="col-div invoice_price_w">${showInvoiceSum(row["invoice"], "price")}</td>
            <td class="col-div invoice_date_w">${showInvoiceDate(row["invoice"], "date")}</td>

            <td class="col-div payment_expected_date_w">${showInvoiceDate(row["invoice"], "payment_expected_date")}</td>
            <td class="col-div payment_amount_w">${showInvoiceSum(row["invoice"], "payment_amount")}</td>
            <td class="col-div payment_date_w">${showInvoiceDate(row["invoice"], "payment_date")}</td>
            <td class="col-div chain_w px-[7px]">${row["is_linked"] ? '<img class="py-[6px] cursor-pointer mx-auto" src="./img/chain.svg" alt="">' : ''}</td>
            <td class="col-div plus_w px-[7px]">${last_column}</td>
        `
        elem_insert.appendChild(new_row)
    })
    checkHiddenColumns()
}

// вывод записей в таблицу
function showAllRows(filter=null, page=1, query_token=null) {
    addLoading()
    queryAPI_GET(`contracts?page=${page}&query_token=${query_token ? query_token : ""}${filter ? "&"+filter : ""}`).then(res => {
        if (res.ok) {
            window.query_token = res.headers.get("query_token")
            window.filter = filter
            let row_counts = res.headers.get("row_counts")
            let limit_row = res.headers.get("limit_rows") || 50
            window.page_counts = Number(res.headers.get("page_counts"))

            res.json().then(json => {
                main_table_scroll.innerHTML = ''
                if (json.length) {
                    makePagination(window.page_counts, page)
                    // отобразить кол-во записей
                    all_count_rows_pag.innerText = `записей: ${limit_row * page - limit_row + 1}-${limit_row * page >= row_counts ? row_counts : limit_row * page} из ${row_counts}`
                    drawRows(json, "plus", document.querySelector("#main_table_scroll"))
                } else {
                    errorWin("Записи не найдены")
                }
                
                // навесить event на сами строки
                Array.from(document.querySelectorAll(".active_row")).forEach(row => {
                    row.addEventListener("click", e => {
                        if (!e.target.classList.contains("plus_button_img")) {
                            let main_type = row.querySelector(".plus_button_img").getAttribute("it_is")
                            let id_row = row.querySelector(".plus_button_img").getAttribute("id_row")
                            queryAPI_GET(`contract/${id_row}`).then(res => {
                                if (res.ok) {
                                    res.json().then(json => {
                                        if (main_type == "Доход") {
                                            income_btn.click()
                                            fillDetailInfo(json)
                                        } else {
                                            expense_btn.click()
                                            fillDetailInfo(json)
                                        }
                                    })

                                } else {
                                    // Сообщение об ошибке
                                    console.log(res.status);
                                    res.json().then(json => {
                                        errorWin(json["message"]);
                                    })
                                }
                            })

                        }
                    })
                })

                // навесить event на плюсы
                Array.from(document.querySelectorAll(".plus_button_img")).forEach(button => {
                    button.addEventListener("click", () => {
                        let main_row_id = button.getAttribute("id_row")
                        let it_is = button.getAttribute("it_is")
                        // очистить все записи
                        main_table_scroll.innerHTML = ''

                        // tbody для основного контракта поиска и связанных контрактов
                        let head_tbody = document.createElement("tbody")
                        head_tbody.className = `bg-white sticky top-[50px] z-10`
                        main_table_scroll.parentElement.insertBefore(head_tbody, main_table_scroll)

                        // кнопки сохранить и отмена
                        let buttons_div = document.createElement("div")
                        buttons_div.className = "flex absolute w-full top-0 left-0 h-full bg-[#ffffffcc] justify-center"
                        buttons_div.innerHTML = `
                            <div class="flex w-1/3 h-full items-center justify-around">
                                <div class="button" id="discard_changed_button">Отмена</div>
                                <div class="button" id="save_changed_button">Сохранить</div>
                            </div>
                        `
                        function_header.appendChild(buttons_div)

                        // скрыть пагинацию
                        main_pagination_div.classList.remove("flex")
                        main_pagination_div.classList.add("hidden")
                        all_count_rows_pag.classList.remove("flex")
                        all_count_rows_pag.classList.add("hidden")

                        // events на кнопки
                        // отменить изменения
                        discard_changed_button.addEventListener("click", () => {
                            buttons_div.remove()
                            head_tbody.remove()
                            showAllRows()
                            // показать пагинацию
                            main_pagination_div.classList.add("flex")
                            main_pagination_div.classList.remove("hidden")
                            all_count_rows_pag.classList.add("flex")
                            all_count_rows_pag.classList.remove("hidden")
                        })
                        // сохранить
                        save_changed_button.addEventListener("click", () => {
                            let body = {"relationship": []}
                            document.querySelector("#main_content").querySelectorAll("input:checked").forEach(chb => {
                                body["relationship"].push(Number(chb.getAttribute("id_row")))
                            })
                            queryAPI_PUT(body, `contract/${main_row_id}/relationship`).then(res => {
                                if (res.ok) {
                                    discard_changed_button.click()
                                    successfullyWin("Успешно!")
                                } else {
                                    // Сообщение об ошибке
                                    console.log(res.status);
                                    res.json().then(json => {
                                        errorWin(json["message"]);
                                    })
                                }
                            })
                        })

                        // убрать все поиски если активен
                        mini_search.classList.contains("hidden") ? '' : active_mini_search.click()
                        full_search.classList.contains("h-[36%]") ? active_full_search.click() : ''

                        // запрос на информацию о главной строки
                        addLoading()
                        queryAPI_GET(`contract/${main_row_id}`).then(res => {
                            if (res.ok) {
                                res.json().then(json => {
                                    // отрисовка главной строки
                                    drawRows([json], null, head_tbody)

                                    // запрос на информацию о связанных контрактах
                                    queryAPI_GET(`contract/${main_row_id}/relationship`).then(res => {
                                        if (res.ok) {
                                            res.json().then(json => {
                                                // заполнение связанными контрактами contract/1/relationship [linked_contracts] в head_tbody
                                                drawRows(json["linked_contracts"], "checkbox", head_tbody, true)
                                                
                                                // потом поиск
                                                let search_row = document.createElement("tr")
                                                // search_row.className = "flex mb-2 py-2"
                                                search_row.innerHTML = `
                                                    <td class="col-div px-1 py-2 border-none contract_id_w"><input type="text" class="input_text contract_id_w" disabled></td>
                                                    <td class="col-div px-1 py-2 border-none it_is_w"><input type="text" class="input_text it_is_w" disabled></td>
                                                    <td class="col-div px-1 py-2 border-none contractor_w">
                                                        <label class="flex flex-col w-full relative">
                                                            <input type="text" col_num="2" class="input_text contractor_w contractor_select_value search_select" id_="">
                                                            <ul class="contractor_select search_select_datalist scrolling min-w-[235px]" style="display: none;">
                                
                                                            </ul>
                                                        </label>
                                                    </td>
                                                    <td class="col-div px-1 py-2 border-none type_w">
                                                        <label class="flex flex-col w-full relative">
                                                            <input type="text" col_num="3" class="input_text type_w contract_type_select_value search_select" id_="">
                                                            <ul class="contract_type_select search_select_datalist scrolling" style="display: none;">
                                        
                                                            </ul>
                                                        </label>
                                                    </td>
                                                    <td class="col-div px-1 py-2 border-none description_w"><input col_num="4" type="text" class="input_text description_w"></td>
                                                    <td class="col-div px-1 py-2 border-none contract_w"><input col_num="5" type="text" class="input_text contract_w"></td>
                                                    <td class="col-div px-1 py-2 border-none contract_date_w"><input col_num="6" type="date" class="input_text contract_date_w"></td>
                                                    <td class="col-div px-1 py-2 border-none order_w"><input col_num="7" type="text" class="input_text order_w"></td>
                                                    <td class="col-div px-1 py-2 border-none order_date_w"><input col_num="8" type="date" class="input_text order_date_w"></td>
                                                    <td class="col-div px-1 py-2 border-none order_price_w"><input col_num="9" type="text" class="input_text order_price_w" oninput="digits_float(this)"></td>
                                                    <td class="col-div px-1 py-2 border-none order_deadline_w"><input col_num="10" type="date" class="input_text order_deadline_w"></td>
                                                    <td class="col-div px-1 py-2 border-none invoice_name_w"><input col_num="11" type="text" class="input_text invoice_name_w"></td>
                                                    <td class="col-div px-1 py-2 border-none invoice_price_w"><input col_num="12" type="text" class="input_text invoice_price_w" oninput="digits_float(this)"></td>
                                                    <td class="col-div px-1 py-2 border-none invoice_date_w"><input col_num="13" type="date" class="input_text invoice_date_w"></td>
                                                    <td class="col-div px-1 py-2 border-none payment_expected_date_w"><input col_num="14" type="date" class="input_text payment_expected_date_w"></td>
                                                    <td class="col-div px-1 py-2 border-none payment_amount_w"><input col_num="15" type="text" class="input_text payment_amount_w" oninput="digits_float(this)"></td>
                                                    <td class="col-div px-1 py-2 border-none payment_date_w"><input col_num="16" type="date" class="input_text payment_date_w"></td>
                                                    <td colspan="2" class="col-div px-1 py-2 border-none"><div class="button mx-auto w-16">Сбросить</div></td>
                                                `
                                                head_tbody.appendChild(search_row)
                                                fillDropDownListsContractors(search_row.querySelector(".contractor_select"), window.contractors_list, 'id', 'name') // заполнить списки
                                                fillDropDownLists(search_row.querySelector(".contract_type_select"), window.contract_type_list, 'id', 'name', it_is.toUpperCase() == "РАСХОД" ? "Доход" : "РАСХОД") // заполнить списки
                                                eventsOnSearchSelects()
                                                
                                                drawRows(json["other_contracts"], "checkbox", main_table_scroll)
                                                
                                                // event на все checkbox в таблице
                                                Array.from(main_table_scroll.parentElement.querySelectorAll("input[type=checkbox]")).forEach(chb => {
                                                    chb.addEventListener("change", () => {
                                                        let row = chb.parentElement.parentElement
                                                        if (chb.checked) {
                                                            head_tbody.insertBefore(row, search_row)
                                                        } else {
                                                            main_table_scroll.appendChild(row)
                                                        }
                                                    })
                                                })

                                                // применить фильтр
                                                /////////////////////////
                                                let search_inputs = search_row.querySelectorAll("input")
                                                let for_text = (elem) => {
                                                    let search_col = Array.from(main_table_scroll.querySelectorAll(".active_row"))
                                                    let phrase = elem.value.toUpperCase()
                                                    search_col.forEach(row => {
                                                        let needed_div = row.querySelectorAll(".col-div")[elem.getAttribute("col_num")]
                                                        let text_content = needed_div.textContent.toUpperCase()
                                                        if (text_content.includes(phrase)) {
                                                            row.removeAttribute("style")
                                                        } else {
                                                            row.style.display = 'none'
                                                        }
                                                    })
                                                }
                                                let for_sum = (elem) => {
                                                    let search_col = Array.from(main_table_scroll.querySelectorAll(".active_row"))
                                                    let phrase = toLocalString(toNumber(elem.value.toUpperCase()))
                                                    search_col.forEach(row => {
                                                        let needed_div = row.querySelectorAll(".col-div")[elem.getAttribute("col_num")]
                                                        let text_content = needed_div.textContent.toUpperCase()
                                                        if (text_content.includes(phrase)) {
                                                            row.removeAttribute("style")
                                                        } else {
                                                            row.style.display = 'none'
                                                        }
                                                    })
                                                }
                                                let for_date = (elem) => {
                                                    let search_col = Array.from(main_table_scroll.querySelectorAll(".active_row"))
                                                    let phrase = changeDate(elem.value)
                                                    search_col.forEach(row => {
                                                        let needed_div = row.querySelectorAll(".col-div")[elem.getAttribute("col_num")]
                                                        let text_content = needed_div.textContent.toUpperCase()
                                                        if (text_content.includes(phrase)) {
                                                            row.removeAttribute("style")
                                                        } else {
                                                            row.style.display = 'none'
                                                        }
                                                    })
                                                }

                                                search_inputs[2].addEventListener("blur", () => {for_text(search_inputs[2])})
                                                search_inputs[3].addEventListener("blur", () => {for_text(search_inputs[3])})
                                                search_inputs[4].addEventListener("input", () => {for_text(search_inputs[4])})
                                                search_inputs[5].addEventListener("input", () => {for_text(search_inputs[5])})
                                                search_inputs[6].addEventListener("input", () => {for_date(search_inputs[6])})
                                                search_inputs[7].addEventListener("input", () => {for_text(search_inputs[7])})
                                                search_inputs[8].addEventListener("input", () => {for_date(search_inputs[8])})
                                                search_inputs[9].addEventListener("input", () => {for_sum(search_inputs[9])})
                                                search_inputs[10].addEventListener("input", () => {for_date(search_inputs[10])})
                                                search_inputs[11].addEventListener("input", () => {for_text(search_inputs[11])})
                                                search_inputs[12].addEventListener("input", () => {for_sum(search_inputs[12])})
                                                search_inputs[13].addEventListener("input", () => {for_date(search_inputs[13])})
                                                search_inputs[14].addEventListener("input", () => {for_date(search_inputs[14])})
                                                search_inputs[15].addEventListener("input", () => {for_sum(search_inputs[15])})
                                                search_inputs[16].addEventListener("input", () => {for_date(search_inputs[16])})
                                                /////////////////////////

                                                // сбросить фильтр
                                                search_row.querySelectorAll(".button")[0].addEventListener("click", () => {
                                                    let event_input = new Event("input")
                                                    let event_blur = new Event("blur")
                                                    Array.from(search_row.querySelectorAll("input")).forEach(item => {
                                                        item.value = ''
                                                        item.dispatchEvent(event_input)
                                                        item.dispatchEvent(event_blur)
                                                    })
                                                })
                                            })
                                        } else {
                                            // Сообщение об ошибке
                                            console.log(res.status);
                                            res.json().then(json => {
                                                errorWin(json["message"]);
                                            })
                                        }
                                    }).finally(() => {removeLoading()})
                                })
                            } else {
                                // Сообщение об ошибке
                                console.log(res.status);
                                res.json().then(json => {
                                    errorWin(json["message"]);
                                })
                            }
                        })
                    })
                })

            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).finally(() => {removeLoading()})
}