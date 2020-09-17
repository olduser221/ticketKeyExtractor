const fetch = require('node-fetch')
const aesjs = require('aes-js')
const crypto = require('crypto')

module.exports = class Extractor {

    constructor() {
        this.resp
        this.code
        this.hash
        this.statements
        this.Ke = [ [], [] ]
    }

    async init() {
        this.resp = await fetch('https://www.supremenewyork.com/ticket.js')
        this.code = await this.resp.text()
        this.statements = this.code.split('case')
        this.hash = crypto.createHash("sha256").update(this.code).digest("hex")
    }

    convertKeArrayToKey(expansionArray) {
        function convertFrom32(int32) {
            let out = []
            for (let i = 0; i < int32.length; i++) {
                let int = int32[i]
                out.push((256 + (int >> 24)) % 256)
                out.push((256 + (int << 8 >> 24)) % 256)
                out.push((256 + (int << 16 >> 24)) % 256)
                out.push((256 + (int << 24 >> 24)) % 256)
            }
            return out
        }
    
        let key32 = []
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < expansionArray[i].length; j++) {
                key32.push(expansionArray[i][j])
            }
        }
    
        let newKey = convertFrom32(key32)
    
        return newKey
    }

    async findExpansionOne() {
        for (var i in this.statements) {

            if (this.statements[i].includes('new Array') && this.statements[i].includes('^=')) {
        
                let encCase = "case" + this.statements[i]
                let encCaseSplit = encCase.match(/(?<=\]=)(.*?)(?=\^)/g)
                let valueArray = encCase.match(/(?<=\:\()(.*?)(?=\^=)/g)[0].split('[')[0]
                let array = []

                // this.code = this.code.replace(`case${encCase.match(/(?<=case)(.*?)(?=\:)/g)}:`, `case${encCase.match(/(?<=case)(.*?)(?=\:)/g)}:console.log(${valueArray});Deno.exit();`)
    
                for (var x = 0; x < 4; x++) {
                    encCaseSplit[x] = encCaseSplit[x].trim()
                    if (encCaseSplit[x].includes('(')) {
                        array.push(encCaseSplit[x].split(' ')[0] + ")")
                    } else if (encCaseSplit[x].includes('.')) {
                        array.push(encCaseSplit[x].split(' ')[0])
                    } else {
                        array.push(encCaseSplit[x].replace(' ', ''))
                    }
                }
    
                for (var v in array) {
                    const id = array[v].replace(/[+,-/,(,)]/g, '').replace(' ', '')
                    const matcher = new RegExp(`(?<=${id + '='})(.*?)(?=;)`, 'g')
                    const matches = this.code.match(matcher)
                    for (var i = matches.length - 1; i >= 0; i--) {
                        if (typeof matches[i] === 'string') {
                            if (matches[i] !== '""') {
                                this.Ke[0][v] = eval(array[v].replace(id, matches[i]))
                                break;
                            }
                        } else {
                            if (matches[i] !== 0) {
                                this.Ke[0][v] = eval(array[v].replace(id, matches[i]))
                                break;
                            }
                        }
                    }
                }
    
                break;
    
            }
            
        }
    }

    async findExpansionTwo() {
        for (var i in this.statements) {

            if (this.statements[i].includes(']] ^')) {
        
                let encCase = "case" + this.statements[i]
                let encCaseSplit = encCase.match(/(?<=\]\] \^)(.*?)(?=,)/g)
                let array = []
                
                for (var v = 0; v < 4; v++) {
                    encCaseSplit[v] = encCaseSplit[v].trim()
                    if (encCaseSplit[v].includes('(')) {
                        array.push(encCaseSplit[v].split(' ')[0] + ")")
                    } else if (encCaseSplit[v].includes('.')) {
                        array.push(encCaseSplit[v].split(' ')[0])
                    } else {
                        array.push(encCaseSplit[v].replace(' ', ''))
                    }
                }
    
                for (var v in array) {
                    const id = array[v].replace(/[+,-/,(,)]/g, '').replace(' ', '')
                    const matcher = new RegExp(`(?<=${id + '='})(.*?)(?=;)`, 'g')
                    const matches = this.code.match(matcher)
                    for (var i = matches.length - 1; i >= 0; i--) {
                        if (typeof matches[i] === 'string') {
                            if (matches[i] !== '""') {
                                this.Ke[1][v] = eval(array[v].replace(id, matches[i]))
                                break;
                            }
                        } else {
                            if (matches[i] !== 0) {
                                this.Ke[1][v] = eval(array[v].replace(id, matches[i]))
                                break;
                            }
                        }
                    }
                }
    
                break;
    
            } 

        }
    }

    async extractKey() {
        await this.init();
        await this.findExpansionOne();
        await this.findExpansionTwo();

        for (var r in this.Ke) {
            for (var c in this.Ke[r]) {
                this.Ke[r][c] = parseInt(this.Ke[r][c])
            }
        }

        const key = this.convertKeArrayToKey(this.Ke)

        return ({
            "hash": this.hash,
            "roundKey": this.Ke,
            "bytes": key,
            "key": aesjs.utils.hex.fromBytes(key)
        })
    }

}