function drawAllCharts(params=null) {
    addLoading()
    queryAPI_GET(`dashboard?${params || ""}`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                makeData = charts_type => {
                    let data = []
                    Object.keys(json["delta"]["trend"]).forEach(key => {
                        data.push(charts_type[key] == undefined ? null : charts_type[key])
                    })
                    return data
                }
                // САЛЬДО
                let set_delta = {
                    div_id: "chart_delta_div",
                    title: "САЛЬДО",
                    x: Object.keys(json["delta"]["trend"]),
                    width: 1290,
                    height: 400,
                    fact: makeData(json["delta"]["fact"]),
                    plan: makeData(json["delta"]["plan"]),
                    trend: makeData(json["delta"]["trend"]),
                }
                let set_debit = {
                    div_id: "chart_debit_div",
                    title: "ДОХОД",
                    x: Object.keys(json["debit"]["trend"]),
                    width: 920,
                    height: 300,
                    fact: makeData(json["debit"]["fact"]),
                    plan: makeData(json["debit"]["plan"]),
                    trend: makeData(json["debit"]["trend"]),
                }
                let set_credit = {
                    div_id: "chart_credit_div",
                    title: "РАСХОД",
                    x: Object.keys(json["credit"]["trend"]),
                    width: 920,
                    height: 300,
                    fact: makeData(json["credit"]["fact"]),
                    plan: makeData(json["credit"]["plan"]),
                    trend: makeData(json["credit"]["trend"]),
                }
                drawDiagramCharts(set_delta)
                drawDiagramCharts(set_debit)
                drawDiagramCharts(set_credit)
                
                // заполнение заголовка промежутка годов
                if (params) {
                    let date_start = filters.querySelectorAll("input[type=month]")[0].value
                    let date_end = filters.querySelectorAll("input[type=month]")[1].value
                    head_years.innerHTML = `Данные за <span class="font-bold">${repeating_month(date_start)} - ${repeating_month(date_end)}</span> год`
                } else {
                    let curr_year = new Date().getFullYear()
                    head_years.innerHTML = `Данные за <span class="font-bold">${repeating_month(curr_year + '-01')} - ${repeating_month(curr_year + '-12')}</span> год`
                }
            })
        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).catch().finally(() => {removeLoading()})
}

drawAllCharts()

filters.querySelectorAll("input[type=month]").forEach(inp => {
    inp.addEventListener("change", () => {
        if (Array.from(filters.querySelectorAll("input[type=month]")).some(elem => {return elem.value})) {
            reset_filter.classList.remove("invisible")
        } else {
            reset_filter.classList.add("invisible")
        }
    })
})


apply_filter.addEventListener("click", () => {
    if (!Array.from(filters.querySelectorAll("input[type=month]")).every(elem => {return elem.value})) {
        errorWin("Введены не все параметры")
    } else {
        let start_date = filters.querySelectorAll("input[type=month]")[0].value
        let end_date = filters.querySelectorAll("input[type=month]")[1].value
        drawAllCharts(`start_date=${start_date}&end_date=${end_date}`)
    }
})

reset_filter.addEventListener("click", () => {
    filters.querySelectorAll("input[type=month]").forEach(inp => {
        inp.value = ''
    })
    reset_filter.classList.add("invisible")
    drawAllCharts()
})

// информационная кнопка
info_button.addEventListener("click", () => {
    background_info.innerHTML = ''
    background_info.classList.toggle("hidden")
    background_info.classList.toggle("flex")

    createInfoBlock("background_info", document.querySelector("#chart_delta_div"), "Заголовок1", "Lorem", indent=30)
    createInfoBlock("background_info", document.querySelector("#chart_debit_div"), "Заголовок2", "Lorem", indent=30)
    createInfoBlock("background_info", document.querySelector("#chart_credit_div"), "Заголовок3", "Lorem", indent=30)
})

// скрыть информационное меню
background_info.addEventListener("click", () => {
    background_info.classList.toggle("hidden")
    background_info.classList.toggle("flex")
})