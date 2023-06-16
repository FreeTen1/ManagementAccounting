// наведение на символ рубля в шапке
document.querySelector("#rub_img").addEventListener("mouseover", () => {
    document.querySelector("#dropdown_info_header").classList.toggle("flex")
    document.querySelector("#dropdown_info_header").classList.toggle("hidden")
})
dropdown_info_header.addEventListener("mouseleave", e => {
    document.querySelector("#dropdown_info_header").classList.toggle("flex")
    document.querySelector("#dropdown_info_header").classList.toggle("hidden")
})
// Заполнение информации в "рубль"
function fillAccount() {
    queryAPI_GET("account").then(res => {
        if (res.ok) {
            res.json().then(json => {
                fact.innerHTML = toLocalString(json["fact"])
                plan.innerHTML = toLocalString(json["plan"])
                let curr_date = new Date()
                rub_date.innerHTML = '12.10.2022'
                rub_date.innerHTML = `${curr_date.getDate()}.${curr_date.getMonth() + 1}.${curr_date.getFullYear()}`
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
fillAccount()


// кнопка выйти
fio.addEventListener("mouseover", () => {
    document.querySelector("#log_out_btn_div").classList.toggle("flex")
    document.querySelector("#log_out_btn_div").classList.toggle("hidden")
})
log_out_btn_div.addEventListener("mouseleave", e => {
    document.querySelector("#log_out_btn_div").classList.toggle("flex")
    document.querySelector("#log_out_btn_div").classList.toggle("hidden")
})
log_out_btn.addEventListener("click", () => {
    location.href = 'log_out.php'
})