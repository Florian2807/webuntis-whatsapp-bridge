module.exports = {
	commandName: 'help',
	triggers: ['hilfe'],
	onlyPermittedUser: true,
	needTeacherAccess: false,
	callback: ({ msg }) => {
		return wb.Lang.handle(__filename, 'output_message', { outputData: wb.config.helpURL });
	},
};
