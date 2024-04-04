module.exports = (cellState, lehrer) => {
    const xd = {
        "STANDARD": "Normal",
        "CANCEL": "Entfall",
        "FREE": "Frei",
        "SUBSTITUTION": "Vertretung",
        "ROOMSUBSTITUTION": "Raum-Verlegung",
        "ADDITIONAL": "Zusätzlicher Unterricht",
    }
    if (lehrer.map(i => i.id).includes(0)) {
        return xd['CANCEL']
    }
    return xd[cellState]
}