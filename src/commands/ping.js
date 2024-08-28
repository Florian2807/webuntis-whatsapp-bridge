module.exports = {
	commandName: 'ping',
	triggers: ['ping'],
	onlyPermittedUser: false,
	needTeacherAccess: false,
	callback: ({ msg }) => {
		return msg.reply(wb.Lang.handle(__filename, 'pong_message'));
	},
};
