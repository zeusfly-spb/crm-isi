const models = require('../models')
const Appointment = models.Appointment
const { Op } = require("sequelize")


const index = async data => {
    try {
        let where
        data.island_id ?
            where = {[Op.and]: [{date: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]} :
            where = {date: {[Op.startsWith]: data.date}}
        let appointments = await Appointment.findAll({where: where, include: {all: true}})
        return Promise.resolve(appointments)
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    index
}
