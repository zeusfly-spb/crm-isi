const models = require('../models')
const Deal = models.Deal
const { Op } = require("sequelize")

const index = async data => {
    try {
        let where
        data.island_id ?
            where = {[Op.and]: [{created_at: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]}
        :
            where = {created_at: {[Op.startsWith]: data.date}}
        return Promise.resolve(await Deal.findAll({where: where, include: ['action', 'customer', 'user']}))
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    index
}
