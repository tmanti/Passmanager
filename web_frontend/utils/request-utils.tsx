const api_url = "http://localhost:3001/api";

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
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    if(token){
        headers['Authorization'] = token
    }
    fetch(api_url + url, {
        method: method,
        headers:headers,
        body: JSON.stringify(body)
    }).then((ret)=> ret.json()).then(callback).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
         // ADD THIS THROW error
          throw error;
        });
}

function getreq(url, token, callback){
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    if(token){
        headers['Authorization'] = token
    }
    fetch(api_url + url, {
        method: "GET",
        headers:headers,
    }).then((ret)=> ret.json()).then(callback).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
         // ADD THIS THROW error
          throw error;
        });
}

export { getreq, postreq, delreq, putreq, request };