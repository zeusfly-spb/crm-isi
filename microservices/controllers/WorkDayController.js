const { Op } = require("sequelize")
const models = require('../models')
const WorkDay = models.WorkDay
const moment = require('moment')

const index = async data => {
    try {
        const include = ['user']
        const order = [['id', 'ASC']]
        let where
        data.island_id ?
            where = {[Op.and]: [{date: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]} :
            where = {date: {[Op.startsWith]: data.date}}
        return Promise.resolve(await WorkDay.findAll({where, include, order}))
    } catch (e) {
        return Promise.reject(e)
    }
}

const create = async data => {
    try {
        let now = moment().format('YYYY-MM-DD HH:mm:ss')
        let workDay = await WorkDay
            .create({
                island_id: data.island_id,
                user_id: data.user_id,
                date: now.split(' ')[0],
                time_start: now.split(' ')[1]
            })
        let workdayId = workDay.id
        let result =  await WorkDay.findByPk(workdayId, {include: ['user']})
        return Promise.resolve(result)
    } catch (e) {
        return Promise.reject(e)
    }
}


module.exports = {
    index,
    create
}

