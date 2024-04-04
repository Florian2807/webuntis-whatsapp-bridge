module.exports = async (input) => {
    const {key} = await got.post('https://paste.florian2807.me/documents', {
        body: JSON?.stringify(input, null, 4), responseType: 'json', throwHttpErrors: false
    }).json()
    return `https://paste.florian2807.me/${key}`
}