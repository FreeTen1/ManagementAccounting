eventsOnSearchSelects()
// изменение фильтров
function showFilter1() {
    filter_div1.classList.remove("hidden")
    filter_div1.classList.add("flex")

    filter_div2.classList.remove("flex")
    filter_div2.classList.add("hidden")
}
function showFilter2() {
    Array.from(filter_div2.querySelectorAll("input[type=month]")).every(elem => {return elem.value}) ? curr_month_span.innerHTML = `${repeating_month(filter_div2.querySelectorAll("input[type=month]")[0].value).toUpperCase()} - ${repeating_month(filter_div2.querySelectorAll("input[type=month]")[1].value).toUpperCase()}` : ''

    filter_div2.classList.remove("hidden")
    filter_div2.classList.add("flex")

    filter_div1.classList.remove("flex")
    filter_div1.classList.add("hidden")
}

var mouseover_1 = () => {
    transform_div1.classList.remove("h-8")
    transform_div1.classList.add("h-28")

    transform_div1.querySelector("div").classList.remove("hidden")
    transform_div1.querySelector("div").classList.add("flex")
}
var mouseleave_1 = () => {
    transform_div1.classList.add("h-8")
    transform_div1.classList.remove("h-28")

    transform_div1.querySelector("div").classList.add("hidden")
    transform_div1.querySelector("div").classList.remove("flex")
}
var mouseover_2 = () => {
    transform_div2.classList.remove("h-8")
    transform_div2.classList.add("h-28")

    transform_div2.querySelector("div").classList.remove("hidden")
    transform_div2.querySelector("div").classList.add("flex")
}
var mouseleave_2 = () => {
    transform_div2.classList.add("h-8")
    transform_div2.classList.remove("h-28")

    transform_div2.querySelector("div").classList.add("hidden")
    transform_div2.querySelector("div").classList.remove("flex")
}

function sideBarEvents(selected_element) {
    transform_div1.addEventListener("mouseover", mouseover_1)
    transform_div1.addEventListener("mouseleave", mouseleave_1)
    transform_div2.addEventListener("mouseover", mouseover_2)
    transform_div2.addEventListener("mouseleave", mouseleave_2)
    
    let selectable_p = document.querySelectorAll(".selectable_p")

    // убрать подцветку и подчёркивание
    transform_div1.classList.remove("bg-sidebar-select")
    transform_div2.classList.remove("bg-sidebar-select")
    selectable_p.forEach(item => {
        item.classList.remove("underline")
        item.parentElement.classList.remove("bg-sidebar-select")
    })

    // подчеркнуть нужный элемент
    selected_element.classList.add("underline")
    
    let hover_event = new Event("mouseover")
    let leave_event = new Event("mouseleave")
    selectable_p.forEach(item => {
        if (item.classList.contains("underline") && item.parentElement.parentElement.id == "transform_div1") {
            
            transform_div1.dispatchEvent(hover_event)
            
            transform_div2.dispatchEvent(leave_event)

            transform_div1.removeEventListener("mouseover", mouseover_1)
            transform_div1.removeEventListener("mouseleave", mouseleave_1)

            item.parentElement.parentElement.classList.add("bg-sidebar-select")

        } else if (item.classList.contains("underline") && item.parentElement.parentElement.id == "transform_div2") {
            
            transform_div2.dispatchEvent(hover_event)

            transform_div1.dispatchEvent(leave_event)

            transform_div2.removeEventListener("mouseover", mouseover_2)
            transform_div2.removeEventListener("mouseleave", mouseleave_2)

            item.parentElement.parentElement.classList.add("bg-sidebar-select")

        } else if (item.classList.contains("underline")) {
            
            transform_div1.dispatchEvent(leave_event)
            transform_div2.dispatchEvent(leave_event)

            item.parentElement.classList.add("bg-sidebar-select")
        }
    })
}

sideBarEvents(document.querySelector(".selectable_p"))

document.querySelectorAll(".selectable_p").forEach(item => {
    item.addEventListener("click", () => {
        sideBarEvents(item)
    })
})

// filters1
filter_div1.querySelectorAll("input[type=month]").forEach(inp => {
    inp.addEventListener("change", () => {
        if (Array.from(filter_div1.querySelectorAll("input[type=month]")).some(elem => {return elem.value})) {
            reset_filter1.classList.remove("invisible")
        } else {
            reset_filter1.classList.add("invisible")
        }
    })
})

go_filter1.addEventListener("click", () => {
    if (Array.from(filter_div1.querySelectorAll("input[type=month]")).every(elem => {return elem.value})) {
        window.filter1 = `end_date=${end_date1.value}`
        document.querySelector(".underline").click()
    } else {
        errorWin("Заполните все поля для фильтрации")
    }
})
reset_filter1.addEventListener("click", () => {
    Array.from(filter_div1.querySelectorAll("input[type=month]")).forEach(elem => {
        elem.value = ""
    })
    window.filter1 = ''
    document.querySelector(".underline").click()
    reset_filter1.classList.add("invisible")
})

// Выгрузить данные за месяц в ПРОГНОЗ ОСТАТКА
load_excel_remaining_forecast.addEventListener("click", () => {
    let month = load_excel_remaining_forecast.parentElement.querySelector("input").getAttribute("id_")
    if (checkImportantFields(load_excel_remaining_forecast.parentElement)) {
        addLoading()
        axios({method: "get", url: `/manage_acc/report/balance_forecast/export?end_date=${month}&session=${window.session}`, responseType: "blob"}).then(res => {
            var blob = new Blob([res.data], {
                type: res.headers["content-type"],
            })
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `report_${new Date().getTime()}.xlsx`;
            link.click()
        }).catch().finally(() => {removeLoading()})
    }
})

// filters2
filter_div2.querySelectorAll("input[type=month]").forEach(inp => {
    inp.addEventListener("change", () => {
        if (Array.from(filter_div2.querySelectorAll("input[type=month]")).some(elem => {return elem.value})) {
            reset_filter2.classList.remove("invisible")
        } else {
            reset_filter2.classList.add("invisible")
        }
    })
})

go_filter2.addEventListener("click", () => {
    if (Array.from(filter_div2.querySelectorAll("input[type=month]")).every(elem => {return elem.value})) {
        window.filter2 = `start_date=${start_date.value}&end_date=${end_date.value}`
        document.querySelector(".underline").click()
        curr_month_span.innerHTML = `${repeating_month(filter_div2.querySelectorAll("input[type=month]")[0].value).toUpperCase()} - ${repeating_month(filter_div2.querySelectorAll("input[type=month]")[1].value).toUpperCase()}`
    } else {
        errorWin("Заполните все поля для фильтрации")
    }
})
reset_filter2.addEventListener("click", () => {
    Array.from(filter_div2.querySelectorAll("input[type=month]")).forEach(elem => {
        elem.value = ""
    })
    window.filter2 = ''
    document.querySelector(".underline").click()
    reset_filter2.classList.add("invisible")
    // заполнить текущие данные за год
    let curr_date = new Date()
    curr_month_span.innerHTML = repeating_month(`${curr_date.getFullYear()}-${curr_date.getMonth() + 1}`).toUpperCase()
})



// ОБЩИЙ ДОХОД
total_income.addEventListener("click", () => {
    showFilter2()
    analitics_content.innerHTML = ''
    addLoading()
    queryAPI_GET(`report/total_income?${window.filter2 || ""}`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                window.by_years_info = json["info"]["by_years"]
                window.year_by_contractors_info = json["info"]["year_by_contractors"]
                window.period_by_contractors_info = json["info"]["period_by_contractors"]
                tripleElements(json)
                window.filter2 ? dynamic_text.classList.add("invisible") : dynamic_text.classList.remove("invisible")
            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).catch().finally(() => {removeLoading()})
})

// ПО ТИПАМ ДОХОДА
for_type_income.addEventListener("click", () => {
    showFilter2()
    analitics_content.innerHTML = ''
    addLoading()
    queryAPI_GET(`report/income_by_contract_types?${window.filter2 || ""}`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                window.by_contractors_info = json["info"]["by_contractors"]
                window.by_types_info = json["info"]["by_types"]
                doubleElements("income", json, "ДОХОД ОТ КОНТРАГЕНТОВ", "РАСПРЕДЕЛЕНИЕ ДОХОДА ПО ТИПУ", "процент от общей суммы дохода за текущий период", "#D0E7DB")
            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).catch().finally(() => {removeLoading()})
})

// ВСЕ РАСХОДЫ
paid_to_contractors.addEventListener("click", () => {
    showFilter2()
    analitics_content.innerHTML = ''
    addLoading()
    queryAPI_GET(`report/expenses_by_contract_types?${window.filter2 || ""}`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                window.by_contractors_info = json["info"]["by_contractors"]
                window.by_types_info = json["info"]["by_types"]
                doubleElements("expenses", json, "ОПЛАЧЕНО КОНТРАГЕНТАМ", "РАСПРЕДЕЛЕНИЕ ПЛАТЕЖЕЙ ПО ТИПУ", '', "#D0E7DB")
            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).catch().finally(() => {removeLoading()})
})

// НЕ ОПЛАЧЕНО КОНТРАГЕНТАМИ
not_paid.addEventListener("click", () => {
    showFilter2()
    analitics_content.innerHTML = ''
    addLoading()
    queryAPI_GET(`report/unpaid?${window.filter2 || ""}`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                window.by_contractors_info = json["info"]["by_contractors"]
                window.by_types_info = json["info"]["by_types"]
                doubleElements("unpaid", json, "НЕ ОПЛАЧЕНО КОНТРАГЕНТАМИ", "РАСПРЕДЕЛЕНИЕ КОЛИЧЕСТВА НЕ ОПЛАЧЕННЫХ ПЛАТЕЖЕЙ ПО ТИПУ", '', "#E2CCCC")
            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).catch().finally(() => {removeLoading()})
})

// НЕ ОПЛАЧЕНО МЕТРО-ТЕЛЕКОМ
we_not_paid.addEventListener("click", () => {
    showFilter2()
    analitics_content.innerHTML = ''
    addLoading()
    queryAPI_GET(`report/we_unpaid?${window.filter2 || ""}`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                window.by_contractors_info = json["info"]["by_contractors"]
                window.by_types_info = json["info"]["by_types"]
                doubleElements("unpaid", json, "НЕ ОПЛАЧЕНО МЕТРО-ТЕЛЕКОМОМ", "РАСПРЕДЕЛЕНИЕ КОЛИЧЕСТВА НЕ ОПЛАЧЕННЫХ ПЛАТЕЖЕЙ ПО ТИПУ", '', "#E2CCCC")
            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).catch().finally(() => {removeLoading()})
})

// ПРОГНОЗ ОСТАТКА
remaining_forecast.addEventListener("click", () => {
    showFilter1()
    // заполнить текущие данные за год
    let curr_date = new Date()
    curr_month_span.innerHTML = repeating_month(`${curr_date.getFullYear()}-${curr_date.getMonth() + 1}`).toUpperCase()

    analitics_content.innerHTML = ''
    let new_div = document.createElement("div")
    new_div.style.paddingTop = "50px"
    new_div.style.minWidth = "100%"
    new_div.style.overflowY = "auto"
    new_div.id = "remaining_forecast_new_div"
    analitics_content.appendChild(new_div)

    let new_p = document.createElement("div")
    new_p.style.display = 'flex'
    new_p.style.alignItems = "center"
    new_p.style.gap = '10px'
    new_p.style.marginTop = '60px'
    addLoading()
    queryAPI_GET(`report/balance_forecast?${window.filter1 || ""}`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                window.current_balance_info = json["info"]["current_balance"]
                window.months_info = json["info"]["months"]
                let set_delta = {
                    div_id: "remaining_forecast_new_div",
                    title: "ПРОГНОЗ ОСТАТКА СРЕДСТВ НА ПЕРВОЕ ЧИСЛО МЕСЯЦА",
                    x: Object.keys(json["months"]),
                    width: analitics_content.offsetWidth - 50,
                    height: 500,
                    data_curr: Object.values(json["months"]).slice(0, 1),
                    data_next: [null].concat(Object.values(json["months"]).slice(1)),
                    trend: Object.values(json["trend"]),
                }
                drawDiagramChartsTwo(set_delta)
                let today = new Date()
                new_p.innerHTML = `ТЕКУЩИЙ ОСТАТОК НА ${today.getDate()} ${repeating_month(today.getFullYear() + '-' + (today.getMonth() + 1))}: <img src="./img/money_tower.svg"> ${toLocalString(json['current_balance'])}`
                new_div.appendChild(new_p)

                let load_excel_datalist = document.querySelector(".load_excel_datalist")
                load_excel_datalist.innerHTML = ""
                Object.keys(json["months"]).forEach(item => {
                    let new_option = document.createElement("li")
                    new_option.setAttribute("value", item)
                    new_option.innerHTML = repeating_month(item)
                    load_excel_datalist.appendChild(new_option)
                })
            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).catch().finally(() => {removeLoading()})
})

// заполнить текущие данные за год
let curr_date = new Date()
curr_month_span.innerHTML = repeating_month(`${curr_date.getFullYear()}-${curr_date.getMonth() + 1}`).toUpperCase()

total_income.click()

// информационная кнопка
info_button.addEventListener("click", () => {
    if (analitics_content.innerHTML) {
        background_info.innerHTML = ''
        background_info.classList.toggle("hidden")
        background_info.classList.toggle("flex")

        let info_window = document.querySelector(".underline").id

        switch(info_window) {
            case "total_income":
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[0], "ДОХОД ОТ КОНТРАГЕНТОВ", window.period_by_contractors_info, 14)
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[1].children[0], "ОБЩИЙ ДОХОД", window.by_years_info, 14)
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[1].children[1], "ПРОЦЕНТ ОТ ОБЩЕГО ДОХОДА ЗА ГОД ПО КОНТРАГЕНТАМ", window.year_by_contractors_info, 14)

            break

            case "for_type_income":
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[0], "ДОХОД ОТ КОНТРАГЕНТОВ", window.by_contractors_info)
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[1], "РАСПРЕДЕЛЕНИЕ ДОХОДА ПО ТИПУ", window.by_types_info)
            break
            
            case "paid_to_contractors":
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[0], "ОПЛАЧЕНО КОНТРАГЕНТАМ", window.by_contractors_info)
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[1].children[0], "РАСПРЕДЕЛЕНИЕ ПЛАТЕЖЕЙ ПО ТИПУ", window.by_types_info)
            break

            case "not_paid":
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[0], "НЕ ОПЛАЧЕНО КОНТРАГЕНТАМИ", window.by_contractors_info)
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[1].children[0], "РАСПРЕДЕЛЕНИЕ КОЛИЧЕСТВА НЕ ОПЛАЧЕННЫХ ПЛАТЕЖЕЙ ПО ТИПУ", window.by_types_info)
            break

            case "we_not_paid":
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[0], "НЕ ОПЛАЧЕНО МЕТРО-ТЕЛЕКОМ", window.by_contractors_info)
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[1].children[0], "РАСПРЕДЕЛЕНИЕ КОЛИЧЕСТВА НЕ ОПЛАЧЕННЫХ ПЛАТЕЖЕЙ ПО ТИПУ", window.by_types_info)
            break

            case "remaining_forecast":
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[2], "ПРОГНОЗ ОСТАТКА", window.months_info)
                createInfoBlock("background_info", document.querySelector("#analitics_content").children[0].children[4], window.current_balance_info, '', 46, document.querySelector("#analitics_content").children[0].children[2].clientWidth)

            break
        }

    } else {
        errorWin("Нет данных")
    }
})

// скрыть информационное меню
background_info.addEventListener("click", () => {
    background_info.classList.toggle("hidden")
    background_info.classList.toggle("flex")
})
