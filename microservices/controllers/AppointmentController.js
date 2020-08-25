const models = require('../models')
const Appointment = models.Appointment
const { Op } = require("sequelize")


const index = async data => {
    try {
        let dateArr = data.date.split('-')
        dateArr.pop()
        let month = dateArr.join('-')
        let where
        data.island_id ?
            where = {[Op.and]: [{date: {[Op.startsWith]: month}}, {island_id: data.island_id}]} :
            where = {date: {[Op.startsWith]: month}}
        let appointments = await Appointment.findAll({where: where, include: {all: true}})
        return Promise.resolve(appointments)
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    index
}
