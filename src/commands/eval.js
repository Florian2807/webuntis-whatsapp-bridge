const got = require('got');
const fs = require('fs');

module.exports = {
	commandName: 'eval',
	triggers: ['eval'],
	needTeacherAccess: false,
	onlyPermittedUser: true,
	callback: async ({ msg, args }) => {
		if (!process.env.whatsapp_admins.includes(msg.from)) return;
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
