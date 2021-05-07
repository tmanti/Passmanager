const express = require("express")
const router = express.Router();
const db = require("../db/db-connect").getDB();
const collection = db.collection("Users");
const ObjectId = require("mongodb").ObjectID
const jwt = require('jsonwebtoken')

const requests = require("./requests/requests");
const api_res = require("../api-utils/api-responses")
const crypto = require("../crypto/crypto-utils")

const jwtSecret = process.env.JWT_SECRET
const jwtExpiry = process.env.JWT_EXPIRY

function create_token(uuid, user_key){
    const token  = jwt.sign({uuid: uuid, key:user_key}, jwtSecret, {
        algorithm: "HS256",
        expiresIn: jwtExpiry
    })
    return token
}

// @route POST api/auth/login
// @desc  logs in user and returns a jwt with user's decrypted key and id
// @access Public
router.post("/login", (req, res)=>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, jwtSecret, (err, user)=>{
            if(err) return api_res.sendErr(req, res, 401)
            req.user = user
            const newtoken = create_token(req.user.uuid, req.user.key)
            api_res.sendData(res, 200, {token:newtoken})
        })
    } else {
        let entry = req.body;
        const { error } = requests.login.validate(entry)
        if(error) return api_res.sendErrData(req, res, 400, error)

        collection.findOne({"username":entry.username}, (err, user)=>{
            if(err) return api_res.sendErrData(req, res, 500, err)
            var { passkey } = crypto.passphrase_to_key(entry.password, user.encryptedKey.salt)
            entry.password = crypto.hash(entry.password)
            if(user.password == entry.password){
                var decryptedKey = crypto.decrypt(passkey, user.encryptedKey.key, user.encryptedKey.iv)
                req.user = {
                    uuid:user._id,
                    key:decryptedKey
                }
                const newtoken = create_token(req.user.uuid, req.user.key)
                api_res.sendData(res, 200, {token:newtoken})
            } else{
                return api_res.sendErr(req, res, 401)
            }
        });
    }
});


// @route POST api/auth/register
// @desc  registers new user and returns a jwt with user's decrypted key and id
// @access Public
router.post("/register", (req, res)=>{
    let entry = req.body;
    const { error } = requests.register.validate(entry)
    if (error) return api_res.sendErrData(req, res, 400, error)
    
    

    var userkey = crypto.genKey().toString('hex')
    var { passkey, salt } = crypto.passphrase_to_key(entry.password, 0)
    entry.password = crypto.hash(entry.password)
    const { iv, encryptedData } = crypto.encrypt(passkey, userkey)
    
    entry.encryptedKey = {
        iv:iv,
        key:encryptedData,
        salt: salt
    }
    
    entry.passes = []

    collection.insertOne(entry, (err, result)=>{
        if(err) api_res.sendErrData(req, res, 500, err)
        else{
            id = result.ops[0]._id

            const token = create_token(id, userkey)

            api_res.sendData(res, 200, {token:token})
        }
    })
});

module.exports = router