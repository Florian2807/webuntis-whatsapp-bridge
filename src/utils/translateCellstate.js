module.exports = (cellState, lehrer) => {
    const xd = wb.Lang.dict["cellstate_translation"]
    if (lehrer.map(i => i.id).includes(0)) {
        return {cellstate: 'CANCEL', translated: xd['CANCEL']}
    }
    return {cellstate: cellState, translated: xd[cellState]}
}