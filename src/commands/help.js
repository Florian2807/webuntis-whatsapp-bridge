module.exports = {
	commandName: 'help',
	triggers: ['hilfe'],
	onlyPermittedUser: false,
	needTeacherAccess: false,
	callback: ({ msg }) => {
		return msg.reply(wb.Lang.handle(__filename, 'output_message', { outputData: "https://rentry.co/hv9tw4ht"}));
	},
};
