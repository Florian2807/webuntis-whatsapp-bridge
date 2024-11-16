module.exports = async ({ classID }) => {
    if (!wb.changedLessons[classID]) wb.changedLessons[classID] = [];

    let date = "2024-12-02"//new Date();
    //date.setDate(date.getDate() + 2);
    //date = date.toISOString().split('T')[0];

    const timetable = await wb.Utils.getTimetableData({
        classID,
        date,
    });

    if (!timetable) return;

    const currentDate = new Date();
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const lessonsPerDay = {};

    const existingChanges = wb.changedLessons[classID].filter(
        lesson => wb.Utils.parseUntisDate(lesson.date) >= firstDayOfWeek / 1000
    );
    const newChanges = []

    Object.keys(timetable).forEach(day => {
        const dayLessons = timetable[day];
        dayLessons.forEach(lesson => {

            // check existing changes for changes
            const existingLesson = existingChanges.find(i => i.id === lesson.id);
            if (existingLesson) {
                if (lesson.cellState !== existingLesson.cellState) {
                    lesson.isUpdate = true;
                    existingChanges.splice(existingChanges.indexOf(existingLesson), 1);
                    newChanges.push(lesson);
                }
            } else {
                if (lesson.cellState !== 'STANDARD') {
                    lesson.isUpdate = false
                    newChanges.push(lesson);
                }
            }
        });
        lessonsPerDay[day] = dayLessons
            .map(lesson =>
                wb.Utils.translateCellstate(
                    lesson.cellState,
                    lesson.teacher.filter(Boolean)
                ).cellstate
            )
            .filter(state => ['STANDARD', 'SUBSTITUTION', 'ROOMSUBSTITUTION', 'ADDITIONAL'].includes(state)).length;
    });

    if (newChanges.length) {
        const freeDays = Object.keys(lessonsPerDay).filter(day => lessonsPerDay[day] === 0);

        freeDays.forEach(freeDay => {
            const parsedDay = wb.Utils.parseUntisDate(freeDay);
            const content = `❌ *${wb.Lang.dict.weekdays[parsedDay.getDay() - 1]} ${parsedDay.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}* ❌ \n- ${wb.Lang.handle(__filename, 'lessons_omitted')}`;
            wb.Whatsapp.sendMessage(wb.config.classes.find(cls => cls.classID === classID).whatsapp_groupID, content);
        });

        console.log(`${new Date().toLocaleTimeString('de')} Timetable changed`);

        const messageData = wb.Utils.getUpdateMessageData(newChanges);
        messageData.forEach(data => {
            if (freeDays.includes(JSON.stringify(data.date))) return;
            const isUpdate = data.isUpdate ?`_${wb.Lang.dict['general'].update}_\n` : '';
            const roomVar = data.oldRoom ? `~${data.oldRoom}~ -> ${data.room}` : data.room;
            const content = `${isUpdate} *${data.emoji} ${data.weekday} ${data.lesson}. ${wb.Lang.dict['general']['translated_lesson']} ${data.emoji}* \n _${data.event.translated}_ \n- ${data.subject} \n- ${roomVar} ${data.message ? `\n${data.message}` : ''}`;

            wb.Whatsapp.sendMessage(wb.config.classes.find(i => i['classID'] === classID)['whatsapp_groupID'], content);
        });
    }
    wb.changedLessons[classID] = [...existingChanges.concat(newChanges.filter(change => change.cellState !== "STANDARD"))];
};
