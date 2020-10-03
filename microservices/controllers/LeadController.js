const moment = require('moment')
const models = require('../models')
const Lead = models.Lead
const Postpone = models.Postpone
const { Op } = require("sequelize")
const cache = require('../cache')
const chalk = require('chalk')

const index = async data => {
    try {
        const today = moment().format('YYYY-MM-DD')
        const orders = [['id', 'DESC']]
        let include = {all: true}
        let paginatorOptions = {
            pageIndex: data.page && data.page - 1 || 0,
            pageSize: data.per_page || 15
        }
        let where = {status: data.status}
        data.sites && data.sites.length ? where.site = data.sites : null
        if (data.name) {
            where = {... where,[Op.or]: [
                    {name: {[Op.startsWith]: data.name}},
                    {phone: {[Op.endsWith]: data.name}}
                ]
            }
        }
        let response = await Lead.paginate({... paginatorOptions, where, include, orders})
        let leads = response.data
        let counts
        if (data.sites && data.sites.length) {
            counts = {
                all: await Lead.count({where: {site: data.sites}, status: {[Op.ne]: 'done'}}),
                wait: await Lead.count({where: {site: data.sites, status: 'wait'}}),
                process: await Lead.count({where: {site: data.sites, status: 'process'}}),
                done: await Lead.count({where: {site: data.sites, status: 'done'}}),
                moderate: await Lead.count({where: {site: data.sites, status: 'moderate'}}),
            }
        } else {
            counts = {
                all: await Lead.count({where: {status: {[Op.ne]: 'done'}}}),
                wait: await Lead.count({where: {status: 'wait'}}),
                process: await Lead.count({where: {status: 'process'}}),
                done: await Lead.count({where: {status: 'done'}}),
                moderate: await Lead.count({where: {status: 'moderate'}}),
            }
        }

        let paginator_data = {
            total: counts[data.status] || null,
            lastPage: response.meta.last,
            perPage: response.meta.pageSize,
            currentPage: response.meta.current + 1
        }

        const call_today_name = `call_today_${today}`
        let call_today
        if (await cache.Has(call_today_name)) {
            call_today = JSON.parse(await cache.Get(call_today_name))
            console.log(chalk.blue.bold.inverse('Call today leads loads from cache'))
        } else {
            let todayPostpones = await Postpone.findAll({
                where: {date: {[Op.startsWith]: today}},
                attributes: ['lead_id']
            })
            let todayLeadIds = todayPostpones.map(postpone => postpone.lead_id)
            call_today = await Lead.findAll({
                where: {id: todayLeadIds, status: 'process'},
                include: ['postpones', 'comments']
            })
            call_today = call_today.filter(lead => lead.last_postpone_date === today)
            await cache.Set(call_today_name, JSON.stringify(call_today))
            console.log(chalk.green.bold.inverse('Call today cache saved'))
        }

        return Promise.resolve({
            leads,
            paginator_data,
            counts,
            call_today
        })
    } catch (e) {
        return Promise.reject(new Error(`Leads load error: ${e}`))
    }
}

module.exports = {
    index
}
