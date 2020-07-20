const orm = require('../orm')
// const table = __filename.split(/[\\/]/).pop().split('.')[0]
const table = 'document_packs'

const find = async id => {
    try {
        let result = await orm.query(`SELECT * FROM ${table} WHERE id = ${id};`)
        return Promise.resolve(result)
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    find: find
}
