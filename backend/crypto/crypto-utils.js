const crypto = require("crypto");

var algorithm = "aes-256-cbc";

function passphrase_to_key(passphrase){
    // it is not necessary that this be private, just random on a per-user basis
    var salt = crypto.randomBytes(32);

    // you want this to slow down an attacker, but not yourself or a user
    // if you use mobile devices or hobby hardware, keep it well under 10,000
    // it is not necessary that this be private
    var iterations = 137;
    var keyByteLength = 32; // desired length for an AES key

    var key = crypto.pbkdf2Sync(passphrase, salt, iterations, keyByteLength, 'sha512')
    return key.toString('hex')
}

function encrypt(key, phrase){
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv)
    let encrypted = cipher.update(phrase)
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')
    }
}

function decrypt(key, phrase, textiv){
    let iv = Buffer.from(textiv, 'hex')
    let encryptedText = Buffer.from(phrase, 'hex')
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv)
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function genKey(){
    return crypto.randomBytes(32)
}

module.exports = {
    passphrase_to_key: passphrase_to_key,
    encrypt: encrypt,
    decrypt: decrypt
}