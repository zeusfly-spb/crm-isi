const WorkDayController = require('./controllers/WorkDayController')
const DealController = require('./controllers/DealController')

const parse = async message => {
    try {
        const frame = JSON.parse(message)
        let responseFrame
        switch (frame.type) {
            case 'close_active_sessions':
                return Promise.resolve({
                    response: null,
                    broadcast: null
                })
            case 'request_get_active_clients':
                return Promise.resolve({
                    response: null,
                    broadcast: null
                })
            case 'request_start_workday':
                let workday = await WorkDayController.create({...frame.model})
                responseFrame = {
                    type: 'add_workday',
                    model: workday
                }
                if (frame.request) {
                    responseFrame.response = {
                            id: frame.request.id,
                            info: `Начат рабочий день для сотрудника ${workday.user.full_name || ''}`
                        }
                }
                return Promise.resolve({
                    response: null,
                    broadcast: JSON.stringify(responseFrame)
                })
            case 'request_get_deals':
                let deals = await DealController.index({...frame.model})
                let mutation = {name: 'SET_DEALS', data: deals}
                responseFrame = {
                    type: 'instruction',
                    model: {
                        mutations: [mutation]
                    }
                }
                if (frame.request) {
                    responseFrame.response = { id: frame.request.id }
                }
                return Promise.resolve({
                    response: JSON.stringify(responseFrame),
                    broadcast: null
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
