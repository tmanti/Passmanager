const express = require("express");
const mongodb = require("./db/db-connect");
require("dotenv").config();

/*const cryptoa = require("crypto");
const crypto = require("./crypto/crypto-utils")
let pass = "apassword"
let key = crypto.passphrase_to_key(pass).toString('hex')
var b=Date.now()
var a = crypto.encrypt(key, "sdfghdfg")
console.log(a)
console.log(crypto.decrypt(key, a.encryptedData, a.iv))
console.log(Date.now()-b)*/

const app = express();

// Bodyparser middleware + other middleware
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use((req, res, next) => {
    console.log(req.method + " " + req.path);
    next();
  });

app.use(express.json());

mongodb.connectToServer((response, err)=>{
    if(err){
        console.log(response);
        console.log(err);
        return;
    }

    console.log(response);

    const pass = require("./routes/pass")
    app.use("/api/pass", pass)

    const port = process.env.PORT || 5000;
    app.listen(port, ()=>{
        console.log(`Server running on port ${port} !`)
    })
});