const fs = require('fs');

module.exports = async (checkingUser) => {
    const authorizedUsers = JSON.parse(process.env.whatsapp_admins);
    for (const c of wb.config.classes) {
        if (c.whatsapp_groupID.includes("@g.us")) {
            const groupMembers = (await wb.Whatsapp.getChats()).find(i => i.id._serialized === c.whatsapp_groupID).participants.map(p => p.id._serialized);
            authorizedUsers.push(...groupMembers);
        } else {
            authorizedUsers.push(c.whatsapp_groupID);
        }
    }
    return authorizedUsers.includes(checkingUser);
};