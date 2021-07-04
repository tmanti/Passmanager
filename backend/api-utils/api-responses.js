const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET
const jwtExpiry = process.env.JWT_EXPIRY

const api_errors = {
    400:{
        result:"ko",
        error:{
            title:"http_bad_request",
            detail:"bad request for {0}"
        }
    },
    401:{
        result:"ko",
        error:{
            title:"http_unauthorized",
            detail:"unauthorized request for {0}"
        }
    },
    403:{
        result:"ko",
        error:{
            title:"http_forbidden",
            detail:"forbidden request for {0}"
        }
    },
    404:{
        result:"ko",
        error:{
            title:"http_not_found",
            detail:"resource not found for {0}"
        }
    },
    500:{
        result:"ko",
        error:{
            title:"http_internal_error",
            detail:"Internal server error occured for {0}"
        }
    }
}

const authenticateJWT = (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    if(!authHeader) return sendErr(req, res, 401)
    else{
        var a = authHeader.split(' ');

        var token;

        if(a.length == 2){
            token = a[1];
        } else {
            token = authHeader;
        }

        if(token){
            jwt.verify(token, jwtSecret, (err, user)=>{
                if(err) return sendErr(req, res, 403)
                req.user = user
                next();
            })
        } else {
            return sendErr(req, res, 401)
        }
    }
}

function sendErr(req, res, code){
    var resp = api_errors[code]
    resp.error.detail = resp.error.detail.replace("{0}", req.method + " " + req.originalUrl)
    res.status(code).json(resp)
}

function sendErrData(req, res, code, data){
    var resp = api_errors[code]
    resp.error.detail = resp.error.detail.replace("{0}", req.method + " " + req.originalUrl)
    resp.error.data = data
    res.status(code).json(resp)
}

function sendData(res, code, data){
    data.result = "ok"
    res.status(code).json(data)
}

function send(res, code){
    var resp = {
        result:"ok",
    }
    res.status(code).json(resp)
}

module.exports = {
    authenticateJWT:authenticateJWT,
    sendErrData: sendErrData,
    sendErr: sendErr,
    sendData: sendData,
    send: send,
}