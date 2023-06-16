async function queryAPI_GET(url) {
    let response = await fetch(`/manage_acc/${url}${url.includes("?") ? "&" : "?" }session=${window.session}`, {
        method: "GET",
    })
    return await response
}

async function queryAPI_DELETE(data, url) {
    data["session"] = window.session
    let response = await fetch(`/manage_acc/${url}`, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response
}

async function queryAPI_PUT(data, url) {
    data["session"] = window.session
    let response = await fetch(`/manage_acc/${url}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response
}

async function queryAPI_POST(data, url) {
    data["session"] = window.session
    let response = await fetch(`/manage_acc/${url}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response
}