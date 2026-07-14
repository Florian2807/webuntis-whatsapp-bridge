const fs = require('fs');
module.exports = {
	commandName: 'config',
	triggers: ['config', 'configure'],
	onlyPermittedUser: false,
	needTeacherAccess: false,
	callback: async ({ msg, args }) => {
		const action = args[1]?.toLowerCase();
		if (!action) {
			return wb.Lang.handle(__filename, 'wrong_usage');
		}

		switch (action) {
			case 'set': {
				const whatsapp_group = await msg.getChat();
				const whatsapp_groupID = whatsapp_group.id['_serialized'];
				const class_name = args[2];

				if (!class_name) {
					return wb.Lang.handle(__filename, 'no_class_provided');
				} else {
					const allClasses = await wb.Webuntis.getClasses();
					const foundClass = allClasses.find(i => i.name?.toLowerCase() === class_name?.toLowerCase());
					if (!foundClass) return wb.Lang.handle(__filename, 'class_not_found');
					if (wb.config['classes'].find(c => c.whatsapp_groupID === whatsapp_groupID)) {
						wb.config['classes'] = wb.config['classes'].filter(c => c.whatsapp_groupID !== whatsapp_groupID);
					}
					wb.config['classes'].push({
						class_name,
						classID: foundClass['id'],
						whatsapp_groupID,
						hasCommandPermission: true,
					});
					fs.writeFileSync('config.json', JSON.stringify(wb.config, null, 4));
					const outputData = `\n\n*WhatsApp*: ${whatsapp_groupID}(*${whatsapp_group.name}*) \n*WebUntis*: ${foundClass.id}(*${foundClass.name}*)`;
					return wb.Lang.handle(__filename, 'successful_config_change', {
						outputData,
					});
				}
			}
			case 'check': {
				let output = '';
				const whatsapp_group = await msg.getChat();

				const foundChats = wb.config['classes'].filter(c => c.whatsapp_groupID === whatsapp_group.id['_serialized']);
				foundChats.forEach(c => {
					output = output + `\n*WhatsApp*: ${c.whatsapp_groupID}(*${whatsapp_group.name}*) \n*WebUntis*: ${c.classID}(*${c.class_name}*)\n`;
				});
				if (!output.length) return wb.Lang.handle(__filename, 'no_config_found');
				return wb.Lang.handle(__filename, 'current_config', { output });
			}
			default: {
				return wb.Lang.handle(__filename, 'wrong_usage');
			}
		}
	},
};
