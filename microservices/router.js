const parse = async message => {
    try {
        let frame = JSON.parse(message)
        switch (frame.type) {
            case 'request_add_expense':
                break
            default:
                return {
                    response: null,
                    broadcast: message
                }
        }
    } catch (e) {
        Promise.reject(e)
    }
}

module.exports = {
    parse
}
