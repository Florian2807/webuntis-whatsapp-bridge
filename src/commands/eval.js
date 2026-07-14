const got = require('got');
const fs = require('fs');

const whatsappAdmins = parseWhatsappAdmins();

module.exports = {
	commandName: 'eval',
	triggers: ['eval'],
	needTeacherAccess: false,
	onlyPermittedUser: true,
	callback: async ({ msg, args }) => {
		if (!whatsappAdmins.includes(msg.author ?? msg.from)) return;
		try {
			args.shift();
			const message = args.join(' ');
			let result = await eval(`(async () => {${message}})()`);
			if (typeof result !== 'undefined') {
				return String(result);
			} else {
				return null;
			}
		} catch (e) {
			return `Error: ${e}`;
		}
	},
};

function parseWhatsappAdmins() {
	const rawAdmins = process.env.whatsapp_admins?.trim();
	if (!rawAdmins) {
		return [];
	}

	try {
		const parsedAdmins = JSON.parse(rawAdmins);
		return Array.isArray(parsedAdmins) ? parsedAdmins : [String(parsedAdmins)];
	} catch {
		return rawAdmins
			.replace(/^\[/, '')
			.replace(/\]$/, '')
			.split(',')
			.map(admin => admin.trim().replace(/^['\"]|['\"]$/g, ''))
			.filter(Boolean);
	}
}
