const { Op } = require("sequelize")
const models = require('../models')
const WorkDay = models.WorkDay
const Deal = models.Deal
const Expense = models.Expense
const HandOver = models.HandOver

const loadDailyPage = async data => {
    try {
        let workDayWhere = data.island_id ?
            {[Op.and]: [{date: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]} :
            {date: {[Op.startsWith]: data.date}}
        let where = data.island_id ?
            {[Op.and]: [{created_at: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]} :
            {created_at: {[Op.startsWith]: data.date}}
        let workdays = await WorkDay.findAll({where: workDayWhere, include: ['user', 'time_breaks']})
        let deals = await Deal.findAll({where: where, include: {all: true}, order: [['id', 'ASC']]})
        let expenses = await Expense.findAll({where: where, include: ['user']})
        let handovers = data.island_id ? await HandOver.findOne({where: where}) : await HandOver.findAll({where: where})
        let handover = Array.isArray(handovers) ? handovers.reduce((a, b) => a + b.amount, 0) : handovers && handovers.amount || 0
        return Promise.resolve({
            workdays,
            deals,
            expenses,
            handover
        })
    } catch (e) {
        return Promise.reject(new Error(`Ошибка загрузки данных дневного учета:  ${e}`))
    }
}

module.exports = {
    loadDailyPage
}
