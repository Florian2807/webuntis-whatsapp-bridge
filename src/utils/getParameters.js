module.exports = (args, definition, parseRes) => {
	let foundArgument = args.find(i => {
		return i.toLowerCase().startsWith(`${definition.toLowerCase()}:`);
	});
	if (!foundArgument) return undefined;

	let parameter = foundArgument?.replace(`${definition}:`, '');
	args.splice(args.indexOf(foundArgument), 1);

	if (parseRes) {
		try {
			parameter = JSON.parse(parameter);
		} catch (e) {
			parameter = parameter;
		}
	}
	return parameter;
};
