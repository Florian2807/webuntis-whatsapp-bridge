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

// QR Code anzeigen
client.on('qr', qr => {
	console.log('QR Code empfangen, bitte mit WhatsApp scannen:');
	qrcode.generate(qr, { small: true });
});

// Verbindungsstatus Events
client.on('ready', () => {
	console.log('WhatsApp Client ist bereit!');
});

client.on('authenticated', () => {
	console.log('WhatsApp authentifiziert');
});

client.on('auth_failure', msg => {
	console.error('WhatsApp Authentifizierung fehlgeschlagen:', msg);
});

client.on('disconnected', reason => {
	console.log('WhatsApp Client getrennt:', reason);
});

// Nachrichten verarbeiten
client.on('message', async msg => {
	if (process.env.NODE_ENV === 'development' && !process.env.whatsapp_admins.includes(msg.author ?? msg.from)) return;

	try {
		await handleCommand(msg);
		await handleModule(msg);
	} catch (error) {
		console.error('Fehler bei der Nachrichtenverarbeitung:', error);
	}
});

// Sichere Funktion zum Senden von Antworten
async function safeReply(msg, text) {
	try {
		// Prüfen ob text gültig ist
		if (!text || typeof text !== 'string' || text.trim() === '') {
			console.warn('Versuch, leere oder ungültige Nachricht zu senden:', text);
			text = 'Entschuldigung, es gab ein Problem bei der Antwort.';
		}

		// Sicherstellen, dass die Nachricht nicht zu lang ist
		if (text.length > 4096) {
			text = text.substring(0, 4093) + '...';
		}

		await msg.reply(text);
	} catch (error) {
		console.error('Fehler beim Senden der Antwort:', error);
		// Fallback: Versuche eine einfache Fehlermeldung zu senden
		try {
			await msg.reply('Ein Fehler ist aufgetreten.');
		} catch (fallbackError) {
			console.error('Auch Fallback-Nachricht konnte nicht gesendet werden:', fallbackError);
		}
	}
}

// Globale sichere Reply-Funktion verfügbar machen
global.safeReply = safeReply;

async function handleCommand(msg) {
	try {
		const message = msg.body?.toLowerCase().split(' ')[0];

		if (!message.startsWith('!')) return;

		// Überprüfen ob wb.Commands verfügbar ist
		if (!wb.Commands) {
			console.error('wb.Commands ist nicht verfügbar');
			return;
		}

		let command;
		Array.from(wb.Commands.values()).some(cmd => {
			const triggers = cmd['triggers'];
			if (triggers.includes(message.replace('!', ''))) {
				command = cmd;
				return true;
			} else return false;
		});

		if (!command) {
			const unknownMsg = wb.Lang && wb.Lang.handle ? wb.Lang.handle(__filename, 'unknown_command') : 'Unbekannter Befehl';
			return await safeReply(msg, unknownMsg);
		}

		const args = msg.body?.split(' ');
		const checkPermOutput = await checkPermission({ fromUser: msg.from, command });
		if (checkPermOutput === null) {
			return;
		}
		if (!checkPermOutput) {
			const noPermMsg =
				wb.Lang && wb.Lang.handle ? wb.Lang.handle(__filename, 'no_command_permission') : 'Keine Berechtigung für diesen Befehl';
			return await safeReply(msg, noPermMsg);
		}

		try {
			const reply = await command.callback({ msg, args });
			if (reply && typeof reply === 'string') {
				await safeReply(msg, reply);
			}
		} catch (commandError) {
			console.error('Fehler beim Ausführen des Commands:', command.commandName, commandError);
			await safeReply(msg, 'Es ist ein Fehler beim Verarbeiten des Befehls aufgetreten.');
		}
	} catch (e) {
		console.error('Fehler in handleCommand:', e);
	}
}

async function handleModule(msg) {
	try {
		const args = msg.body?.split(' ');

		// Überprüfen ob wb.Modules verfügbar ist
		if (!wb.Modules) {
			console.error('wb.Modules ist nicht verfügbar');
			return;
		}

		Array.from(wb.Modules.values()).some(module => {
			try {
				const check = {
					user: module.user.includes(msg.from) || !module.user.length,
					inGroups: !module.inGroups && !msg.id.remote.includes('@g.us'),
					excludedUser: !module.excludedUser.includes(msg.from),
				};
				if (Object.values(check).every(i => i)) {
					return module.callback({ msg, args });
				}
			} catch (error) {
				console.error('Fehler beim Verarbeiten des Moduls:', module.moduleName, error);
			}
		});
	} catch (e) {
		console.error('Fehler in handleModule:', e);
	}
}

async function checkPermission({ fromUser, command }) {
	try {
		if (!wb.config || !wb.config.classes) {
			console.error('wb.config oder wb.config.classes ist nicht verfügbar');
			return false;
		}

		const allGroups = await (await wb.Whatsapp.getChats()).filter(chat => chat.id.server === 'g.us');
		const acceptedGroups = wb.config.classes.filter(c => c.hasCommandPermission).map(c => c.whatsapp_groupID);
		const allGroupParticipants = [];

		allGroups
			.filter(i => acceptedGroups.includes(i.id._serialized))
			.forEach(group => {
				allGroupParticipants.push(...group.participants.filter(i => i.id.server === 'c.us').map(participant => participant.id._serialized));
			});

		const hasCommandPermission = allGroupParticipants.includes(fromUser);
		if (!hasCommandPermission) {
			return null;
		}
		return !(command.onlyPermittedUser && !hasCommandPermission); // true => has permission
	} catch (error) {
		console.error('Fehler bei der Berechtigungsprüfung:', error);
		return false;
	}
}

module.exports = client;
