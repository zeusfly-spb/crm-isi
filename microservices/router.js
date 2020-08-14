const WorkDayController = require('./controllers/WorkDayController')
const parse = async message => {
    try {
        const frame = JSON.parse(message)
        switch (frame.type) {
            case 'request_add_workday':
                let workday = await WorkDayController.create({...frame.model})
                let responseFrame = {
                    type: 'add_workday',
                    model: workday
                }
                return Promise.resolve({
                    response: null,
                    broadcast: JSON.stringify(responseFrame)
                })
            default:
                return Promise.resolve({
                    response: null,
                    broadcast: message
                })
        }
    } catch (e) {
        Promise.reject(e)
    }
}

module.exports = {
    parse
}
