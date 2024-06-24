module.exports = async ({ classID }) => {
	if (!wb.changedLessons[classID]) wb.changedLessons[classID] = [];

	let date = new Date().setDate(new Date().getDate() + 2);
	date = new Date(date).toISOString().split('T')[0];

	const timetable = await wb.Utils.getTimetableData({
		classID,
		date,
	});

	if (!timetable) return;
	const allLessons = [];
	const currentDate = new Date(),
		firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())),
		lessonsPerDay = {};

	const filteredSavedLessons = [...wb.changedLessons[classID]]?.filter(lesson => firstDayOfWeek / 1000 < wb.Utils.parseUntisDate(lesson.date) / 1000);
	Object.keys(timetable).forEach(day => {
		timetable[day].forEach(lesson => {
			allLessons.push(lesson);
			if (lesson.cellState !== 'STANDARD' && !filteredSavedLessons.map(i => i.id).includes(lesson.id)) {
				filteredSavedLessons.push(lesson);
			}
		});
		lessonsPerDay[day] = timetable[day]
			.map(
				i =>
					wb.Utils.translateCellstate(
						i.cellState,
						i.teacher.filter(t => t)
					).cellstate
			)
			.filter(i => ['STANDARD', 'SUBSTITUTION'].includes(i)).length;
	});

	const newChanges = filteredSavedLessons.filter(i => !wb.changedLessons[classID].find(j => j.id === i.id));
	// TODO Track new changes of lesson after change
	if (newChanges.length) {
		const freeDays = Object.keys(lessonsPerDay).filter(key => lessonsPerDay[key] === 0);
		freeDays.forEach(freeDay => {
			const parsedDay = wb.Utils.parseUntisDate(freeDay);
			const content = `❌ *${wb.Lang.dict.weekdays[parsedDay.getDay() - 1]} ${parsedDay.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}* ❌ \n- ${wb.Lang.handle(__filename, 'lessons_omitted')}`;
			wb.Whatsapp.sendMessage(wb.config.classes.find(i => i['classID'] === classID)['whatsapp_groupID'], content);
		});
		console.log(new Date().toLocaleTimeString('de') + ' Timetable changed');

		const messageData = wb.Utils.getUpdateMessageData(newChanges);
		messageData.forEach(data => {
			if (freeDays.includes(JSON.stringify(data.date))) return;
			const teacherVar =
				data.event.cellstate === 'CANCEL' && data.oldTeacher
					? data.oldTeacher
					: data.oldTeacher
						? `~${data.oldTeacher}~ -> ${data.teacher}`
						: data.teacher;
			const roomVar = data.oldRoom ? `~${data.oldRoom}~ -> ${data.room}` : data.room;
			const content = `*${data.emoji} ${data.weekday} ${data.lesson}. ${wb.Lang.dict['general'].translated_lesson} ${data.emoji}* \n _${data.event.translated}_ \n- ${data.subject} \n- ${teacherVar} \n- ${roomVar} ${data.message ? `\n${data.message}` : ''}`;

			wb.Whatsapp.sendMessage(wb.config.classes.find(i => i['classID'] === classID)['whatsapp_groupID'], content);
		});
	}
	wb.changedLessons[classID] = [...filteredSavedLessons];
};
