function makePieData(data) {
    let result = []
    data.forEach(item => {
        result.push({name: item["name"], y: item["value"], color: item["color"], linked_ids: item["contractors"]})
    })
    return result
}
function makePieDataContractor(data) {
    let result = []
    data.forEach(item => {
        result.push({name: item["name"], y: item["value"], color: item["color"], contractor_id: item["id"]})
    })
    return result
}
function tripleElements(json) {
    let makeRows1 = period_by_contractors => {
        let rows = ``
        period_by_contractors.forEach(item => {
            let arrow = item["is_increased"] == true ? 
                            `<div class="flex justify-center items-center min-w-[50px] h-full bg-[#D9D9D9]"><img src="./img/go_up.svg"><span>${item["percent"]}%</span></div>` : 
                        (item["is_increased"] == false ? `<div class="flex justify-center items-center min-w-[50px] h-full bg-[#D9D9D9]"><img src="./img/go_dawn.svg"><span>${item["percent"]}%</span></div>` : "")
            
            rows += `
            <div class="flex gap-2 h-6 text-xs cursor-pointer click_rows mt-3" style="width: ${widthPercent(json["max_values"]["period_by_contractors"], item["value"])}%; min-width: 270px;" contractor_id=${item["id"]}>
                <div class="flex px-2 gap-4 items-center justify-between min-w-[170px] w-[93%] h-full text-[#FFFFFF] colors_row" style="background: ${item["color"]};" title="${item["name"].replaceAll('"', "'")}">
                    <span class="truncate">${item["name"]}</span>
                    <span>${toLocalString(item["value"])}</span>
                </div>
                ${arrow}
            </div>
            `
        })
        return rows
    }

    let html_str = `
    <div class="flex w-full h-full justify-around">
        <div class="flex flex-col w-[40%] h-full gap-5">
            <div class="flex flex-col w-full text-center">
                <p>ДОХОД ОТ КОНТРАГЕНТОВ</p>
                <p class="text-xs" id="dynamic_text">динамика в сравнении с прошлым месяцем</p>
                <div id="period_by_contractors_chart"></div>
            </div>
        </div>

        <div class="flex flex-col w-[40%] h-full justify-between">
            
            <div class="flex flex-col w-full h-[33%] gap-5">
                <div class="flex flex-col w-full">
                    <p class="flex justify-center items-center gap-2">ОБЩИЙ ДОХОД<span id="contractor_name"></span></p>
                    <p class="h-4"></p>
                </div>
                
                <div class="w-full overflow-auto scrolling" id="by_years_div">
                    <!-- СТРОКИ -->
                    ${totalIncomeByYears(json["by_years"], json["max_values"]["by_years"])}
                    <!--  -->
                </div>

            </div>

            <div class="flex flex-col w-full h-[64%] gap-6">
                <div class="flex flex-col w-full text-center">
                    <p>ПРОЦЕНТ ОТ ОБЩЕГО ДОХОДА ЗА ГОД ПО КОНТРАГЕНТАМ</p>
                </div>

                <div id="pie_div"></div>
            
            </div>
        
        </div>
    
    </div>
    `
    analitics_content.innerHTML = html_str
    
    drawPieCharts({"div_id": "pie_div", "data": makePieDataContractor(json["year_by_contractors"])})

    let period_by_contractors_options = (period_by_contractors_list) => {
        let x_list = []
        let fact_list = []
        let plan_list = []
        period_by_contractors_list.forEach(item => {
            x_list.push(item["name"])
            fact_list.push({y: item["fact"]["value"], color: item["color"], is_increased: item["fact"]["is_increased"], percent: item["fact"]["percent"], contractor_id: item["id"]})
            plan_list.push({y: item["plan"]["value"], color: item["color"], is_increased: item["plan"]["is_increased"], percent: item["plan"]["percent"], contractor_id: item["id"]})
        })
        let result = {
            div_id: "period_by_contractors_chart",
            title: "",
            x: x_list,
            height: 300,
            fact: fact_list,
            plan: plan_list,
        }
        return result
    }
    drawPeriodByContractorsChart(period_by_contractors_options(json["period_by_contractors"]))

    // event на кликанье строчек
    Array.from(document.querySelectorAll(".click_rows")).forEach(row => {
        row.addEventListener("click", () => {
            if (row.style.opacity == 1) {
                total_income.click()
            } else {
                document.querySelectorAll(".click_rows").forEach(elem => {
                    elem.style.opacity = 0.3
                })
                row.style.opacity = 1

                queryAPI_GET(`report/total_income/${row.getAttribute("contractor_id")}`).then(res => {
                    if (res.ok) {
                        res.json().then(json => {
                            by_years_div.innerHTML = totalIncomeByYears(json["year_by_contractors"], json["max_values"]["year_by_contractors"])
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
}

function doubleElements(type, json, name1, name2, name3='', row_color="") {
    let makeRows1 = by_contractors => {
        let makeRows1_1 = (contract_types, max_value) => {
            let rows = ``
            contract_types.forEach(item => {
                if (item["count"]) {
                    rows += `
                    <div class="flex gap-2 h-6 text-xs" style="min-width: 270px; width: ${widthPercent(max_value, item["value"])}%;">
                        <div class="flex gap-1 h-6 w-full">
                            <div class="flex items-center justify-center min-w-[24px] w-6 bg-[#D9D9D9]">${item["count"]}</div>
                            <div class="flex pl-7 pr-2 gap-4 items-center justify-between h-full bg-[#D9D9D9]" style="width: calc(100% - 28px);" title="${item["name"].replaceAll('"', "'")}">
                                <span class="truncate">${item["name"]}</span>
                                <span>${toLocalString(item["value"])}</span>
                            </div>
                        </div>
                    </div>
                    `
                } else {
                let arrow = item["is_increased"] == true ? 
                            `<div class="flex justify-center items-center min-w-[50px] h-full bg-[#D9D9D9]"><img src="./img/go_up.svg"><span>${item["percent"]}%</span></div>` : 
                            (item["is_increased"] == false ? `<div class="flex justify-center items-center min-w-[50px] h-full bg-[#D9D9D9]"><img src="./img/go_dawn.svg"><span>${item["percent"]}%</span></div>` : "")

                rows += `
                <div class="flex gap-2 h-6 text-xs" style="min-width: 270px; width: ${widthPercent(max_value, item["value"])}%;">
                    <div class="flex pl-7 pr-2 gap-4 items-center justify-between w-[93%] h-full bg-[#D9D9D9]" title="${item["name"].replaceAll('"', "'")}">
                        <span class="truncate">${item["name"]}</span>
                        <span>${toLocalString(item["value"])}</span>
                    </div>
                    ${arrow}
                </div>
                `
                }

            })
            return rows
        }

        let rows = ``
        by_contractors.forEach(item => {
            if (item["count"]) {
                rows += `
                <div class="flex flex-col text-xs h-6 justify-start items-center gap-2 transition-all duration-500 overflow-hidden mt-3" style="min-width: 270px; width: ${widthPercent(json["max_values"]["by_contractors"], item["value"])}%;">
                    <div class="flex gap-1 h-6 w-full main_row" contractors_id="${item["id"]}">
                        <div class="flex items-center justify-center h-6 min-w-[24px]" style="background: ${row_color}">${item["count"]}</div>
                        <div class="flex h-full gap-4 justify-between items-center pr-2 cursor-pointer rounded-l-full" style="width: calc(100% - 28px); background: ${row_color}" title="${item["name"].replaceAll('"', "'")}">
                            <div class="flex items-center gap-1 h-full truncate">
                                <div class="rounded-full min-h-[24px] min-w-[24px]" style="background: ${item["color"]};"></div>
                                <span class="truncate">${item["name"]}</span>
                            </div>
                            <p>${toLocalString(item["value"])}</p>
                        </div>
                    </div>
    
                    <div class="hidden flex-col w-full gap-2 dropdown_div">
                        <!-- скрытые строки -->
                        ${makeRows1_1(item["contract_types"], item["value"])}
                        <!--  -->
                    </div>
                </div>
                `
            } else {
                rows += `
                <div class="flex flex-col text-xs h-6 justify-start items-center gap-2 transition-all duration-500 overflow-hidden mt-3" style="min-width: 270px; width: ${widthPercent(json["max_values"]["by_contractors"], item["value"])}%;">
                    <div class="flex h-6 w-full gap-4 justify-between items-center pr-2 cursor-pointer main_row rounded-l-full" style="background: ${row_color}" contractors_id="${item["id"]}" title="${item["name"].replaceAll('"', "'")}">
                        <div class="flex items-center gap-1 h-full truncate">
                            <div class="rounded-full min-h-[24px] min-w-[24px]" style="background: ${item["color"]};"></div>
                            <span class="truncate">${item["name"]}</span>
                        </div>
                        <p>${toLocalString(item["value"])}</p>
                    </div>
    
                    <div class="hidden flex-col w-full gap-2 dropdown_div">
                        <!-- скрытые строки -->
                        ${makeRows1_1(item["contract_types"], item["value"])}
                        <!--  -->
                    </div>
                </div>
                `
            }

        })
        return rows
    }

    let additionalInfo = () => {
        let result = ``
        switch(type) {
            case 'income':
                break

            case 'expenses':
                result += `
                <div class="flex flex-col w-full items-center gap-2 mt-12">
                    <p>ОБЩАЯ СУММА ПЛАТЕЖЕЙ</p>
                    <span class="flex text-2xl gap-3"><img src="./img/money_tower.svg">${toLocalString(json["total_sum"])}</span>
                </div>
                `
                break
            
            case 'unpaid':
                result += `
                <div class="flex flex-col w-full items-center gap-2 mt-12">
                    <p>ВСЕГО НЕ ОПЛАЧЕННЫХ СЧЕТОВ</p>
                    <span class="flex text-2xl gap-3"><img src="./img/money_tower.svg">${json["total_count"]}</span>
                </div>

                <div class="flex flex-col w-full items-center gap-2 mt-12">
                    <p>ОБЩАЯ СУММА НЕ ОПЛАЧЕННЫХ СЧЕТОВ</p>
                    <span class="flex text-2xl gap-3"><img src="./img/money_tower.svg">${toLocalString(json["total_sum"])}</span>
                </div>
                `
                break
        }
        return result
    }

    let html_str = `
    <div class="flex w-full h-full justify-around">
        <div class="w-[40%] h-full overflow-auto scrolling">
            <div class="flex w-full justify-between">
                <p class="flex gap-1"><img class="rotate-180" src="./img/arrow_up.svg">${name1}</p>
                <p>СУММА</p>
            </div>

            <!-- строка -->
            ${makeRows1(json["by_contractors"])}
            <!--  -->

        </div>

        <div class="flex flex-col w-[40%] h-full">
            <div class="flex flex-col">
                <div class="flex flex-col w-full text-center">
                    <p>${name2}</p>
                    <p class="text-xs">${name3}</p>
                </div>

                <div id="pie_div"></div>
            </div>

            ${additionalInfo()}

        </div>
    </div>
    `
    analitics_content.innerHTML = html_str

    analitics_content.querySelectorAll(".main_row").forEach(item =>{
        item.addEventListener("click", () => {
            let parent_element = item.parentElement
            let dropdown_div = parent_element.querySelector(".dropdown_div")
            
            dropdown_div.classList.toggle("hidden")
            dropdown_div.classList.toggle("flex")
           
            parent_element.style.height = dropdown_div.classList.contains("flex") ? `${dropdown_div.clientHeight + 34}px` : `24px`
        })
    })


    switch(type) {
        case 'income':
            for (let i=0; i<json["by_types"].length; i++) {
                json["by_types"][i]["color"] = `rgb(${randomInteger(90, 115)}, ${randomInteger(100, 120)}, ${randomInteger(110, 130)})`
            }
            break

        case 'expenses':
            for (let i=0; i<json["by_types"].length; i++) {
                json["by_types"][i]["color"] = `rgb(${randomInteger(125, 135)}, ${randomInteger(140, 170)}, ${randomInteger(125, 137)})`
            }
            break
        
        case 'unpaid':
            for (let i=0; i<json["by_types"].length; i++) {
                json["by_types"][i]["color"] = `rgb(${randomInteger(150, 180)}, ${randomInteger(130, 135)}, ${randomInteger(130, 135)})`
            }
            break
    }

    drawPieCharts({"div_id": "pie_div", "data": makePieData(json["by_types"])})
}