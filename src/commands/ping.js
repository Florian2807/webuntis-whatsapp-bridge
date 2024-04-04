module.exports = {
    commandName: 'ping',
    triggers: ['ping'],
    needTeacherAccess: false,
    callback: ({msg}) => {
        return msg.reply('Pong!');
    },
}
