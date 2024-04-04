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

    const message = msg.body?.toLowerCase().split(' ')[0]

    if(msg.body?.toLowerCase().includes("danke") && !message.startsWith('!') && !msg.id.remote.includes("@g.us")) {
        await msg.reply("🤖📣 Gerne Gerne")
    } 

    if (!message.startsWith('!')) return

    let command
    Array.from(wb.Commands.values()).some((cmd) => {
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
})

module.exports = client
