const express = require("express");
const router = express.Router();
const db = require("../db/db-connect").getDB();
const collection = db.collection("Users");
const ObjectId = require("mongodb").ObjectID

const api_res = require("../api-utils/api-responses");
const requests = require("./requests/requests");
const crypto = require("../crypto/crypto-utils");

// @route GET api/pass
// @desc  get password at id
// @access Authorized
router.get("/", api_res.authenticateJWT, (req, res)=>{
    collection.findOne({_id:ObjectId(req.user.uuid)}, (err, doc)=>{
        if(err) return api_res.sendErr(req, res, 500)
        if(doc){
            var passes = doc.passes
            var resp = {
                results:[]
            }
            for (ind in passes){
                pass = passes[ind]
                resp.results.push({
                    id:pass._id,
                    source:pass.source
                })
            }
            api_res.sendData(res, 200, resp)
        } else {
            api_res.send(res, 204)
        }
    })
});

// @route POST api/pass
// @desc  Create password
// @access Authorized
router.post("/", api_res.authenticateJWT, (req, res)=>{
    let entry = req.body;
    const { error } = requests.pass.validate(entry)
    if(error) return api_res.sendErr(req, res, 400);

    let uuid = ObjectId(req.user.uuid);
    let key = req.user.key;

    const { iv, encryptedData } = crypto.encrypt(key, entry.password)

    var id = new ObjectId();

    var doc = {
        _id: id,
        source: entry.source,
        password: encryptedData,
        iv: iv,
    }

    collection.updateOne({_id:uuid}, {$push:{passes:doc}}, (err, doc)=>{
        if(err) return api_res.sendErr(req, res, 500);
        var resp = {
            id: id,
            source: entry.source
        }
        api_res.sendData(res, 200, resp)
    })
});

// @route GET api/pass/:passID
// @desc  get password at id
// @access Authorized
router.get("/:passID", api_res.authenticateJWT, (req, res)=>{
    let id = ObjectId(req.params["passID"]);
    collection.findOne({_id:ObjectId(req.user.uuid), "passes._id":id}, (err, doc)=>{
        if(err) return api_res.sendErr(req, res, 500)
        if(doc){
            var passes = doc.passes
            var obj;
            var i = 0;
            while(i < passes.length && passes[i]._id.toString() != id.toString()){
                i++
            }
            obj = passes[i];
            if(obj){
                decrypted = crypto.decrypt(req.user.key, obj.password, obj.iv)
                var resp = {
                    source:obj.source,
                    password: decrypted
                }
                api_res.sendData(res, 200, resp)
            } else {
                api_res.sendErr(req, res, 500)
            }
        } else {
            api_res.send(res, 204)
        }
    })
});

// @route PUT api/pass/:passID
// @desc  Update password at id
// @access Authorized
router.put("/:passID", api_res.authenticateJWT, (req, res)=>{
    let entry = req.body;
    const { error } = requests.pass.validate(entry)
    if(error) return api_res.sendErr(req, res, 400);

    let id = ObjectId(req.params["passID"]);
    var set = {}
    if(entry.source){
        set["passes.$.source"] = entry.source
    }

    let uuid = ObjectId(req.user.uuid);
    let key = req.user.key;

    if(entry.password){
        const { iv, encryptedData } = crypto.encrypt(key, entry.password);
        set["passes.$.password"]  = encryptedData;
        set["passes.$.iv"]  = iv
    }

    collection.findOneAndUpdate({_id:uuid, "passes._id":id}, {$set:set}, (err, results)=>{
        if(err) return api_res.sendErr(req, res, 500);
        if(results.value){
           api_res.send(res, 200)
        } else {
            api_res.send(res, 204)
        }
    });
});

// @route DELETE api/pass/:passID
// @desc  Delete password at id
// @access Authorized
router.delete("/:passID", api_res.authenticateJWT, (req, res)=>{
    let id = ObjectId(req.params["passID"]);
    collection.updateOne({_id:ObjectId(req.user.uuid)}, {'$pull':{"passes":{_id:id}}}, {upsert:false, multi:true}, (err, result)=>{
        if(err) return api_res.sendErr(req, res, 500);
        if(result.modifiedCount != 0){
            api_res.send(res, 200)
        } else {
            api_res.send(res, 204)
        }
    })
});

module.exports = router;