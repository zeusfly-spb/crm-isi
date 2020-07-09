const { query } = require('../orm')
const table = 'users'
const getUsers = async () => {
    try {
        let users = await query(`SELECT * FROM ${table};`)
        return Promise.resolve(users)
    } catch (e) {
        return Promise.reject(e)
    }
}
module.exports = {
    getUsers: getUsers
}
