const fs = require('fs');

module.exports = async (checkingUser) => {
    const authorizedUsers = JSON.parse(process.env.whatsapp_admins);
    for (const c of wb.config.classes) {
        if (c.whatsapp_groupID.includes("@g.us")) {
            authorizedUsers.push(...(await wb.Whatsapp.getGroupMembers(c.whatsapp_groupID)).map(m => m.id));
        } else {
            authorizedUsers.push(c.whatsapp_groupID);
        }
    }
    console.log(authorizedUsers)
    return authorizedUsers.includes(checkingUser);
};
