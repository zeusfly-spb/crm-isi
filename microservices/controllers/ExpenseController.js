const models = require('../models')
const Expense = models.Expense

const find = async (id, include = []) => {
    try {
        let expense = Expense.findByPk(id, {include: include})
        if (expense) {
            return expense
        }
    } catch (e) {
        Promise.reject(e)
    }
}

const create = async (inputs = {}) => {
    try {
        return await Expense.create(inputs)
    } catch (e) {
        Promise.reject(e)
    }
}

module.exports = {
    find,
    create
}

