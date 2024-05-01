const got = require('got')

module.exports = {
    commandName: 'teacher',
    triggers: ['teacher', 'lehrer'],
    needTeacherAccess: true,
    callback: async ({ args, defaultArgs }) => {
        if (!args[1]) return `Du musst einen Lehrer angeben \nBeispiel: ${defaultArgs[0]} May`
        const allTeachers = await wb.Webuntis.getTeachers()
        const foundTeachers = allTeachers.filter(t =>
            t.longName.toLowerCase().includes(args[1]) ||
            t.name.toLowerCase().includes(args[1]) ||
            t.foreName.toLowerCase().includes(args[1])
        ).map(t => { return { forename: t.foreName, name: t.longName, short: t.name, id: t.id } })
        if (!foundTeachers.length) return 'Keinen Lehrer gefunden! Bist du sicher, dass du den Namen richtig geschrieben hast?'
        const todaysDate = new Date().toISOString().split('T')[0]

        const requestedLesson = wb.Utils.getParameters(args, 'stunde', true)
        if (requestedLesson &&
            (typeof requestedLesson !== 'number' ||
                requestedLesson > 9 ||
                requestedLesson < 1)
        ) return 'Ungültige Stunde! \nVerwende beispielsweise `stunde:1`'

        const currentLesson = wb.Utils.getCurrentLesson(requestedLesson)
        if (!currentLesson) {
            return `Aktuell ist kein Unterricht! \n\nDu kannst auch andere Stunden abfragen. Beispiel: \n\`${defaultArgs[0]} ${defaultArgs[1]} stunde:1\``
        }
        let teacherInfos = []
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

            const name = `${teacher.forename.split('')[0]}. ${teacher.name}`

            if (parsedLesson) {
                teacherInfos.push({ name: name, teacher: teacher, lesson: parsedLesson })
            }
        }

        const messageData = wb.Utils.getUpdateMessageData(teacherInfos.map(i => i.lesson))


        messageData.forEach(data => {
            const index = messageData.indexOf(data)
            teacherInfos[index]['messageData'] = data
        })


        // teacherInfos.push({
        //     name: teacher.name,
        //     forename: ,
        //     message: null,
        //     subject: parsedLesson?.subject?.map(i => i.longName).join(', ') ?? 'Fach nicht bekannt',
        //     room: parsedLesson?.room?.map(i => i.name).join(', ') ?? 'Raum nicht bekannt',
        //     roomName: parsedLesson?.room?.map(i => i.longName).join(', ') ?? ''
        // })
        let outputMessage = ''
        for (const data of teacherInfos) {
            const teacherVar = data.messageData.event === "Entfall" && data.messageData.oldTeacher ? '_Unterricht entfällt_\n' : ((data.messageData.oldTeacher === data.teacher.short) ? `_Unterricht wird vertreten_\n` : `_${data.messageData.event}_\n`)
            const roomVar = data.messageData.oldRoom ? `~${data.messageData.oldRoom}~ -> ${data.messageData.room}` : data.messageData.room

            const content = `*${data.name}*\n${data.messageData.message ? `- ${data.message}\n` : `${teacherVar}- ${roomVar} \n- ${data.messageData.subject}`}\n`

            outputMessage += content
        }

        return `Lehrer ${currentLesson.lesson}. Stunde:\n\n` + outputMessage + (requestedLesson ? "" : `\n\nDu kannst auch andere Stunden abfragen. Beispiel: \n\`${defaultArgs[0]} ${defaultArgs[1]} stunde:1\``)
    },
}
