const fs = require('fs')

module.exports = () => {
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data')
    }
    if (!fs.existsSync('./data/changedLessons.json')) {
        fs.writeFileSync('./data/changedLessons.json', '{}')
    }
    if (!fs.existsSync('./.env')) {
        throw new Error('.env does not exist')
    }
}