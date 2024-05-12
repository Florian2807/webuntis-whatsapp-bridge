const qrcode = require('qrcode-terminal');
const {Client, LocalAuth} = require('whatsapp-web.js');

const conf = {
    authStrategy: new LocalAuth({dataPath: 'data/token'}) 
}
if (process.env.chrome_path) {
    conf.puppeteer = {product: "chrome", executablePath: process.env.chrome_path}
}

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