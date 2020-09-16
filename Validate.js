module.exports = class Validate {

    constructor(cookie) {
        this.cookie = cookie
        this.key = [ 74,  29,  64,  9, 207,  37, 195, 146, 91, 203, 120, 30, 142, 211, 254,  76, 21, 176, 209, 84, 169,  47, 105,   5, 13, 215,  68, 74, 100,  68,  46, 219 ]
        this.values = [ 172, 253,  96,  42, 207,  95, 113, 239,  82, 166, 36,   0,   9, 143,  50, 184 ]
    }

    decrypt(bytes, iv) {
        const aesCbc = new aesjs.ModeOfOperation.cbc(this.key, iv)
        return aesCbc.decrypt(bytes)
    }

    validate() {
        const iv = aesjs.utils.hex.toBytes(this.cookie.substring(this.cookie.length - 32, this.cookie.length))
        const decryptedBytes = decrypt(this.cookie, iv)

        let valid = true
        for (var i in this.values) {
            if (this.values[i] !== decryptedBytes[i]) {
                valid = false
                break;
            }
        }

        return valid
    }

}