module.exports = async (input) => {
    const {key} = await got.post('https://paste.ivr.fi/documents', {
        body: JSON?.stringify(input, null, 4), responseType: 'json', throwHttpErrors: false
    }).json()
    return `https://paste.ivr.fi/${key}`
}