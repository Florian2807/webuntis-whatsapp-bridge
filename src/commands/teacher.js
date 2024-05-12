const got = require('got')

module.exports = {
    commandName: 'teacher',
    triggers: ['teacher', 'lehrer'],
    needTeacherAccess: true,
    callback: async ({ args, defaultArgs }) => {
        if (!args[1]) return wb.Lang.handle(__filename, "no_teacher_provided", { args0: defaultArgs[0] })
        const allTeachers = await wb.Webuntis.getTeachers()
        const foundTeachers = allTeachers.filter(t =>
            t.longName.toLowerCase().includes(args[1]) ||
            t.name.toLowerCase().includes(args[1]) ||
            t.foreName.toLowerCase().includes(args[1])
        ).map(t => { return { forename: t.foreName, name: t.longName, short: t.name, id: t.id } })
        if (!foundTeachers.length) return wb.Lang.handle(__filename, "teacher_not_found")
        const todaysDate = new Date().toISOString().split('T')[0]

        const requestedLesson = wb.Utils.getParameters(args, wb.Lang.handle(__filename, "lesson_parameter"), true)
        if (requestedLesson &&
            (typeof requestedLesson !== 'number' ||
                requestedLesson > 9 ||
                requestedLesson < 1)
        ) return wb.Lang.handle(__filename, 'invalid_lesson')

        const currentLesson = wb.Utils.getCurrentLesson(requestedLesson)
        if (!currentLesson) {
            return wb.Lang.handle(__filename, "currently_no_lesson", { args0: defaultArgs[0], args1: defaultArgs[1] })
        }
        const teacherInfos = []
        for (const teacher of foundTeachers) {
            const { data } = await got(`https://${process.env.untis_baseurl}/WebUntis/api/public/timetable/weekly/data?elementType=2&elementId=${teacher.id}&date=${todaysDate}&formatId=1`, {
                headers: {
                    'Cookie': wb.Webuntis._buildCookies(),
                }, throwHttpErrors: false
            }).json()

            if (!data) {
                await wb.Webuntis.login()
                this.callback({ args, defaultArgs })
            }

            const searchLesson = data?.result?.data?.['elementPeriods']?.[teacher.id]?.find((lesson) => lesson?.date === parseInt(todaysDate.replaceAll("-", "")) && lesson?.startTime === parseInt(currentLesson?.start.replace(":", "")))
            const parsedLesson = wb.Utils.parseLesson(searchLesson, data?.result?.data?.['elements'])

            if (!searchLesson || !parsedLesson) {
                teacherInfos.push({ name: teacher.name, forename: teacher.forename, message: wb.Lang.handle(__filename, "teacher_no_lesson") })
                continue
            }
            if (["CANCEL", "FREE"].includes(parsedLesson.cellState)) {
                teacherInfos.push({ name: teacher.name, forename: teacher.forename.split('')[0] + '.', message: wb.Lang.handle(__filename, "lesson_canceled") })
            }
            if (parsedLesson.cellState === "SUBSTITUTION" && parsedLesson.oldTeacher.find(t => t.id === teacher.id)) {
                teacherInfos.push({ name: teacher.name, forename: teacher.forename.split('')[0] + '.', message: wb.Lang.handle(__filename, "lesson_is_substituted") })
            }
            teacherInfos.push({
                name: teacher.name,
                forename: teacher.forename.split('')[0] + '.',
                message: null,
                subject: parsedLesson?.subject?.map(i => i.longName).join(', ') ?? wb.Lang.handle(__filename, "subject_unknown"),
                room: parsedLesson?.room?.map(i => i.name).join(', ') ?? wb.Lang.handle(__filename, "room_unknown"),
                roomName: parsedLesson?.room?.map(i => i.longName).join(', ') ?? ''
            })
        }

        return wb.Lang.handle(__filename, "output_header", { currentLesson: currentLesson.lesson }) + teacherInfos
            .map(t => t?.message ? `*${t.forename} ${t.name}*\n- ${t.message}` : `*${t.forename} ${t.name}*\n- ${t.room}(${t.roomName})\n- ${t.subject}`)
            .join('\n') + (requestedLesson ? "" : wb.Lang.handle(__filename, "output_footer", { args0: defaultArgs[0], args1: defaultArgs[1] }))
    },
}
