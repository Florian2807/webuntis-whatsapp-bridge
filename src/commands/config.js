const fs = require('fs');
module.exports = {
	commandName: 'config',
	triggers: ['config', 'configure'],
	needTeacherAccess: false,
	callback: async ({ msg, args, defaultArgs }) => {
		switch (args[1]) {
			case 'set': {
				const whatsapp_group = await msg.getChat();
				const whatsapp_groupID = whatsapp_group.id['_serialized'];
				const allClasses = await wb.Webuntis.getClasses();
				const class_name = defaultArgs[2];
				const whatsapp_debug_groupID = process.env['DEBUG_WHATSAPP_ID'];
				const foundClass = allClasses.find(
					i => i.name?.toLowerCase() === class_name?.toLowerCase()
				);

				if (!class_name) {
					return wb.Lang.handle(__filename, 'no_class_provided');
				} else {
					if (!foundClass)
						return wb.Lang.handle(__filename, 'class_not_found');
					if (
						wb.config['classes'].find(
							c => c.whatsapp_groupID === whatsapp_groupID
						)
					) {
						wb.config['classes'] = wb.config['classes'].filter(
							c => c.whatsapp_groupID !== whatsapp_groupID
						);
					}
					wb.config['classes'].push({
						class_name,
						classID: foundClass['id'],
						whatsapp_groupID,
						whatsapp_debug_groupID,
					});
					fs.writeFileSync(
						'config.json',
						JSON.stringify(wb.config, null, 4)
					);
					const outputData = `\n\n*WhatsApp*: ${whatsapp_groupID}(*${whatsapp_group.name}*) \n*WebUntis*: ${foundClass.id}(*${foundClass.name}*)`;
					return wb.Lang.handle(
						__filename,
						'successful_config_change',
						{
							outputData,
						}
					);
				}
			}
			case 'check': {
				let output = '';
				const whatsapp_group = await msg.getChat();

				const foundChats = wb.config['classes'].filter(
					c => c.whatsapp_groupID === whatsapp_group.id['_serialized']
				);
				foundChats.forEach(c => {
					output =
						output +
						`\n*WhatsApp*: ${c.whatsapp_groupID}(*${whatsapp_group.name}*) \n*WebUntis*: ${c.classID}(*${c.class_name}*)\n`;
				});
				if (!output.length)
					return wb.Lang.handle(__filename, 'no_config_found');
				return wb.Lang.handle(__filename, 'current_config', { output });
			}
			default: {
				return msg.reply(wb.Lang.handle(__filename, 'wrong_usage'));
			}
		}
	},
};
