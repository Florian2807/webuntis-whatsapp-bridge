global.wb = {}
require('dotenv').config()
wb.config = require("./config.json")

wb.Webuntis = require("./clients/webuntis.js")
wb.Webuntis.login().then(() => console.log("WebUntis connected!"))

wb.Whatsapp = require("./clients/whatsapp.js")
wb.Whatsapp.initialize().then(() => console.log("WhatsApp connected!"))

require("./src/index.js")()
wb.api = require("./src/api.js")