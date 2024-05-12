global.wb = {}
require('dotenv').config()
wb.config = require("./config.json")

wb.Lang = {}
wb.Lang.dict = require(`./src/language/${process.env['language_model']}.json`)
wb.Lang.handle = require('./src/language/language-handler.js') 

wb.Webuntis = require("./clients/webuntis.js")
wb.Webuntis.login().then(() => console.log("WebUntis connected!"))

wb.Whatsapp = require("./clients/whatsapp.js")
wb.Whatsapp.initialize().then(() => console.log("WhatsApp connected!"))

require("./src/index.js")()
wb.api = require("./src/api.js")