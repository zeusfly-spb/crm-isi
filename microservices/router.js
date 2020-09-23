const WorkDayController = require('./controllers/WorkDayController')
const DealController = require('./controllers/DealController')
const AppointmentController = require('./controllers/AppointmentController')
const SalaryController = require('./controllers/SalaryController')
const LoaderController = require('./controllers/LoaderController')

const parse = async message => {
    try {
        const frame = JSON.parse(message)
        const Instruction = ({name, data, info, conditions = []}) => {
        let response ={
            type: 'instruction',
            model: {
                mutations: [{name, data}]
            }
        }
        if (frame.request && frame.request.id) {
            response.response = {id: frame.request.id}
        }
        if (conditions.length) {
            response.conditions = conditions
        }
        if (info) {
            response.response.info = info
        }
        return JSON.stringify(response)
    }
        let responseFrame
        let mutation
        switch (frame.type) {
            case 'request_update_deal_payment':
                let instruction = Instruction({
                    name: 'UPDATE_DEAL',
                    data: await DealController.updatePaymentType({...frame.model})
                })
                return Promise.resolve({
                    response: null,
                    broadcast: instruction
                })
            case 'request_load_daily_page':
                return Promise.resolve({
                    response: Instruction({
                        name: 'SET_DAILY_PAGE',
                        data: await LoaderController.loadDailyPage({... frame.model})
                    }),
                    broadcast: null
                })
            case  'request_get_side_panel_events':
                return Promise.resolve({
                    response: Instruction({
                        name: 'SET_SIDE_PANEL_EVENTS', data: await AppointmentController.index({...frame.model, mode: 'day'})
                    }),
                    broadcast: null
                })
            case 'request_get_month_data':
                return Promise.resolve({
                    response: Instruction({
                        name: 'SET_MONTH_DATA', data: await SalaryController.retrieveMonthData({...frame.model})
                    }),
                    broadcast: null
                })
            case 'request_get_appointments':
                return Promise.resolve({
                    response: Instruction({
                        name: 'SET_APPOINTMENTS', data: await AppointmentController.index({...frame.model})
                    }),
                    broadcast: null
                })
            case 'request_get_workdays':
                return Promise.resolve({
                    response: Instruction({ name: 'SET_WORK_DAYS', data: await WorkDayController.index({...frame.model})}),
                    broadcast: null
                })
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
                mutation = {name: 'SET_DEALS', data: deals}
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
