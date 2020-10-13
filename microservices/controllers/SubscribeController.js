const models = require('../models')
const Subscribe = models.Subscribe
const moment = require('moment')

const index = async data => {
    try {
        const month = moment(data.date).format('YYYY-MM')
        const match = item => item.start_month === month || item.finish_month === month || item.start_month < month && item.finish_month > month
        let all = await Subscribe.findAll({where: {island_id: data.island_id}, include: {all: true}, order: [['start_date', 'ASC']]})
        return Promise.resolve(all.filter(subscribe => match(subscribe)))
    } catch (e) {
        return Promise.reject(new Error(`Failed to load subscribes: ${e}`))
    }
}

module.exports = {
    index
}
