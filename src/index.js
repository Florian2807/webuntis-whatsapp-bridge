const fs = require('fs')

module.exports = () => {
    commands()
    modules()
    utils()
    cronjobs()
    wb.Utils.createNecessaryFiles()
    wb.changedLessons = JSON.parse(fs.readFileSync('./data/changedLessons.json', 'utf8')) || {}
}

function commands() {
    wb.Commands = new Map()
    const files = fs.readdirSync(`./src/commands`, { recursive: true}).filter(i => i.includes('.js'))

    for (const file of files) {
        const command = require(`${__dirname}/commands/${file}`)
        wb.Commands.set(command.commandName, command)
    }
}

function modules() {
    wb.Modules = new Map()
    const files = fs.readFileSync('./src/modules', { recursive: true}).filter(i => i.includes('.js'))
    
    for (const file of files) {
        const module = require(`${__dirname}/commands/${file}`)
        wb.Commands.set(module.moduleName, module)
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