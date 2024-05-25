const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/timetable', async (req, res) => {
	const classID = req.query['classID']
		? JSON?.parse(req.query['classID'])
		: 872;
	const date = req.query['date'] ?? new Date().toISOString().split('T')[0];
	console.log(classID, date);
	res.url = req.url + `?classID=${classID}&date=${date}`;
	const timetable = await wb.Utils.getTimetableData({ classID, date });
	res.send(timetable);
});

app.get('/searchteacher/:teacher', async (req, res) => {
	const lessonNumber = req.query.lesson
		? JSON.parse(req.query.lesson)
		: getCurrentLesson();

	const timeplan = [750, 835, 940, 1025, 1130, 1215, 1320, 1410, 1455];

	const teacher = (await wb.Webuntis.getTeachers()).filter(i =>
		i.longName?.toLowerCase().includes(req.params.teacher?.toLowerCase())
	);
	const teacherIDs = teacher.map(i => i.id);

	const classIDs = await (await wb.Webuntis.getClasses()).map(i => i.id);
	let foundLessons = [];
	for (const classID of classIDs) {
		const timetable = await wb.Webuntis.getTimetableForToday(classID, 1);
		const teacherFound = [];
		timetable.forEach(lesson => {
			lesson['te'].forEach(teacher => {
				if (
					teacherIDs.includes(teacher.id) &&
					timeplan.indexOf(lesson.startTime) + 1 === lessonNumber
				) {
					teacherFound.push(lesson);
				}
			});
		});

		if (teacherFound.length) {
			foundLessons.push(teacherFound);
		}
	}
	const result = {};
	foundLessons.flat().forEach(i => {
		result[i['te'][0].name] = i['ro'][0].name;
	});
	res.send(result);
});

function getCurrentLesson() {
	const stundenplan = [
		{ start: '07:50', ende: '08:35', stunde: 1 },
		{ start: '08:35', ende: '09:20', stunde: 2 },
		{ start: '09:40', ende: '10:25', stunde: 3 },
		{ start: '10:25', ende: '11:10', stunde: 4 },
		{ start: '11:30', ende: '12:15', stunde: 5 },
		{ start: '12:15', ende: '13:00', stunde: 6 },
		{ start: '13:20', ende: '14:05', stunde: 7 },
		{ start: '14:10', ende: '14:55', stunde: 8 },
		{ start: '14:55', ende: '15:40', stunde: 9 },
	];

	const jetzt = new Date().toLocaleTimeString('DE', {
		timeZone: 'Europe/Berlin',
	});
	const aktuelleUhrzeit = `${jetzt.split(':')[0]}:${jetzt.split(':')[1]}`;

	for (const stunde of stundenplan) {
		if (aktuelleUhrzeit >= stunde.start && aktuelleUhrzeit < stunde.ende) {
			return stunde.stunde;
		}
	}

	for (let i = 0; i < stundenplan.length - 1; i++) {
		const aktuelleStundeEnde = stundenplan[i].ende;
		const naechsteStundeStart = stundenplan[i + 1].start;

		if (
			aktuelleUhrzeit >= aktuelleStundeEnde &&
			aktuelleUhrzeit < naechsteStundeStart
		) {
			return stundenplan[i + 1].stunde;
		}
	}

	return undefined;
}

const server = http.createServer(app);

server.listen(JSON.parse(process.env.APIPORT), () => {
	console.log('listening on port ' + JSON.parse(process.env.APIPORT));
});
