const orm = require('../orm')
const table = __filename.split(/[\\/]/).pop().split('.')[0]

const find = async id => {
    try {
        let result = await orm.query(`SELECT * FROM ${table} WHERE id = ${id}`)
        return Promise.resolve(orm.serialize(result))
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    find: find
}
