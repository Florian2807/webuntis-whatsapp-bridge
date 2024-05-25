const got = require('got')
const fs = require('fs')

module.exports = {
    commandName: 'eval',
    triggers: ['eval'],
    needTeacherAccess: false,
    callback: async ({ msg, args, defaultArgs }) => {
        if (!process.env.whatsapp_admins.includes(msg.from)) return
        try {
            defaultArgs.shift()
            const message = defaultArgs
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