const { Op } = require("sequelize")
const models = require('../models')
const Customer = models.Customer

const index = async data => {
    try {
        const customers =  await Customer.findAll({
            where: {created_at: {[Op.startsWith]: data.date}},
            include: {all: true}
        })
        const mutations = [{name: 'SET_CUSTOMERS', data: customers}]
        return Promise.resolve({mutations})
    } catch (e) {
        return Promise.reject(new Error(`Load customers failed: ${e}`))
    }
}

module.exports = {
    index
}
