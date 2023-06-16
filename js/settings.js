document.querySelector("#tabs").querySelectorAll("div").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelector("#tabs").querySelectorAll("div").forEach(item => {
            item.classList.remove("tab-selected")
        })

        document.querySelectorAll(".single_container").forEach(item => {
            item.classList.add("hidden")
        })

        tab.classList.add("tab-selected")
        document.querySelector(`#${tab.getAttribute("label")}`).classList.remove("hidden")
    })
})

// Справочники
manuals.addEventListener("click", () => {
    settingsManuals()
})

// логи
logs.addEventListener("click", () => {
    settingsLogs()
})

manuals.click()