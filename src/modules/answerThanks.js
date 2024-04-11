module.exports = {
    moduleName: 'answerThanks',
    user: [],
    excludedUser: [],
    inGroups: false,
    description: 'answer to thanks xd',

    callback: async (msg) => {
        if(msg.body?.toLowerCase().includes("danke")) {
            await msg.reply("🤖📣 Gerne Gerne")
        }
    }
}