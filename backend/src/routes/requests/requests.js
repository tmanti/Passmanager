const login = require("./loginreq");
const register = require("./registerreq");
const pass = require("./passreq");
const putpass = require("./putpassreq")

module.exports = {
    login: login,
    register: register,
    pass: pass,
    putpass:putpass
}