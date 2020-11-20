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
        const certificates = await Certificate.findAll({where, include: ['customer']})
        const mutations = [{name: 'SET_CERTIFICATES', data: certificates}]
        return Promise.resolve({mutations})
    } catch (e) {
        return Promise.reject(new Error(`Load certificates failed: ${e}`))
    }
}

const addComment = async data => {
    try {
        const {id, user_id, text} = data
        const cert = await Certificate.findByPk(id, {include: ['customer']})
        await cert.addComment({text, user_id})
        const mutations = [{name: 'UPDATE_CERTIFICATE', data: cert}]
        const info = {text: 'К сертификату добавлен комментарий'}
        const conditions = [{name: 'workingIslandId', compare: 'includes', value: [0, cert.island_id]}]
        return Promise.resolve({mutations, info, conditions})
    } catch (e) {
        return Promise.reject(new Error(`Add certificate comment failed: ${e}`))
    }
}

module.exports = {
    index,
    create,
    addComment
}
