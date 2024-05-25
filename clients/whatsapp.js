const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const conf = {
	authStrategy: new LocalAuth({ dataPath: 'data/token' }),
};
if (process.env.chrome_path) {
	conf.puppeteer = {
		product: 'chrome',
		executablePath: process.env.chrome_path,
	};
}

const client = new Client(conf);
client.on('qr', qr => {
	qrcode.generate(qr, { small: true });
});

client.on('message', async msg => {
	if (
		process.env.NODE_ENV === 'development' &&
		!process.env.whatsapp_admins.includes(msg.from)
	)
		return;
	handleCommand(msg);
	handleModule(msg);
});

async function handleCommand(msg) {
	const message = msg.body?.toLowerCase().split(' ')[0];

	if (!message.startsWith('!')) return;

	let command;
	Array.from(wb.Commands.values()).some(cmd => {
		const triggers = cmd['triggers'];
		if (triggers.includes(message.replace('!', ''))) {
			command = cmd;
			return true;
		} else return false;
	});
	if (!command)
		return await msg.reply(wb.Lang.handle(__filename, 'unknown_command'));

	const args = msg.body?.toLowerCase().split(' ');
	const defaultArgs = msg.body?.split(' ');

	try {
		const reply = await command.callback({ msg, args, defaultArgs });
		if (reply) {
			await msg.reply(reply);
		}
	} catch (e) {
		console.error(e);
	}
}

async function handleModule(msg) {
	const args = msg.body?.toLowerCase().split(' ');
	const defaultArgs = msg.body?.split(' ');

	Array.from(wb.Modules.values()).some(module => {
		const check = {
			user: module.user.includes(msg.from) || !module.user.length,
			inGroups: !module.inGroups && !msg.id.remote.includes('@g.us'),
			excludedUser: !module.excludedUser.includes(msg.from),
		};
		if (Object.values(check).every(i => i)) {
			return module.callback({ msg, args, defaultArgs });
		}
	});
}

module.exports = client;
