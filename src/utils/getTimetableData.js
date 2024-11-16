const got = require('got');

module.exports = async ({ classID, date }) => {
	const body = await got(`https://${process.env['untis_baseurl']}/WebUntis/api/public/timetable/weekly/data`, {
		searchParams: {
			elementType: 1,
			elementId: classID,
			date: date,
			formatId: 1,
		},
		headers: {
			Cookie: wb.Webuntis._buildCookies(),
		},
		throwHttpErrors: false,
	}).json();

	if (body.code === 401) {
		console.warn('Service currently unavailable');
	}

	if (!body.data) {
		await wb.Webuntis.login();
		console.log(new Date().toLocaleTimeString('de') + JSON.stringify(body));
		return wb.Utils.getTimetableData({ classID, date });
	}
	console.log('x')
	const { data } = body;

	const timetable = {};
	Object.values(data.result.data['elementPeriods'])[0].forEach(lesson => {
		const day = lesson.date;

		if (!timetable[day]) timetable[day] = [];

		/*
            cellState:
                STANDARD
                CANCEL
                FREE
                SUBSTITUTION
                ROOMSUBSTITUTION
                ADDITIONAL
				EXAM
 
            type 2:
                ABSENT
        */

		timetable[day].push(wb.Utils.parseLesson(lesson, data.result.data['elements']));
	});

	const sortedTimetable = {};
	Object.keys(timetable)
		.sort((a, b) => a - b)
		.forEach(day => {
			sortedTimetable[day] = timetable[day];
			sortedTimetable[day].sort((a, b) => a.startTime - b.startTime);
		});
	return sortedTimetable;
};
