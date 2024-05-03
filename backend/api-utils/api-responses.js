const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET
const jwtExpiry = process.env.JWT_EXPIRY

const api_errors = {
    400:{ default:{
            result:"ko",
            error:{
                title:"http_bad_request",
                detail:"bad request for {0}"
            }
        }
    },
    401:{
        default:{
            result:"ko",
            error:{
                title:"http_unauthorized",
                detail:"unauthorized request for {0}"
            }
        },
        token_expired:{
            result:"ko",
            error:{
                title:"invalid_token",
                detail:"the access token expired"
            }
        }
    },
    403:{default:{
            result:"ko",
            error:{
                title:"http_forbidden",
                detail:"forbidden request for {0}"
            }
        }
    },
    404:{default:{
            result:"ko",
            error:{
                title:"http_not_found",
                detail:"resource not found for {0}"
            }
        }
    },
    500:{default:{
            result:"ko",
            error:{
                title:"http_internal_error",
                detail:"Internal server error occured for {0}"
            }
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
                if(err){
                    sendErr(req, res, 401, "token_expired")
                    return
                } 
                req.user = user
                next();
            })
        } else {
            return sendErr(req, res, 401)
        }
    }
}

function sendErr(req, res, code, description){
    var err_variant = description || "default"
    var resp = api_errors[code][err_variant]
    console.log(code)
    resp.status = code
    resp.error.detail = resp.error.detail.replace("{0}", req.method + " " + req.originalUrl)
    res.status(code).json(resp)
}

function sendErrData(req, res, code, data, description){
    let err_variant = description || "default"
    let resp = api_errors[code][err_variant]
    resp.error.detail = resp.error.detail.replace("{0}", req.method + " " + req.originalUrl)
    resp.error.data = data
    resp.status = code
    res.status(code).json(resp)
}

function sendData(res, code, data){
    data.result = "ok"
    data.status = code
    res.status(code).json(data)
}

function send(res, code){
    var resp = {
        result:"ok",
    }
    resp.status = code
    res.status(code).json(resp)
}

module.exports = {
    authenticateJWT:authenticateJWT,
    sendErrData: sendErrData,
    sendErr: sendErr,
    sendData: sendData,
    send: send,
}