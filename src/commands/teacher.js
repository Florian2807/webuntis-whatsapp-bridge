const got = require('got');

module.exports = {
	commandName: 'teacher',
	triggers: ['teacher', 'lehrer'],
	needTeacherAccess: true,
	callback: async ({ args }) => {
		if (!args[1])
			return wb.Lang.handle(__filename, 'no_teacher_provided', {
				args0: args[0],
			});
		const allTeachers = await wb.Webuntis.getTeachers();
		const foundTeachers = allTeachers
			.filter(
				t =>
					t.longName.toLowerCase().includes(args[1].toLowerCase()) ||
					t.name.toLowerCase().includes(args[1].toLowerCase()) ||
					t.foreName.toLowerCase().includes(args[1].toLowerCase())
			)
			.map(t => {
				return {
					forename: t.foreName,
					name: t.longName,
					short: t.name,
					id: t.id,
				};
			});

		const requestedLesson = wb.Utils.getParameters(args, wb.Lang.handle(__filename, 'lesson_parameter'), true);
		if (requestedLesson && (typeof requestedLesson !== 'number' || requestedLesson > 9 || requestedLesson < 1))
			return wb.Lang.handle(__filename, 'invalid_lesson');

		if (!foundTeachers.length) {
			if (args.join(' ').includes('.') || args.length() > 2) {
				return wb.Lang.handle(__filename, 'request_includes_dot', {
					args0: args[0],
					args1: args[1],
				});
			}
			return wb.Lang.handle(__filename, 'teacher_not_found');
		}
		const todaysDate = new Date().toISOString().split('T')[0];

		const currentLesson = wb.Utils.getCurrentLesson(requestedLesson);
		if (!currentLesson) {
			return wb.Lang.handle(__filename, 'currently_no_lesson', {
				args0: args[0],
				args1: args[1],
			});
		}
		let teacherInfos = [];
		for (const teacher of foundTeachers) {
			const { data } = await got(
				`https://${process.env.untis_baseurl}/WebUntis/api/public/timetable/weekly/data?elementType=2&elementId=${teacher.id}&date=${todaysDate}&formatId=1`,
				{
					headers: {
						Cookie: wb.Webuntis._buildCookies(),
					},
					throwHttpErrors: false,
				}
			).json();

			if (!data) {
				await wb.Webuntis.login();
				this.callback({ args });
			}

			const searchLesson = data?.result?.data?.['elementPeriods']?.[teacher.id]?.find(
				lesson =>
					lesson?.date === parseInt(todaysDate.replaceAll('-', '')) && lesson?.startTime === parseInt(currentLesson?.start.replace(':', ''))
			);
			const parsedLesson = wb.Utils.parseLesson(searchLesson, data?.result?.data?.['elements']);

			const name = `${teacher.forename.split('')[0]}. ${teacher.name}`;

			if (parsedLesson) {
				teacherInfos.push({
					name: name,
					teacher: teacher,
					lesson: parsedLesson,
				});
			} else {
				teacherInfos.push({
					name: name,
					teacher: teacher,
					messageData: {
						message: wb.Lang.handle(__filename, 'teacher_no_lesson'),
					},
				});
			}
		}
		const messageData = wb.Utils.getUpdateMessageData(teacherInfos.filter(i => !i.messageData?.message).map(i => i.lesson));

		messageData.forEach(data => {
			const index = messageData.indexOf(data);
			teacherInfos[index]['messageData'] = data;
		});

		// teacherInfos.push({
		//     name: teacher.name,
		//     forename: ,
		//     message: null,
		//     subject: parsedLesson?.subject?.map(i => i.longName).join(', ') ?? 'Fach nicht bekannt',
		//     room: parsedLesson?.room?.map(i => i.name).join(', ') ?? 'Raum nicht bekannt',
		//     roomName: parsedLesson?.room?.map(i => i.longName).join(', ') ?? ''
		// })
		let outputMessage = '';
		for (const data of teacherInfos) {
			console.log(data)
			const teacherVar =
				data.messageData?.event?.cellstate === wb.Lang.dict['cellstate_translation']['CANCEL'] && data.messageData?.oldTeacher
					? `_${wb.Lang.handle(__filename, 'lesson_canceled')}_\n`
					: data.messageData?.oldTeacher === data.teacher?.short
						? `_${wb.Lang.handle(__filename, 'lesson_is_substituted')}_\n`
						: `_${data.messageData?.event?.translated}_\n`;
			const roomVar = data.messageData?.oldRoom ? `~${data.messageData?.oldRoom}~ -> ${data.messageData?.room}` : data.messageData?.room;
			const content = `\n*${data.name}*\n${data.messageData?.message ? `- ${data.messageData.message}\n` : `${teacherVar}- ${roomVar} \n- ${data.messageData?.subject}`}\n`;

			outputMessage += content;
		}

		return (
			wb.Lang.handle(__filename, 'output_header', {
				currentLesson: currentLesson.lesson,
			}) +
			outputMessage +
			(requestedLesson
				? ''
				: wb.Lang.handle(__filename, 'output_footer', {
						args0: args[0],
						args1: args[1],
					}))
		);
	},
};
