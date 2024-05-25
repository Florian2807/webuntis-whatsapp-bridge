module.exports = (filepath, description, variables) => {
	const filename = filepath.split('/').pop();

	let message = wb.Lang.dict?.[filename]?.[description];
	if (!message) {
		console.error('No Message Found: ' + filepath, description);
		return wb.Lang.handle(__filename, 'no_message_found');
	}

	for (const key in variables) {
		message = message.replace(
			new RegExp('\\${' + key + '}', 'g'),
			variables[key]
		);
	}
	return message;
};
