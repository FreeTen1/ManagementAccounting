function makePagination(page_count, sel_page=1) {
    let html_str = ``
    // кнопки назад
    html_str += /*html*/`
    <div class="pagination-divs rounded-l" id="full_previous"><img class="w-1/2 h-1/2" src="./img/pagination_arrow_2.svg" alt=""></div>
    <div class="pagination-divs" id="previous"><img class="w-1/2 h-1/2" src="./img/pagination_arrow.svg" alt=""></div>
    `

    // Рисуем кол-во страниц
    if (sel_page <= 3) {
        for (let i = 1; i <= (page_count <= 5 ? page_count : 5); i++) {
            html_str += /*html*/`<div class="pagination-divs pag-numbers ${sel_page == i ? "pagination-divs-selected" : ''}">${i}</div>`
        }
    } else if (sel_page >= page_count - 2) {
        for (let i = (page_count - 4 == 0 ? 1 : page_count - 4); i <= page_count; i++) {
            html_str += /*html*/`<div class="pagination-divs pag-numbers ${sel_page == i ? "pagination-divs-selected" : ''}">${i}</div>`
        }
    } else {
        for (let i = sel_page - 2; i <= sel_page + 2; i++) {
            html_str += /*html*/`<div class="pagination-divs pag-numbers ${sel_page == i ? "pagination-divs-selected" : ''}">${i}</div>`
        }
    }

    // кнопки вперёд
    html_str += /*html*/`
    <div class="pagination-divs" id="next"><img class="w-1/2 h-1/2 rotate-180" src="./img/pagination_arrow.svg" alt=""></div>
    <div class="pagination-divs rounded-r" id="full_next"><img class="w-1/2 h-1/2 rotate-180" src="./img/pagination_arrow_2.svg" alt=""></div>
    `

    main_pagination_div.innerHTML = html_str

    // events
    let selected_num = Number(main_pagination_div.querySelector(".pagination-divs-selected").textContent)
    full_previous.addEventListener("click", () => {
        makePagination(page_count)
        showAllRows(null, 1, window.query_token)
    })
    previous.addEventListener("click", () => {
        if (!(selected_num - 1 < 1)) {
            makePagination(page_count, selected_num - 1)
            showAllRows(null, selected_num - 1, window.query_token)
        }

    })

    next.addEventListener("click", () => {
        if (!(selected_num + 1 > page_count)) {
            makePagination(page_count, selected_num + 1)
            showAllRows(null, selected_num + 1, window.query_token)
        }
    })

    full_next.addEventListener("click", () => {
        makePagination(page_count, page_count)
        showAllRows(null, page_count, window.query_token)
    })

    main_pagination_div.querySelectorAll(".pag-numbers").forEach(element => {
        element.addEventListener("click", () => {
            makePagination(page_count, Number(element.textContent))
            showAllRows(null, Number(element.textContent), window.query_token)
        })
    })
    document.querySelector("#main_table_scroll").scrollTop = 0
}



