function parseURL() {
    // функция парсинга GET строки
    url = location.search
    var parts = url.split('?');
        link = parts.length > 1 ? parts.shift() : '';
        gets = parts.join('?').split('&'),
        data = {};
  
    for(var index = 0; index < gets.length; index++) {
      parts = gets[index].split('=');
      assignValue(data, decodeURIComponent(parts.shift()), decodeURIComponent(parts.join('=')));
    }
  
    function assignValue(data, key, value) {
      var parts = key.replace(/\[(.*?)\]/g, '.$1').split(/\./);
      key = parts.shift();
      if (parts.length === 0) {
        data[key] = value;
      } else {
        assignValue(key in data ? data[key] : (data[key] = {}), parts.join('.'), value);
      }
    }
    return data
}

// Регулярное выражение на пропуск регулярного выражения
function only_regex(elem, reg) {
    elem.value = elem.value.match(reg) ? elem.value.match(reg).join('') : ''
}

// Регулярное выражение на исключение регулярного выражения
function not_regex(elem, reg) {
    let letter = elem.value.match(reg) ? elem.value.match(reg)[0] : null
    elem.value = letter ? elem.value.replace(letter, '') : elem.value
}

// перевод суммы в вид "10 000,32"
function toLocalString(num) {
    return num ? num.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) : ''
}

// перевод суммы в вид Number
function toNumber(str) {
    return Number(str.replaceAll(" ", '').replace(",", '.'))
}

function digits_float(target){
    val = target.value.replace(/[^0-9,.]/g, '');
    if (val.indexOf(",") != '-1') {
        val = val.substring(0, val.indexOf(",") + 3);
    } else if (val.indexOf(".") != '-1') {
        val = val.substring(0, val.indexOf(".") + 3);
    }
    val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    target.value = val
}

// поменять дату из 2022-12-28 на 28.12.2022
function changeDate(str_date) {
    return str_date ? str_date.split("-").reverse().join(".") : ''
}

// узнать процент занимаемой строки
function widthPercent(max_value, curr_value) {
    return Math.round((100 * curr_value) /  max_value)
}

// Случайное целое число от min до max
function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

// Вывод месяц год (март 2022)
function repeating_month(date) {
    let months = {1: "январь", 2: "февраль", 3: "март", 4: "апрель", 5: "май", 6: "июнь", 7: "июль", 8: "август", 9: "сентябрь", 10: "октябрь", 11: "ноябрь", 12: "декабрь"}
    return `${months[Number(date.split("-")[1])]} ${date.split("-")[0]}`
}

// Вывод месяц год (март 2022)
function repeating_month_reduction(date) {
    let months = {1: "янв", 2: "фев", 3: "мар", 4: "апр", 5: "май", 6: "июн", 7: "июл", 8: "авг", 9: "сен", 10: "окт", 11: "ноя", 12: "дек"}
    return `${months[Number(date.split("-")[1])]} ${date.split("-")[0]}`
}

// проверка обязательных полей
function checkImportantFields(check_elem) {
    // false - есть незаполненные поля, true - всё заполнено 
    if (!Array.from(check_elem.querySelectorAll(".important_field")).every(item => {return item.value})) {
        check_elem.querySelectorAll(".important_field").forEach(item => {
            if (!item.value) {
                item.style.backgroundColor = '#ac5b5f7d'
                setTimeout(() => {item.removeAttribute("style")}, 500)
            }
        })
        return false
    } else if (Array.from(check_elem.querySelectorAll("input[type=date].important_field")).some(input => {return Number(input.value.split("-")[0]) < 2000 || input.value.split("-")[0].length > 4})) {
        Array.from(check_elem.querySelectorAll("input[type=date].important_field")).forEach(item => {
            if (Number(item.value.split("-")[0]) < 2000 || item.value.split("-")[0].length > 4) {
                item.style.backgroundColor = '#ac5b5f7d'
                setTimeout(() => {item.removeAttribute("style")}, 500)
            }
        })
        return false
    } else {
        return true
    }
}

// events для selects
function eventsOnSearchSelects() {
    document.querySelectorAll(".search_select").forEach(item => {
        // когда input в фокусе
        item.addEventListener("focus", () => {
            let ul = item.parentElement.querySelector(".search_select_datalist")
            ul.style.top = (item.parentElement.clientHeight + 5) + 'px'
            ul.style.display = 'block' // показываем ul
            // item.value = '' // обнуляем наш input
            // item.setAttribute("id_", '') // обнуляем наш input
            // чтобы показать всё что до этого было скрыто, нужен event на ввод
            let inp_ev = new Event("input")
            item.dispatchEvent(inp_ev)
        })
    
        // поиск
        item.addEventListener("input", () => {
            let filter_str = item.value.toUpperCase() // строка в input
            let li_s = item.parentElement.querySelectorAll("li") // все li
            li_s.forEach(li => {
                // ну тут всё понятно
                li.style.display = li.textContent.toUpperCase().includes(filter_str) ? 'flex' : 'none'
            })
        })
    
        // когда убираем фокус с элемента
        item.addEventListener("blur", () => {
            let ul = item.parentElement.querySelector(".search_select_datalist")
            ul.style.display = 'none' // убираем ul
            // делаем список всевозможных значений
            let all_values = []
            ul.querySelectorAll("li").forEach(li => {
                all_values.push(li.textContent)
            })
            // если того что сейчас в input нету в возможных значениях чистим 
            // его и делаем event ввода, чтобы показать все значения
            if (!all_values.includes(item.value)) {
                item.value = ''
                item.setAttribute("id_", '')
                let inp_ev = new Event("input")
                item.dispatchEvent(inp_ev)
            }
        })
    })
    
    // нажатие на li
    document.querySelectorAll(".search_select_datalist").forEach(item => {
        item.addEventListener("mousedown", e => {
            let elem = e.target
            let inp = elem.parentElement.parentElement.querySelector(".search_select")
            if (elem.tagName == "LI") {
                inp.value = elem.textContent
                inp.setAttribute("id_", elem.getAttribute("value"))
            }
        })
    })
}

// создать информационный блок
function createInfoBlock(background_id, item, head, text, indent=40, maxWidth=null) {
    // indent - отступ
    let background = document.querySelector(`#${background_id}`)
    let item_info = item.getBoundingClientRect()
    let info_div = document.createElement("div")
    info_div.className = 'info_report_div scrolling-dark over overflow-y-auto'
    info_div.style = `left: ${item_info["left"] - indent / 2}px; top: ${item_info["top"] - indent / 2}px; width: ${item_info["width"] + indent}px; height: ${item_info["height"] + indent}px;`
    info_div.style.maxWidth = maxWidth ? `${maxWidth + indent}px` : null
    info_div.innerHTML = `
    <h2>${head}</h2>
    <p>${text}</p>
    `
    background.appendChild(info_div)
}