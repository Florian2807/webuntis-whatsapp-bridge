module.exports = (lesson = null) => {
    const timetable = [
        {start: '07:50', end: '08:35', lesson: 1},
        {start: '08:35', end: '09:20', lesson: 2},
        {start: '09:40', end: '10:25', lesson: 3},
        {start: '10:25', end: '11:10', lesson: 4},
        {start: '11:30', end: '12:15', lesson: 5},
        {start: '12:15', end: '13:00', lesson: 6},
        {start: '13:20', end: '14:05', lesson: 7},
        {start: '14:10', end: '14:55', lesson: 8},
        {start: '14:55', end: '15:40', lesson: 9}
    ];

    if (lesson) return timetable.find(i => i.lesson === lesson)

    const now = new Date().toLocaleTimeString('de', {
        timeZone: 'Europe/Berlin',
        hour12: false
    })
    const currentTime = now.split(':').slice(0, 2).join(':')

    // Check if there is a lesson right now
    for (const stunde of timetable) {
        if (currentTime >= stunde.start && currentTime < stunde.end) {
            return stunde
        }
    }

    // Check if there is a break right now and get next lesson
    for (let i = 0; i < timetable.length - 1; i++) {
        const currentLessonEnd = timetable[i].end
        const nextLessonStart = timetable[i + 1].start
        if (
            currentTime >= currentLessonEnd &&
            currentTime < nextLessonStart
        ) {
            return timetable[i + 1]
        }
    }

    return undefined
}