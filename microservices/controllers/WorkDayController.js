const { Op } = require("sequelize")
const models = require('../models')
const WorkDay = models.WorkDay
const moment = require('moment')

const index = async data => {
    try {
        let where
        data.island_id ?
            where = {[Op.and]: [{created_at: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]} :
            where = {created_at: {[Op.startsWith]: data.date}}
        let workdays = await WorkDay
            .findAll({where:where, include: ['user']})
        let result = workdays.sort((a, b) => a.id - b.id)
        return Promise.resolve(result)
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

