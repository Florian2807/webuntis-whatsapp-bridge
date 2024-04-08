const got = require('got')

//TODO zusätzlicher unterricht priorisieren

module.exports = {
    commandName: 'room',
    triggers: ['room', 'raum'],
    needTeacherAccess: true,
    callback: async ({args, defaultArgs}) => {
        if (!args[1]) return `Du musst einen Raum-Namen angeben \nBeispiel: ${args[0]} 208`
        const {data} = await got(`https://${process.env.untis_baseurl}/WebUntis/api/public/timetable/weekly/pageconfig?type=4`, {
            headers: {
                'Cookie': wb.Webuntis._buildCookies(),
            }
        }).json()
        const room = data.elements.find(e => [e.name?.replace("R", ""), e.name?.toLowerCase(), e.longName?.toLowerCase(), e.displayName?.toLowerCase()].includes(args[1].toLowerCase()))
        const roomID = room?.id
        const roomName = room?.name
        if (!roomID) return 'Dieser Raum existiert nicht. Versuche es vielleicht mit einem anderen Begriff für den Raum'
        const todaysDate = new Date().toISOString().split('T')[0]
        const {data: roomData} = await got(`https://${process.env.untis_baseurl}/WebUntis/api/public/timetable/weekly/data?elementType=4&elementId=${roomID}&date=${todaysDate}&formatId=1`, {
            headers: {
                'Cookie': wb.Webuntis._buildCookies(),
            }, throwHttpErrors: false
        }).json()

        const requestedLesson = wb.Utils.getParameters(args, 'stunde', true)

        const currentLesson = wb.Utils.getCurrentLesson(requestedLesson)
        if (!currentLesson) return `Aktuell ist doch gar kein Unterricht!\n\nDu kannst auch andere Stunden abfragen. Beispiel: \n\`${defaultArgs[0]} ${defaultArgs[1]} stunde:1\``

        const searchLesson = roomData?.result?.data?.['elementPeriods']?.[roomID]?.find((lesson) => lesson?.date === parseInt(todaysDate.replaceAll("-", "")) && lesson?.startTime === parseInt(currentLesson?.start.replace(":", "")))
        if (!searchLesson) return 'Aktuell ist in diesem Raum kein Unterricht!'

        const parsedLesson = wb.Utils.parseLesson(searchLesson, roomData?.result?.data?.['elements'])
        if (!parsedLesson) return 'Aktuell ist in diesem Raum kein Unterricht!'

        return `Unterricht in Raum *${roomName}* in der ${currentLesson.lesson}. Stunde:` +
            `\n- ${parsedLesson?.subject?.map(i => i.longName)?.join(', ') ?? 'Fach nicht bekannt'}` +
            `\n- ${parsedLesson?.teacher?.map(i => i.name).join(', ')} ` +
            `${wb.Utils.translateCellstate(parsedLesson.cellState, parsedLesson?.teacher?.filter(t => t)) !== 'Normal' ? `\n- *${wb.Utils.translateCellstate(parsedLesson.cellState, parsedLesson?.teacher?.filter(t => t))}*` : ''}` +
            `${parsedLesson?.cellState === "ADDITIONAL" ? "\n- " + parsedLesson.lessonText : ""}` + 
            (requestedLesson ? "" : `\n\nDu kannst auch andere Stunden abfragen. Beispiel: \n\`${defaultArgs[0]} ${defaultArgs[1]} stunde:1\``)
    },
}
