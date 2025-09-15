global.wb = {};
require('dotenv').config();
wb.config = require('./config.json');

wb.Lang = {};
wb.Lang.dict = require(`./src/language/${process.env['language_model']}`);
wb.Lang.handle = require('./src/language/language-handler.js');

// Erst alle Module und Commands laden
require('./src/index.js')();
wb.api = require('./src/api.js');

// Dann WebUntis verbinden
wb.Webuntis = require('./clients/webuntis.js');
wb.Webuntis.login().then(() => console.log('WebUntis connected!'));

// Zuletzt WhatsApp verbinden (nachdem alle Dependencies geladen sind)
wb.Whatsapp = require('./clients/whatsapp.js');
wb.Whatsapp.initialize()
	.then(() => console.log('WhatsApp connected!'))
	.catch(error => {
		console.error('WhatsApp connection failed:', error);
	});
