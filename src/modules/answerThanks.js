module.exports = {
	moduleName: 'answerThanks',
	user: [],
	excludedUser: [],
	inGroups: false,
	description: 'answer to thanks xd',

	callback: async ({ msg }) => {
		if (msg.body?.toLowerCase().includes(wb.Lang.handle(__filename, 'trigger'))) {
			await msg.reply(wb.Lang.handle(__filename, 'reply'));
		}
	},
};
