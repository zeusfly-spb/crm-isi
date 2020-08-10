const models = require('../models')
const Expense = models.Expense

const getExpense = ({id, include = []}) => {
    Expense.findByPk(id, {include: include})
        .then(res => {
            return res
        })
        .catch(e => throw e)
}

module.exports = {
    getExpense: getExpense
}

