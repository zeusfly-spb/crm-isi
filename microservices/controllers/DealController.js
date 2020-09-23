const models = require('../models')
const Deal = models.Deal
const { Op } = require("sequelize")

const index = async data => {
    try {
        let where
        data.island_id ?
            where = {[Op.and]: [{created_at: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]} :
            where = {created_at: {[Op.startsWith]: data.date}}
        let deals = await Deal.findAll({where: where,include: {all: true}, order: [['id', 'ASC']]})
        return Promise.resolve(deals)
    } catch (e) {
        return Promise.reject(e)
    }
}

const updatePaymentType = async data => {
    try {
        let deal = await Deal.findByPk(data.deal_id, {include: {all: true}})
        deal.is_cache = data.is_cache
        await deal.save({fields: ['is_cache']})
        return Promise.resolve(deal)
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    index,
    updatePaymentType
}
