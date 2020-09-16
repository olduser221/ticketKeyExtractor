const aesjs = require('aes-js')
const crypto = require('crypto')

module.exports = class Cookies {

    constructor(key) {
        this.key = key
        this.values = [ 172, 253,  96,  42, 207,  95, 113, 239,  82, 166, 36,   0,   9, 143,  50, 184 ]
        this.padding = [ 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16 ]
    }

    genIV() {
        return crypto.randomFillSync(new Uint8Array(16))
    }

    encrypt(bytes, iv) {
        const aesCbc = new aesjs.ModeOfOperation.cbc(this.key, iv)
        return aesCbc.encrypt(bytes)
    }

    gen() {
        const iv = this.genIV()
        let cookie = []

        const encryptedValues = this.encrypt(this.values, iv)
        for (var i in encryptedValues) cookie.push(encryptedValues[i])

        const encryptedPadding = this.encrypt(this.padding, iv)
        for (var i in encryptedPadding) cookie.push(encryptedPadding[i])

        for (var i in iv) cookie.push(iv[i])

        return aesjs.utils.hex.fromBytes(cookie)
    }

}