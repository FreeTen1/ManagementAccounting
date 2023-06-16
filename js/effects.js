function addLoading() {
    let background = document.createElement("div")
    background.id = "my_loading"
    background.className = "flex w-full h-full absolute items-center justify-center bg-[#ffffff94] top-0 left-0 z-50"
    background.innerHTML = `<div class="loader"></div>`
    document.body.appendChild(background)
}

function removeLoading() {
    document.querySelector("#my_loading") ? document.querySelector("#my_loading").remove() : ''
}

function successfullyWin(mess='Данные успешно сохранены') {
    let win = document.createElement('div');
    win.className = 'flex items-center justify-center absolute top-48 left-[35%] w-[30%] h-[17%] bg-[#E8ECEA] rounded-md z-30'
    win.innerHTML = `<p class="text-center">${mess}</p>`
    win.style.transition = '3s'
    document.body.append(win)

    function sayHi() {
        win.style.opacity = 0;
    }

    function sayHi3() {
        win.remove();
    }
    setTimeout(sayHi, 1000);
    setTimeout(sayHi3, 2000);
}

function errorWin(mess='Ошибка!') {
    let win = document.createElement('div');
    win.className = 'flex items-center justify-center absolute top-48 left-[35%] w-[30%] h-[17%] bg-[#EEE7E7] rounded-md z-30'
    win.innerHTML = `<p class="text-center">${mess}</p>`
    win.style.transition = '3s'
    document.body.append(win)

    function sayHi() {
        win.style.opacity = 0;
    }

    function sayHi3() {
        win.remove();
    }
    setTimeout(sayHi, 1000);
    setTimeout(sayHi3, 2000);
}