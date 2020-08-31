const mysql = require('mysql')
const mySqlEvents = require('@rodrigogs/mysql-events')
const CONFIG = require('./config')
const salaryController = require('./controllers/SalaryController')

const connection = mysql.createConnection({
    host: CONFIG.db_host,
    user: CONFIG.db_user,
    password: CONFIG.db_password
})

const { broadcast } = require('./transmitter')
const clearDate = datetime => datetime.includes('T') ? datetime.split('T')[0] : datetime.split(' ')[0]

const handleEvent = event => {
    if (event.schema !== CONFIG.db_name) {
        return
    }
    if (event.table === 'leads' && event.type === 'INSERT') {
        let frame = {
            type: 'add_lead',
            model: event.affectedRows[0].after
        }
        broadcast(JSON.stringify(frame))
    }
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
}

const program = async () => {
    const instance = new mySqlEvents(connection, {
        startAtEnd: true,
        excludedSchemas: {
            mysql: true
        }
    })
    await instance.start()
    instance.addTrigger({
        name: 'TEST',
        expression: '*',
        statement: mySqlEvents.STATEMENTS.ALL,
        onEvent: event => handleEvent(event)
    })
    instance.on(mySqlEvents.EVENTS.CONNECTION_ERROR, console.error)
    instance.on(mySqlEvents.EVENTS.ZONGJI_ERROR, console.error)
}

program()
    .then(() => console.log('Waiting for database events'))
    .catch(console.error)
