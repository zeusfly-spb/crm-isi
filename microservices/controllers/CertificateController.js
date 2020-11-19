const moment = require('moment')
const models = require('../models')
const Certificate = models.Certificate

const create = async data => {
    try {

    } catch (e) {
        return Promise.reject(new Error(`Certificate creating error: ${e}`))
    }
}

const index = async data => {
    try {
        let where = {island_id: data.island_id}
        const certificates = await Certificate.findAll({where})
        const mutations = [{name: 'SET_CERTIFICATES', data: certificates}]
        return Promise.resolve({mutations})
    } catch (e) {
        return Promise.reject(new Error(`Load certificates failed: ${e}`))
    }
}

module.exports = {
    index,
    create
}
