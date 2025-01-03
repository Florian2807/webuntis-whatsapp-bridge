module.exports = (updates = []) => {
	const weekdays = wb.Lang.dict['weekdays'];
	const output = [];
	updates.forEach(update => {
		console.log(getRightEmoji(update.cellState));
		const event = wb.Utils.translateCellstate(
			update.cellState,
			update.teacher.filter(t => t)
		);
		const element = {
			weekday: weekdays[wb.Utils.parseUntisDate(update.date).getDay() - 1],
			date: update.date,
			lesson: update.lesson,
			subject: update.subject.map(i => i.longName).join(', '),
			teacher: update.teacher
				.filter(t => t)
				.map(i => i.name)
				.join(', '),
			oldTeacher: update.oldTeacher
				.filter(i => i)
				.map(i => i.name)
				.join(', '),
			event: event,
			room: update.room.map(i => i.name).join(', '),
			oldRoom: update.oldRoom
				.filter(i => i)
				.map(i => i.name)
				.join(', '),
			message: update.substText.length ? `- ${update.substText}` : '',
			emoji: getRightEmoji(event.cellstate),
			isUpdate: update.isUpdate,
		};
		output.push(element);
	});
	return output;
};

function getRightEmoji(cellState) {
	const list = {
		STANDARD: '🟢',
		CANCEL: '🔴',
		FREE: '🔴',
		SUBSTITUTION: '🟠',
		ROOMSUBSTITUTION: '🟠',
		ADDITIONAL: '🟠',
		EXAM: '🔵',
	};
	return list[cellState] ?? '🟠';
}
