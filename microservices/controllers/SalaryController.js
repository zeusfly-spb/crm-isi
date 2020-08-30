const { Op } = require("sequelize");
const models = require('../models')
const User = models.User
const Deal = models.Deal
const Island = models.Island
const Appointment = models.Appointment

const monthDayCount = date => {
    if (date.split('-')[1] === '02') {
        return +date.split('-')[0] % 4 === 0 ? 29 : 28
    }
    return ['04', '06', '09', '11'].includes(date.split('-')[1]) ? 30 : 31
}

const monthDates = date => Array(monthDayCount(date))
        .fill(1)
        .map((item, index) => index + 1)
        .map(day => day < 10 ? `0${day}` : day)
        .map(day => `${date.split('-')[0]}-${date.split('-')[1]}-${day}`)
const retrieveMonthData = async ({date, island_id}) => {
    try {
        const appCount = user => {

            let field = user.is_admin ? 'user_id' : 'performer_id'
            return allAppointments
                .filter(item => +item[field] === +user.id)
                .length
        }
        const dateArr = date.split('-')
        const userInclude = ['workdays', 'prizes', 'forfeits', 'sicks', 'prepays', 'vacations', 'controlled_islands', 'group', 'islands']
        const dates = monthDates(date)
        const islandId = +island_id
        const monthString = `${dateArr[0]}-${dateArr[1]}`
        const island = islandId ? await Island.findByPk(islandId, {include: ['users', 'workdays']}) : null
        let commonWhere
        if (!islandId) {
            commonWhere = { created_at: { [Op.startsWith]: monthString } }
        } else {
            commonWhere = { [Op.and]: [
                    { created_at: { [Op.startsWith]: monthString } },
                    { island_id: islandId }
                ] }
        }
        const allDeals = await Deal.findAll({where: commonWhere, include: ['user', 'action', 'product', 'type', 'size']})
        const allAppointments = await Appointment.findAll({where: commonWhere})
        let usersMainWhere = { [Op.or]: [
                {fired_at: { [Op.is]: null } },
                {fired_at: { [Op.between]: [dates[0], dates[dates.length - 1]] } }
            ]}
        let users
        if (island) {
            let userIds
            let salaryDisplay = island.options && island.options.salary_display || 'attach'
            switch (salaryDisplay) {
                case 'attach':
                    userIds = island.users.map(user => +user.id)
                    break
                case 'time':
                    userIds = island.workdays
                        .filter(workday => workday.created_at >= dates[0] && workday.created_at <= dates[dates.length - 1])
                        .map(item => +item.user_id)
                    break
                case 'attach_time':
                    let attached = island.users.map(user => +user.id)
                    let byTime = sland.workdays
                        .filter(workday => workday.created_at >= dates[0] && workday.created_at <= dates[dates.length - 1])
                        .map(item => +item.user_id)
                    userIds = [... attached, ... byTime]
                    break
                case 'selected':
                    userIds = island.options && island.options.selected_user_ids || []
                    break
            }
            users = await User.findAll({
                where: { [Op.and]: [{id: userIds}, usersMainWhere] },
                include: userInclude
            })
        } else {
            users = await User.findAll({where: usersMainWhere, include: userInclude})
            users = users.filter(item => item.islands.length > 0)
        }

        return Promise.resolve({
            allDeals,
            dates,
            users,
            allAppointments
        })
    } catch (e) {
        return Promise.reject(new Error('Ошибка получения данных месяца: ' + e))
    }
}

const cacheMonthData = async ({date, island_id}) => {

}

module.exports = {
    retrieveMonthData
}
