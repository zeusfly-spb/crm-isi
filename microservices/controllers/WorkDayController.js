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

const startUserDay = async data => {
    try {
        let info
        let workday
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const today = now.split(' ')[0]
        const currentWorkDay = await WorkDay.findOne({
            where: {island_id: data.island_id, date: {[Op.startsWith]: today}, user_id: data.user_id},
            include: ['user']
        })
        currentWorkDay ? await currentWorkDay.destroy() : null
        workday = await create(data)
        info = {text: `Добро пожаловать, ${workday.user.first_name} ${workday.user.patronymic}!`}
        return Promise.resolve({workday, info})
    } catch (e) {
        return Promise.reject(new Error(`Error starting user work day: ${e}`))
    }
}

const resumeUserDay = async data => {
    try {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const today = now.split(' ')[0]
        const workday = await WorkDay.findOne({
            where: {island_id: data.island_id, date: {[Op.startsWith]: today}, user_id: data.user_id},
            include: ['user']
        })
        await workday.update({time_finish: null})
        const info = {text: `С возвращением, ${workday.user.first_name} ${workday.user.patronymic}!`}
        return Promise.resolve({workday, info})
    } catch (e) {
        return Promise.reject(new Error(`Resume user workday failed: ${e}`))
    }
}

finishUserDay = async data => {
    try {
        const workday = await WorkDay
    } catch (e) {
        return Promise.reject(new Error(`Finish user day failed: ${e}`))
    }
}


module.exports = {
    index,
    create,
    startUserDay,
    resumeUserDay
}

