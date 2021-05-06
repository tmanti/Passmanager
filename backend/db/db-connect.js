const mongodb = require("mongodb");
require("dotenv").config();
const MongoClient = mongodb.MongoClient;
// eslint-disable-next-line quotes
const uri = process.env.URI
const dbName = process.env.dbName || "passmanager";

var db = null;
var db_export = {
  connectToServer: (callback) => {
    MongoClient.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err)
          return callback(
            "Failed to connect to database server: Error Stack below",
            err.errmsg
          );
        db = client.db(dbName);
        callback("Connected successfully to database server", undefined);
      }
    );
  },
  getDB: () => {
    return db;
  },
};

module.exports = db_export;