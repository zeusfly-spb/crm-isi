const moment = require('moment')
const WorkDayController = require('./controllers/WorkDayController')
const DealController = require('./controllers/DealController')
const AppointmentController = require('./controllers/AppointmentController')
const SalaryController = require('./controllers/SalaryController')
const LoaderController = require('./controllers/LoaderController')
const LeadController = require('./controllers/LeadController')
const SubscribeController = require('./controllers/SubscribeController')
const StockActionsController = require('./controllers/StockActionController')

const parse = async message => {
    try {
        const frame = JSON.parse(message)
        const Instruction = ({ mutations,conditions, info }) => {
            let response ={
                type: 'instruction',
                model: { mutations, conditions, info}
            }
            if (frame.request && frame.request.id) {
                response.response = {id: frame.request.id}
            }
            return JSON.stringify(response)
        }

        let responseFrame
        let mutation, mutations, conditions
        switch (frame.type) {
            case 'request_start_user_day':
                let data = await WorkDayController.startUserDay({...frame.model})
                mutations = [{name: 'ADD_WORK_DAY', data: data.workday}]
                conditions = [
                    {name: 'isToday', value: true, compare: 'equal'},
                    {name: 'currentPage', value: 'daily', compare: 'equal'},
                    {name: 'workingIslandId', value: [0, data.workday.island_id], compare: 'includes'},
                ]
                return Promise.resolve({
                    response: Instruction({info: data.info}),
                    broadcast: Instruction({mutations, conditions})
                })
            case 'request_get_stock_actions':
                mutations = [{name: 'SET_STOCK_ACTIONS', data: await StockActionsController.index({...frame.model})}]
                return Promise.resolve({
                    response: Instruction({mutations}),
                    broadcast: null
                })
            case 'request_add_deal':
                let {deal, info, stockAction} = await DealController.create({...frame.model})
                mutations = [{name: 'ADD_DEAL', data: deal}]
                conditions = [
                    {name: 'accountingDate', value: moment(deal.created_at).format('YYYY-MM-DD'), compare: 'equal'},
                    {name: 'workingIslandId', value: [0, deal.island_id], compare: 'includes'},
                ]
                stockAction ? mutations.push({name: 'ADD_STOCK_ACTION', data: stockAction}) : null
                return Promise.resolve({
                    response: Instruction({info}),
                    broadcast: Instruction({mutations, conditions})
                })
            case 'request_get_inactive_subscribes':
                mutations = [{name: 'SET_INACTIVE_SUBSCRIBES', data: await SubscribeController.inactive({...frame.model})}]
                return Promise.resolve({
                    response: Instruction({mutations}),
                    broadcast: null
                })
            case 'request_get_all_subscribes':
                mutations = [{name: 'SET_ALL_SUBSCRIBES', data: await SubscribeController.all({...frame.model})}]
                return Promise.resolve({
                    response: Instruction({mutations}),
                    broadcast: null
                })
            case 'request_get_subscribes':
                mutations = [{name: 'SET_SUBSCRIBES', data: await SubscribeController.index({...frame.model})}]
                return Promise.resolve({
                    response: Instruction({mutations}),
                    broadcast: null
                })
            case 'request_get_leads':
                const response = await LeadController.index({...frame.model})
                mutations = [
                    {name: 'SET_COUNTS', data: response.counts},
                    {name: 'SYNC_PAGINATION', data: response.paginator_data},
                    {name: 'SET_LEADS', data: response.leads}
                ]
                return Promise.resolve({
                    response: Instruction({mutations}),
                    broadcast: null
                })
            case 'request_update_deal_payment':
                mutations = [
                    {name: 'UPDATE_DEAL', data: await DealController.updatePaymentType({...frame.model})}
                ]
                let instruction = Instruction({ mutations })
                return Promise.resolve({
                    response: null,
                    broadcast: instruction
                })
            case 'request_load_daily_page':
                mutations = [
                    { name: 'SET_DAILY_PAGE', data: await LoaderController.loadDailyPage({... frame.model})}
                ]
                return Promise.resolve({
                    response: Instruction({ mutations }),
                    broadcast: null
                })
            case  'request_get_side_panel_events':
                mutations = [
                    { name: 'SET_SIDE_PANEL_EVENTS', data: await AppointmentController.index({...frame.model, mode: 'day'}) }
                ]
                return Promise.resolve({
                    response: Instruction({ mutations }),
                    broadcast: null
                })
            case 'request_get_month_data':
                mutations = [
                    { name: 'SET_MONTH_DATA', data: await SalaryController.retrieveMonthData({...frame.model})}
                ]
                return Promise.resolve({
                    response: Instruction({ mutations }),
                    broadcast: null
                })
            case 'request_get_appointments':
                mutations = [
                    { name: 'SET_APPOINTMENTS', data: await AppointmentController.index({...frame.model}) }
                ]
                return Promise.resolve({
                    response: Instruction({ mutations }),
                    broadcast: null
                })
            case 'request_get_workdays':
                mutations = [
                    { name: 'SET_WORK_DAYS', data: await WorkDayController.index({...frame.model})}
                ]
                return Promise.resolve({
                    response: Instruction({ mutations }),
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
