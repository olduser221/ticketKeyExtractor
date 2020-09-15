const aesjs = require('aes-js')
const crypto = require('crypto')

const key = [ 74,  29,  64,  9, 207,  37, 195, 146, 91, 203, 120, 30, 142, 211, 254,  76, 21, 176, 209, 84, 169,  47, 105,   5, 13, 215,  68, 74, 100,  68,  46, 219 ]
const values = [ 172, 253,  96,  42, 207,  95, 113, 239,  82, 166, 36,   0,   9, 143,  50, 184 ]
const padding = [ 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16 ]

function createCookie() {
    let cookieArray = []
    let iv = new Uint8Array(16)
    crypto.randomFillSync(iv)

    let aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    let encryptedValues = aesCbc.encrypt(values);

    for (let i in encryptedValues) {
      cookieArray.push(encryptedValues[i])
    }

    aesCbc = new aesjs.ModeOfOperation.cbc(key, encryptedValues);
    let encryptedPad = aesCbc.encrypt(padding);

    for (let i in encryptedPad) {
      cookieArray.push(encryptedPad[i])
    }

    for (let i in iv) {
      cookieArray.push(iv[i])
    }

    // console.log(aesjs.utils.hex.fromBytes(cookieArray))
    return aesjs.utils.hex.fromBytes(cookieArray)
}

for (let i = 0; i < process.argv[2]; i++) {
    createCookie()
}