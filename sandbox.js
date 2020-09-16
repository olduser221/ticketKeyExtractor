// ===== Window Objects =====
// window.wasmbinsrc = Deno.args[0];
window.navigator = {userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1"};
window.location = "https://www.supremenewyork.com/mobile/"
window.document = {
    cookies: "",
    get cookie() {
        return this.cookies
    },
    set cookie(value) {
        value = value.replace(" path=/;", " ")
        if (this.cookies.includes(value.split("=")[0])) {
            const x = this.cookies.split(" ")
            for (var c in x) {
                if (x[c].split("=")[0] === value.split("=")[0]) { x[c] = value }
                if (x[c] === "") { x.splice(c, 1) }
            }
            this.cookies = x.join(" ")
        } else {
            this.cookies += value
        }
    }
};

// ===== Code =====
const locations = {
    home: "https://www.supremenewyork.com/mobile/",
    product: "https://www.supremenewyork.com/mobile/#products/",
    checkout: "https://www.supremenewyork.com/mobile/#checkout"
}

setInterval(() => { console.log(window.values) }, 1000);

import "./ticket.js"
