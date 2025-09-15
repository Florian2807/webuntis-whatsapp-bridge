module.exports = {
	commandName: 'ping',
	triggers: ['ping'],
	onlyPermittedUser: false,
	needTeacherAccess: false,
	callback: ({ msg }) => {
		return wb.Lang.handle(__filename, 'pong_message');
	},
};
