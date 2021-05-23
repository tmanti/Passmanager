const api_url = "https://pass.tmanti.dev/api";

function postreq(url, token, body, callback){
    request("POST", url, token, body, callback);
}

function delreq(url, token, body, callback){
    request("DELETE", url, token, body, callback);
}

function putreq(url, token, body, callback){
    request("PUT", url, token, body, callback)
}

function request(method, url, token, body, callback){
    fetch(api_url + url, {
        method: method,
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify(body)
    }).then((ret)=> ret.json()).then(callback);
}

function getreq(url, token, callback){
    fetch(api_url + url, {
        method: "GET",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }).then((ret)=> ret.json()).then(callback);
}

export { getreq, postreq, delreq, putreq, request };