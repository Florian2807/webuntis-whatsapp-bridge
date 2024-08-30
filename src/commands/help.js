module.exports = {
	commandName: 'help',
	triggers: ['hilfe'],
	onlyPermittedUser: true,
	needTeacherAccess: false,
	callback: ({ msg }) => {
		return msg.reply(wb.Lang.handle(__filename, 'output_message', { outputData: wb.config.helpURL}));
	},
};
