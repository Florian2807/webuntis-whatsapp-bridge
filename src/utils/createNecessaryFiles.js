const fs = require('fs')
module.exports = () => {
    ir (!fs.existsSync('./data')) {
        fs.mkdirSync('./data')
    }
    if (!fs.existsSync('./data/changedLessons.json')) {
        fs.writeFile('./data/changedLessons.json', '{}')
    }
    if (!fs.existsSync('./config.json')) {
        console.error('config.json does not exist')
        process.exit(1)
    }
    if (!fs.existsSync('./.env')) {
        console.error('.env does not exist')
    }
}