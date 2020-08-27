const { Op } = require("sequelize");
const models = require('../models')
const User = models.User
const Deal = models.Deal
const Island = models.Island

const monthDayCount = (date) => {
    if (date.split('-')[1] === '02') {
        return +date.split('-')[0] % 4 === 0 ? 29 : 28
    }
    return ['04', '06', '09', '11'].includes(date.split('-')[1]) ? 30 : 31
}

const monthDates = (date) => Array(monthDayCount(date))
        .fill(1)
        .map((item, index) => index + 1)
        .map(day => day < 10 ? `0${day}` : day)
        .map(day => `${date.split('-')[0]}-${date.split('-')[1]}-${day}`)

async function retrieveMonthData({date, island_id}) {
    try {
        const dates = monthDates(date)
        const islandId = +island_id
        const monthString = `${date.split('-')[0]}-${date.split('-')[1]}`
        const island = islandId ? await Island.findByPk(islandId, {include: ['users', 'workdays']}) : null

        let dealWhere
        if (!islandId) {
            dealWhere = { created_at: { [Op.startsWith]: monthString } }
        } else {
            dealWhere = { [Op.and]: [
                    { created_at: { [Op.startsWith]: monthString } },
                    { island_id: islandId }
                ] }
        }
        let deals = await Deal.findAll({where: dealWhere, include: ['user', 'action', 'product', 'type', 'size']})

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
                where: {id: userIds},
                include: ['workdays', 'prizes', 'forfeits', 'sicks', 'prepays', 'vacations', 'controlled_islands']
            })
        } else {
            users = await User.findAll({include: [
                'islands', 'prizes', 'workdays', 'forfeits', 'sicks', 'prepays', 'vacations', 'controlled_islands'
                ]})
            users = users.filter(item => item.islands.length > 0)
        }
        return Promise.resolve({
            dates: dates,
            allDeals: deals,
            users: users
        })
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = {
    retrieveMonthData
}
