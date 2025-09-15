module.exports = (filepath, description, variables) => {
	const filename = filepath.split('/').pop();

	let message = wb.Lang.dict?.[filename]?.[description];
	if (!message) {
		console.error('No Message Found: ' + filepath, description);
		// Fallback-Nachricht direkt verwenden, um Endlosschleife zu vermeiden
		if (filename === 'language-handler.js' && description === 'no_message_found') {
			return 'Es ist etwas schief gelaufen. \n Versuche es später erneut :)';
		}
		return wb.Lang.dict?.['language-handler.js']?.['no_message_found'] || 'Es ist ein Fehler aufgetreten.';
	}

	if (variables) {
		for (const key in variables) {
			message = message.replace(new RegExp('\\${' + key + '}', 'g'), variables[key]);
		}
	}

	return message || 'Leere Nachricht';
};
