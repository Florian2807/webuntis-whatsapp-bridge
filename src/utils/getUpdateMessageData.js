module.exports = (updates = []) => {
    const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
    const output = []
    updates.forEach(update => {
        const event = wb.Utils.translateCellstate(update.cellState, update.teacher.filter(t => t))
        const element = {
            weekday: weekdays[wb.Utils.parseUntisDate(update.date).getDay() - 1],
            lesson: update.lesson,
            subject: update.subject.map(i => i.longName).join(', '),
            teacher: update.teacher.filter(t => t).map(i => i.name).join(', '),
            oldTeacher: update.oldTeacher.filter(i => i).map(i => i.name).join(', '),
            event: event,
            room: update.room.map(i => i.name).join(', '),
            oldRoom: update.oldRoom.filter(i => i).map(i => i.name).join(', '),
            message: update.substText.length ? `- ${update.substText}` : '',
            emoji: getRightEmoji(event),
        }
        output.push(element)
    });
    return output
}

function getRightEmoji(cellState) {
    const list = {
        "Normal": "🟢",
        "Entfall": "🔴",
        "Frei": "🔴",
        "Vertretung": "🟠",
        "Raum-Verlegung": "🟠",
        "Zusätzlicher Unterricht": "🟠"
    }
    return list[cellState]
}