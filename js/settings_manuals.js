// вывод всех значений
async function settingsManuals(update_elem=null) {
    addLoading()
    await queryAPI_GET("admin").then(res => {
        if (res.ok) {
            res.json().then(json => {
                // заполняем в window переменную для выпадающего списка
                window.contractors_list = json["contractors"] 
                window.contract_type_income_list = []
                window.contract_type_consumption_list = []

                document.querySelectorAll(".row_event").forEach(item => {item.remove()})
                json["contractors"].forEach(item => {
                    if (item["is_active"]) {
                        let new_row = document.createElement("div")
                        new_row.className = "row_manuals row_event"
                        new_row.setAttribute("id_row", item["id"])
                        new_row.innerHTML = `
                        <p>${item["name"]}</p>
                        <div class="flex gap-4 items-center justify-end w-[200px]">
                            <input class="choose_color_div" value="${item["color_hex"]}" disabled>
                            <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer edit" src="./img/edit.svg" title="Отредактировать"></div>
                            <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer w-[24px] h-[24px] delete" src="./img/close_sad.svg" title="Удалить"></div>
                        </div>
                        `
                        contractors.appendChild(new_row)
                    }
                })

                json["contract_type"].forEach(item => {
                    if (item["is_active"]) {
                        let new_row = document.createElement("div")
                        new_row.className = "row_manuals row_event"
                        new_row.setAttribute("id_row", item["id"])
                        new_row.innerHTML = `
                        <p>${item["name"]}</p>
                        <div class="flex gap-4 items-center justify-end w-[200px]">
                            <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer edit" src="./img/edit.svg" title="Отредактировать"></div>
                            <div class="flex justify-center items-center w-[24px] h-[24px]"><img class="cursor-pointer w-[24px] h-[24px] delete" src="./img/close_sad.svg" title="Удалить"></div>
                        </div>
                        `
                        if (item["it_is"].toUpperCase() == "ДОХОД") {
                            type_income.appendChild(new_row)
                            window.contract_type_income_list.push(item)
                        } else {
                            type_consumption.appendChild(new_row)
                            window.contract_type_consumption_list.push(item)
                        }
                    }
                })
                contractors.parentElement.querySelector("span").innerHTML = json["contractors"].length
                type_income.parentElement.querySelector("span").innerHTML = window.contract_type_income_list.length
                type_consumption.parentElement.querySelector("span").innerHTML = window.contract_type_consumption_list.length
                
                applyColor("choose_color_div")
                updateEvents()
                update_elem ? updateHeight(update_elem) : ''
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


// Для определения цвета
function applyColor(class_name) {
    let colors = jsColorPicker(`input.${class_name}`, {
        customBG: '#222',
        readOnly: true,
        // patch: false,
        init: function(elm, colors) { // colors is a different instance (not connected to colorPicker)
            elm.style.backgroundColor = elm.value;
            elm.style.color = colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd';
        },
    });
}
applyColor("choose_color_div")


function updateHeight(div) {
    if (Number(div.style.height.replace("px", '')) < div.scrollHeight) {
        div.style.height = `${div.scrollHeight}px`
    } else {
        div.style.height = `auto`
        div.style.height = `${div.scrollHeight}px`
    }
}


// обновить event's на строки
function updateEvents() {
    document.querySelectorAll(".row_event").forEach(item => {
        let id_row = Number(item.getAttribute("id_row"))

        let curr_p = item.querySelector("p")
        let curr_color = item.querySelector(".choose_color_div") || null
        let curr_color_value = curr_color ? curr_color.value : ""

        let cur_edit_img = item.querySelector(".edit")
        let cur_delete_img = item.querySelector(".delete")
        // нажатие на значок редактирования
        cur_edit_img.addEventListener("click", () => {
            // заменить картинки
            addNewImg = (img_name, title, parent) => {
                let new_img = document.createElement("img")
                new_img.src = `./img/${img_name}`
                new_img.title = title
                new_img.style.cursor = 'pointer'
                parent.innerHTML = ''
                parent.appendChild(new_img)
                return new_img
            }

            let edit_div = item.querySelector(".edit").parentElement
            let delete_div = item.querySelector(".edit").parentElement.parentElement.querySelector(".delete").parentElement
            
            // Сохранить изменения
            let accept_img = addNewImg('diskette.svg', 'Сохранить изменения', edit_div)
            accept_img.addEventListener("click", () => {
                if (checkImportantFields(item)) {
                    let new_name = new_input.value
                    smoke.confirm(`Вы действительно хотите поменять "${curr_p.textContent}" на "${new_name}"`, result => {
                        if (result) {
                            let new_color = curr_color ? curr_color.value : null
                            queryAPI_PUT({"name": new_name, "color_hex": new_color}, new_color ? `admin/contractor/${id_row}` : `admin/ctype/${id_row}`).then(res => {
                                if (res.ok) {
                                    successfullyWin("Строка обновилась")
                                    settingsManuals(item.parentElement.parentElement)
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
                }
            })
            // Отменить изменения
            let cancel_img = addNewImg('back.svg', 'Отменить изменения', delete_div)
            cancel_img.addEventListener("click", () => {
                edit_div.innerHTML = ''
                edit_div.appendChild(cur_edit_img)
                delete_div.innerHTML = ''
                delete_div.appendChild(cur_delete_img)

                // превратить input в p
                new_input.after(curr_p)
                new_input.remove()

                // добавить disabled в color picker
                if (curr_color) {
                    curr_color.value = curr_color_value
                    curr_color.disabled = true
                    applyColor("choose_color_div")
                }
            })

            // превратить p в input
            let new_input = document.createElement("input")
            new_input.classList.add("input_text")
            new_input.classList.add("important_field")
            new_input.placeholder = 'Введите новое значение'
            new_input.value = curr_p.textContent
            curr_p.after(new_input)
            curr_p.remove()

            // убрать disabled с color picker
            if (curr_color) {
                curr_color.disabled = false
            }
        })

        // нажатие на значок удаления
        cur_delete_img.addEventListener("click", () => {
            smoke.confirm(`Вы действительно хотите удалить "${curr_p.textContent}"`, result => {
                if (result) {
                    queryAPI_DELETE({}, item.parentElement.id == "contractors" ? `admin/contractor/${id_row}` : `admin/ctype/${id_row}`).then(res => {
                        if (res.ok) {
                            successfullyWin("Удалено")
                            settingsManuals(item.parentElement.parentElement)
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
    })
}

// по клику на документ проверяем все ли элементы открыты или закрыты в зависимости от этого меняем текст скрыть/закрыть
document.addEventListener("click", () => {
    // информация о полях
    let open_info = []
    document.querySelectorAll(".main_manuals_div").forEach(item => {open_info.push(eval(item.getAttribute("open")))})
    if (open_info.every(item => {return item})) {
        show_hide_all.querySelector("span").innerHTML = `Скрыть все`
        show_hide_all.querySelector("img").classList.remove("rotate-180")
    } else {
        show_hide_all.querySelector("span").innerHTML = `Показать все`
        show_hide_all.querySelector("img").classList.add("rotate-180")
    }
})
// показать/скрыть всё
show_hide_all.addEventListener("click", () => {
    // сам label
    show_hide_all.querySelector("img").classList.toggle("rotate-180")
    show_hide_all.querySelector("span").innerHTML = show_hide_all.querySelector("img").classList.contains("rotate-180") ? `Показать все` : `Скрыть все`

    // информация о полях
    let open_info = []
    document.querySelectorAll(".main_manuals_div").forEach(item => {open_info.push(eval(item.getAttribute("open")))})
    
    // если все открыты 
    if (open_info.every(item => {return item})) {
        document.querySelectorAll(".head_manuals").forEach(item => {item.click()})
    } else {
        document.querySelectorAll(".main_manuals_div").forEach(item => {
            !eval(item.getAttribute("open")) ? item.querySelector(".head_manuals").click() : ''
        })
    }
})
// открытие/закрытие конкретного поля
document.querySelectorAll(".head_manuals").forEach(item => {
    item.addEventListener("click", () => {
        let div = item.parentElement
        if (eval(div.getAttribute("open"))) {
            div.style.height = `35px`
            div.setAttribute("open", false)
            item.querySelector("img").classList.toggle("rotate-180")
        } else {
            div.style.height = `${div.scrollHeight}px`
            div.setAttribute("open", true)
            item.querySelector("img").classList.toggle("rotate-180")
        }
    })
})



// добавление строки для создания чего-то нового кнопка "ДОБАВИТЬ НОВЫЙ"
document.querySelectorAll(".add_new_row").forEach(item => {
    item.addEventListener("click", () => {
        let linked_var = {"contractors": window.contractors_list, 
                          "type_income": window.contract_type_income_list, 
                          "type_consumption": window.contract_type_consumption_list}

        let datalist_id = `new_id_${Math.round(Math.random()*1000)}`
        let new_div = document.createElement("div")
        new_div.classList.add("row_manuals")
        new_div.innerHTML = `
        <input type="text" list="${datalist_id}" class="input_text important_field" placeholder="Введите новое значение">
        <datalist id="${datalist_id}">
            ${createOptions(linked_var[item.parentElement.parentElement.id], 'name')}
        </datalist>
        <div class="flex gap-4 items-center justify-end w-[200px]">
            ${eval(item.getAttribute("color")) ?  '<input class="choose_color_div important_field" value="" placeholder="Выберите цвет">' : ''}
            <div class="flex justify-center items-center w-[24px] h-[24px] close"><img class="cursor-pointer" src="./img/cross.svg" title="Закрыть"></div>
            <div class="flex justify-center items-center w-[24px] h-[24px] save"><img class="cursor-pointer" src="./img/diskette.svg" title="Сохранить"></div>
        </div>
        `
        item.parentElement.after(new_div)
        item.style.display = 'none'
        updateHeight(item.parentElement.parentElement.parentElement)
        applyColor("choose_color_div")
        // убрать строку добавления
        new_div.querySelector(".close").addEventListener("click", () => {
            new_div.remove() // удалить сам новый div
            item.removeAttribute("style") // показать снова кнопку добавления
            updateHeight(item.parentElement.parentElement.parentElement) // обновить высоту
        })
        // сохранить новое
        new_div.querySelector(".save").addEventListener("click", () => {
            if (checkImportantFields(new_div)) {
                let name = new_div.querySelector("input[type=text]").value
                smoke.confirm(`Вы действительно хотите добавить "${name}"?`, result => {
                    if (result) {
                        let color_hex = new_div.querySelector(".choose_color_div") ? new_div.querySelector(".choose_color_div").value : null
                        let it_is = item.getAttribute("it_is")
                        queryAPI_POST(color_hex ? {"name": name, "color_hex" : color_hex} : {"name": name, "it_is": it_is}, color_hex ? "admin/contractor" : "admin/ctype").then(res => {
                            if (res.ok) {
                                successfullyWin("Строка добавилась")
                                new_div.querySelector(".close").click()
                                settingsManuals(item.parentElement.parentElement.parentElement)
                            } else {
                                // Сообщение об ошибке
                                console.log(res.status);
                                res.json().then(json => {
                                    errorWin(json["message"]);
                                })
                            }
                        })
                    } else {
                        new_div.querySelector(".close").click()
                    }
                })
            }
        })
    })
})

// заполнение выпадающими списками создание options
function createOptions(list, value_key) {
    let temp_list = []
    list.forEach(item => {
        temp_list.push(`<option>${item[value_key]}</option>`)
    })
    return temp_list.join('')
}
