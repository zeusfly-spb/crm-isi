const chalk = require('chalk')
const CONFIG = require('./config')
const moment = require('moment')
const { broadcast } = require('./transmitter')

const salaryController = require('./controllers/SalaryController')

const clearDate = datetime => datetime.includes('T') ? datetime.split('T')[0] : datetime.split(' ')[0]
const targetRow = event => event.type === 'DELETE' ? event.affectedRows[0].before : event.affectedRows[0].after
const targetDate = event => {
    switch(event.table) {
        case 'work_days':
            return moment(targetRow(event).date).format('YYYY-MM-DD HH:mm:ss')
        case 'appointments':
            return moment(targetRow(event).date).format('YYYY-MM-DD HH:mm:ss')
        default:
            return moment(targetRow(event).created_at).format('YYYY-MM-DD HH:mm:ss')
    }
}
/*
(['appointments', 'work_days']
    .includes(event.table) ? targetRow(event).date : targetRow(event).created_at).toISOString()

 */
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

/*
if (['deals', 'work_days', 'appointments', 'prepays', 'prizes', 'sicks', 'vacations'].includes(event.table)) {
    console.time('Caching salary month data')
    let row = event.type === 'DELETE' ? event.affectedRows[0].before : event.affectedRows[0].after
    let targetDate = (['appointments', 'work_days'].includes(event.table) ? row.date : row.created_at).toISOString()
    Promise.all([
        salaryController.cacheMonthData({date: clearDate(targetDate), island_id: row.island_id}),
        salaryController.cacheMonthData({date: clearDate(targetDate)})
    ])
        .then(() => console.timeEnd('Caching salary month data'))
}
 */

const inspect = event => {
    if (event.schema !== CONFIG.db_name) {
        return
    }
    switch (event.table) {
        case 'leads':
            performLead(event)
            break
        case 'deals':
            performDeal(event)
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
