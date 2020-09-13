const aesjs = require('aes-js')
const crypto = require('crypto')

const key = [ 74,  29,  64,  9, 207,  37, 195, 146, 91, 203, 120, 30, 142, 211, 254,  76, 21, 176, 209, 84, 169,  47, 105,   5, 13, 215,  68, 74, 100,  68,  46, 219 ]
const values = [ 172, 253,  96,  42, 207,  95, 113, 239,  82, 166, 36,   0,   9, 143,  50, 184 ]

function checkCookie(cookie) {

    const aesCbc = new aesjs.ModeOfOperation.cbc(key, aesjs.utils.hex.toBytes(cookie.substring(cookie.length - 32, cookie.length)))
    let encryptedBytes = aesjs.utils.hex.toBytes(cookie)
    let decryptedBytes = aesCbc.decrypt(encryptedBytes)
    
    let valid = true
    for (var i in values) {
        if (values[i] !== decryptedBytes[i]) {
            valid = false
            break;
        }
    }

    console.log(decryptedBytes)

    return valid

}

console.log({
    cookie: process.argv[2],
    valid: checkCookie(process.argv[2])
})