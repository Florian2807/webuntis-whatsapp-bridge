const fs = require('fs')

module.exports = () => {
    commands()
    utils()
    cronjobs()
    wb.changedLessons = JSON.parse(fs.readFileSync('./data/changedLessons.json', 'utf8')) || {}
    wb.Utils.createNecessaryFiles()
}

function commands() {
    wb.Commands = new Map()
    const files = fs.readdirSync(`./src/commands`)
    for (const file of files) {
        const command = require(`${__dirname}/commands/${file}`)
        wb.Commands.set(command.commandName, command)
    }
}

function utils() {
    wb.Utils = {};
    const files = fs.readdirSync(`./src/utils`);
    for (const file of files) {
        const utilName = file.replace('.js', ''); // Extracting the utility function name
        const util = require(`${__dirname}/utils/${file}`);
        wb.Utils[utilName] = util; // Setting the utility function with its name in the object
    }
}

function cronjobs() {
    require('./cronjobs.js')
}