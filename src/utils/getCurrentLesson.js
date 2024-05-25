module.exports = (lesson = null) => {
	const timetable = wb.config.timetable;

	if (lesson) return timetable.find(i => i.lesson === lesson);

	const now = new Date().toLocaleTimeString('de', {
		timeZone: 'Europe/Berlin',
		hour12: false,
	});
	const currentTime = now.split(':').slice(0, 2).join(':');

	// Check if there is a lesson right now
	for (const stunde of timetable) {
		if (currentTime >= stunde.start && currentTime < stunde.end) {
			return stunde;
		}
	}

	// Check if there is a break right now and get next lesson
	for (let i = 0; i < timetable.length - 1; i++) {
		const currentLessonEnd = timetable[i].end;
		const nextLessonStart = timetable[i + 1].start;
		if (currentTime >= currentLessonEnd && currentTime < nextLessonStart) {
			return timetable[i + 1];
		}
	}

	return undefined;
};
