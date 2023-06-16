// отрисовка конкретной строки
function drawRows(row_list) {
    function convertDateTimeFormat(dateTimeString) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('-').reverse();
        const formattedDate = `${day}.${month}.${year}`;
        const formattedTime = timePart;
        return `${formattedDate} ${formattedTime}`;
    }

    row_list.forEach(row => {
        let tr = document.createElement('tr')
        tr.className = 'bg-white border-b'
        tr.innerHTML = `
        <td class="px-9 py-2">${convertDateTimeFormat(row["created"])}</td>
        <td class="px-9 py-2">${row["fio"]}</td>
        <td class="px-9 py-2">${row["section"]}</td>
        <td class="px-9 py-2">${row["changes"]}</td>
        `
        main_table_scroll.appendChild(tr)
    })
}

// отрисовка всех строк
async function showAllRows(filter = null, page = 1, query_token = null) {
    addLoading()
    await queryAPI_GET(`logs?page=${page}&query_token=${query_token ? query_token : ""}${filter ? "&" + filter : ""}`).then(res => {
        if (res.ok) {
            window.query_token = res.headers.get("query_token")
            window.filter = filter
            window.page_counts = Number(res.headers.get("page_counts"))

            res.json().then(json => {
                main_table_scroll.innerHTML = ''
                if (json.length) {
                    makePagination(window.page_counts, page)
                    // отобразить кол-во записей
                    drawRows(json)
                } else {
                    errorWin("Записи не найдены")
                }
            })

        } else {
            // Сообщение об ошибке
            console.log(res.status);
            res.json().then(json => {
                errorWin(json["message"]);
            })
        }
    }).finally(() => { removeLoading() })
}

// получить выпадающие списки
async function getFilters() {
    await queryAPI_GET(`log/filters`).then(res => {
        if (res.ok) {
            res.json().then(json => {
                json["login"].forEach(item => {
                    let li = document.createElement("li")
                    li.setAttribute("value", item["login"])
                    li.innerHTML = item["fio"]
                    login_filter_datalist.appendChild(li)
                })
                json["section"].forEach(item => {
                    let li = document.createElement("li")
                    li.setAttribute("value", item)
                    li.innerHTML = item
                    section_filter_datalist.appendChild(li)
                })
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

// создание строки запроса на фильтрацию
function makeQueryForSearch() {
    let query_dict = {
        "changes": changes_filter.value || null,
        "section": section_filter.getAttribute("id_") || null,
        "login": login_filter.getAttribute("id_") || null,
        "start_date": logs_filter.querySelectorAll(".start_date_filter")[0].value ? `${logs_filter.querySelectorAll(".start_date_filter")[0].value} ${logs_filter.querySelectorAll(".start_date_filter")[1].value}`.trim() : null,
        "end_date": logs_filter.querySelectorAll(".end_date_filter")[0].value ? `${logs_filter.querySelectorAll(".end_date_filter")[0].value} ${logs_filter.querySelectorAll(".end_date_filter")[1].value}`.trim() : null
    }
    let query_list = []
    Object.keys(query_dict).forEach(key => {
        if (query_dict[key]) {
            query_list.push(`${key}=${query_dict[key]}`)
        }
    })
    return query_list.join("&")
}

// применить фильтр
apply_filter.addEventListener("click", () => {
    showAllRows(makeQueryForSearch())
})

// сброс фильтра
reset_filter.addEventListener("click", () => {
    showAllRows()
    logs_filter.querySelectorAll("input").forEach(input => {
        input.value = ''
    })
})

function settingsLogs() {
    eventsOnSearchSelects()
    showAllRows()
    getFilters()
}