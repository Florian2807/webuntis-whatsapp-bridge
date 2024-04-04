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

client.on('ready', async (session) => {
    console.log('Client is ready!');
    const asd = (await client.getChats())
    console.log(asd.map(chat => {return {name: chat.name, id: chat.id._serialized}}));
    process.exit(0);
})
client.initialize()