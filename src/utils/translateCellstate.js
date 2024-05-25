module.exports = (cellState, teacher) => {
    const xd = wb.Lang.dict["cellstate_translation"]
    if (teacher.map(i => i.id).includes(0)) {
        return {cellstate: 'CANCEL', translated: xd['CANCEL']}
    }
    return {cellstate: cellState, translated: xd[cellState]}
}