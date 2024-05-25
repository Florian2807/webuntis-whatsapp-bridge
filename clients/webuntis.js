const { WebUntis } = require('webuntis');

const client = new WebUntis(process.env['untis_school'], process.env['untis_username'], process.env['untis_password'], process.env['untis_baseurl']);
client.login();
module.exports = client;
