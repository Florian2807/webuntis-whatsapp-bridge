const got = require('got')
const fs = require('fs')

module.exports = {
    commandName: 'eval',
    triggers: ['eval'],
    needTeacherAccess: false,
    callback: async ({ msg, args, defaultArgs }) => {
        if (msg.from !== process.env.whatsapp_admin_userID) return
        try {
        const message = defaultArgs
            .splice(1, 1)
            .join(' ')
        let result = await eval(`(async () => {${message}})()`)
        if (typeof result !== 'undefined') {
            return String(result)
        } else {
            return null
        }
        } catch (e) {
            return `Error: ${e}`
        }
    },
}