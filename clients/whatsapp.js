const qrcode = require('qrcode-terminal');
const {Client, LocalAuth} = require('whatsapp-web.js');

const clientConfig = process.env.NODE_ENV === "production" ? {
    authStrategy: new LocalAuth({dataPath: 'token'}),
    puppeteer: {product: "chrome", executablePath: "/usr/bin/chromium-browser"}
} : {authStrategy: new LocalAuth({dataPath: 'token'})}


const client = new Client(clientConfig);

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});


client.on('message', async (msg) => {
    if (process.env.NODE_ENV === "development" && !process.env.whatsapp_admins.includes(msg.from)) return
    handleCommand(msg)
    handleModule(msg)
    
})

async function handleCommand(msg) {
    const message = msg.body?.toLowerCase().split(' ')[0]

    if (!message.startsWith('!')) return

    let command
    Array.from(wb.Commands.values()).some((cmd) => {
        console.log(cmd)
        const triggers = cmd['triggers']
        if (triggers.includes(message.replace("!", ""))) {
            command = cmd
            return true
        } else return false
    })
    if (!command) return await msg.reply("Dieser Befehl gibt es nicht. \nIn meiner WhatsApp-Beschreibung findest du alle Befehle")
    
    const args = msg.body?.toLowerCase().split(' ');
    const defaultArgs = msg.body?.split(' ')

    try {
        const reply = await command.callback({msg, args, defaultArgs})
        if (reply) {
            await msg.reply(reply)
        }
    } catch (e) {
        console.error(e)
    }
}

async function handleModule(msg) {
    const args = msg.body?.toLowerCase().split(' ');
    const defaultArgs = msg.body?.split(' ')

    Array.from(wb.Modules.values()).some((module) => {
        const check = {
            user: module.user.includes(msg.from) || !module.user.length,
            inGroups: !module.inGroups && !msg.id.remote.includes("@g.us"),
            excludedUser: !module.excludedUser.includes(msg.from),
        }
        console.log(check)
        if (Object.values(check).every((i) => i)) {
            return module.callback({msg, args, defaultArgs})
        }
    })
}

module.exports = client
