const models = require('../models')
const Appointment = models.Appointment
const { Op } = require("sequelize")

const firstWeekDay = date => {
    let curr = new Date(date)
    let first = curr.getDate() - curr.getDay() + 1
    return new Date(curr.setDate(first)).toISOString().split('T')[0]
}

const lastWeekDay = date => {
    let curr = new Date(date)
    let last = curr.getDate() - curr.getDay() + 7
    return new Date(curr.setDate(last)).toISOString().split('T')[0]
}


const index = async data => {
    try {
        let where
        switch (data.mode) {
            case 'month':
                let dateArr = data.date.split('-')
                dateArr.pop()
                let month = dateArr.join('-')
                where = {[Op.and]: [{date: {[Op.startsWith]: month}}, {island_id: data.island_id}]}
                break
            case 'week':
                let start = firstWeekDay(data.date)
                let end = lastWeekDay(data.date)
                where = {
                    [Op.and]: [
                        {date: {[Op.between]: [firstWeekDay(data.date), lastWeekDay(data.date)]}},
                        {island_id: data.island_id}
                    ]
                }
                break
            case 'day':
                where = {[Op.and]: [{date: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]}
                break
            default: return Promise.reject(new Error('Не указан период для загрузки записей'))
        }
        let appointments = await Appointment.findAll({where: where, include: {all: true}})
        return Promise.resolve(appointments)
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    index
}
