const term = require( 'terminal-kit' ).terminal
const vorpal = require('vorpal')();

const Extractor = require("./src/Extractor")
const extractor = new Extractor()
const Validate = require("./src/Validate")
const validate = new Validate()
const Cookies = require("./src/Cookies")

term.clear()
term.windowTitle("Ticket Toolbox - By christopher#9999")

vorpal
    .command('extract key', 'Extracts AES key from latest Ticket.js')
    .action(async function(args, callback) {
        this.log(await extractor.extractKey());
});

vorpal
    .command('validate [words...]', 'Checks the values of provided cookie for validity.')
    .action(async function(args, callback) {
        this.log(validate.validate(args.words[0]))
});

vorpal
    .command('generate [words...]', 'Generates a certain number of ticket cookies.')
    .action(async function(args, callback) {
        const key = await extractor.extractKey()
        const cookies = new Cookies(key["bytes"])
        for (let i = 0; i < args.words[0]; i++) {
            this.log(cookies.gen());
        }
});

vorpal
    .command('clear', 'Clears terminal.')
    .action(async function(args, callback) {
        term.clear()
});

vorpal
  .delimiter('ticket~$')
  .show();