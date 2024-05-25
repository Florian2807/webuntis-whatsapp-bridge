const fs = require('fs');

module.exports = async () => {
	if (!wb.Whatsapp.info) return console.log('Client not ready');
	for (const schoolClass of wb.config.classes) {
		await wb.Utils.checkUntisUpdates({ classID: schoolClass.classID });
		await wb.Utils.sleep(1000);
	}
	fs.writeFileSync(
		'./data/changedLessons.json',
		JSON.stringify(wb.changedLessons, null, 4)
	);
};
