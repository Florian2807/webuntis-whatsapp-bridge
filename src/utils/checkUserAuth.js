const fs = require('fs');

module.exports = async (checkingUser) => {
    const authorizedUsers = JSON.parse(process.env.whatsapp_admins);
    for (const c of wb.config.classes) {
        if (c.whatsapp_groupID.includes("@g.us")) {
            const group = (await client.getChats()).find(c => c.id === c.whatsapp_groupID);
            console.log(group.participants);
            authorizedUsers.push(...group.participants.filter(i => i.id.server === 'c.us').map(participant => participant.id._serialized));
        } else {
            authorizedUsers.push(c.whatsapp_groupID);
        }
    }
    console.log(authorizedUsers);
    console.log(checkingUser);
    return authorizedUsers.includes(checkingUser);
};
