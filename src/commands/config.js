const fs = require('fs');
module.exports = {
    commandName: 'config',
    triggers: ['config', 'configure'],
    needTeacherAccess: false,
    callback: async ({msg, args, defaultArgs}) => {
        switch (args[1]) {
            case 'set': {
                const whatsapp_group = (await msg.getChat());
                const whatsapp_groupID = whatsapp_group.id['_serialized'];
                const allClasses = await wb.Webuntis.getClasses();
                const class_name = defaultArgs[2];
                const whatsapp_debug_groupID = process.env['DEBUG_WHATSAPP_ID'];
                const foundClass = allClasses.find(i => i.name?.toLowerCase() === class_name?.toLowerCase())
                
                if (!class_name) {
                    return 'Du musst den Namen der Klasse angeben \n > !config <KlassenName> \n\nBei Fragen schreib mich privat an (Nummer ist in der Beschreibung)';
                } else {
                    if (!foundClass) return 'Ich habe keine Klasse mit diesem Namen gefunden! \nHinweis: Achte auf die 0 vor dem Namen (z.B. 09b)';
                    if (wb.config['classes'].find(c => c.whatsapp_groupID === whatsapp_groupID)) {
                        wb.config['classes'] = wb.config['classes'].filter(c => c.whatsapp_groupID !== whatsapp_groupID);
                    }
                    wb.config['classes'].push({class_name, classID: foundClass['id'], whatsapp_groupID, whatsapp_debug_groupID});
                    fs.writeFileSync('config.json', JSON.stringify(wb.config, null, 4));
                    return `Fertig! Konfigurationen: \n\n*WhatsApp*: ${whatsapp_groupID}(*${whatsapp_group.name}*) \n*WebUntis*: ${foundClass.id}(*${foundClass.name}*)`
                }
            }
            case 'check': {
                let output = ''
                const whatsapp_group = (await msg.getChat());
                
                const foundChats = wb.config['classes'].filter(c => c.whatsapp_groupID === whatsapp_group.id['_serialized']);
                foundChats.forEach(c => {
                    output = output + `\n*WhatsApp*: ${c.whatsapp_groupID}(*${whatsapp_group.name}*) \n*WebUntis*: ${c.classID}(*${c.class_name}*)\n`;
                });
                if (!output.length) return 'No configuration found for this chat!';
                return `*Current Configuration*:\n${output}`
            }
            default: {
                return msg.reply('Unbekannter Befehl! \n > !config <set|check>');
            }

        }
    },
}
