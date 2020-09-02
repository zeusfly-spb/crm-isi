const CONFIG = require('./config')
const moment = require('moment')
const chalk = require('chalk')
const { broadcast } = require('./transmitter')

const salaryController = require('./controllers/SalaryController')

const clearDate = datetime => datetime.includes('T') ? datetime.split('T')[0] : datetime.split(' ')[0]
const targetRow = event => event.type === 'DELETE' ? event.affectedRows[0].before : event.affectedRows[0].after
const targetDate = event => moment(['appointments', 'work_days']
    .includes(event.table) ? targetRow(event).date : targetRow(event).created_at)
    .format('YYYY-MM-DD HH:mm:ss')

const cacheSalary = event => {
    console.time('Cache salary month data')
    Promise.all([
        salaryController.cacheMonthData({date: clearDate(targetDate(event)), island_id: targetRow(event).island_id}),
        salaryController.cacheMonthData({date: clearDate(targetDate(event))})
    ])
        .then(() => console.timeEnd('Cache salary month data'))
}

const performLead = event => event.type === 'INSERT' ?
    broadcast(JSON.stringify({type: 'add_lead', model: event.affectedRows[0].after})) : null

const performDeal = event => cacheSalary(event)

const performWorkDay = event => event.type === 'UPDATE' && event.affectedColumns.includes('working_hours') ?
        cacheSalary(event) : null

const performAppointment = event => {
    let needFields = ['status_id', 'performer_id', 'user_id', 'date']
    if(needFields.some(field => event.affectedColumns.includes(field))) {
        const beforeStatusDone = event.affectedRows[0].before && event.affectedRows[0].before.status_id === 4 || false
        const afterStatusDone = event.affectedRows[0].after && event.affectedRows[0].after.status_id === 4 || false
        beforeStatusDone || afterStatusDone ? cacheSalary(event) : null
    }
}

const inspect = event => {
    if (event.schema !== CONFIG.db_name) {
        return
    }
    if (['prepays', 'prizes', 'sicks', 'vacations'].includes(event.table)) {
        cacheSalary(event)
        return
    }
    switch (event.table) {
        case 'appointments':
            performAppointment(event)
            break
        case 'deals':
            performDeal(event)
            break
        case 'leads':
            performLead(event)
            break
        case 'work_days':
            performWorkDay(event)
            break
        default: break
    }
}

module.exports = {
    inspect
}
