
module.exports = (lesson, elements) => {
    if (!lesson) return undefined

    const allClasses = elements.filter((i) => i.type === 1)
    const allTeacher = elements.filter((i) => i.type === 2)
    const allSubjects = elements.filter((i) => i.type === 3)
    const allRooms = elements.filter((i) => i.type === 4)
    const notRegular = lesson?.elements.filter((element) => element.state !== 'REGULAR')

    return {
        lesson: wb.config['timetable'].map(i => i.start.replace(/[0:]/g, '')).indexOf(lesson.startTime) + 1,
        id: lesson.id,
        date: lesson.date,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        cellState: lesson.cellState,
        lessonText: lesson.lessonText,
        substText: lesson.substText,
        notRegular: notRegular,
        class: allClasses.find((i) => i.id === lesson.elements.find((e) => e.type === 1 && e.state === 'REGULAR')?.id) ?? null,
        teacher: allTeacher.filter((i) => (lesson.elements.filter((e) => e.type === 2).map(o => o.id)).includes(i.id)) ?? null,
        oldTeacher: notRegular.filter(i => i.type === 2).map(i => allTeacher.find(o => o.id === i.orgId)),
        subject: allSubjects.filter((i) => lesson.elements.filter((e) => e.type === 3).map(o => o.id).includes(i.id)) ?? null,
        room: allRooms.filter((i) => lesson.elements.filter((e) => e.type === 4).map(o => o.id).includes(i.id)) ?? null,
        oldRoom: notRegular.filter(i => i.type === 4).map(i => allRooms.find(o => o.id === i.orgId)),
    }
}