const moment = require('moment')
const models = require('../models')
const Lead = models.Lead
const { Op } = require("sequelize")

const index = async data => {
    try {
        const today = moment().format('YYYY-MM-DD')
        const order = [['id', 'DESC']]
        let include = ['event', 'postpones', 'comments']
        let paginatorOptions = {
            pageIndex: +data.page && data.page - 1 || 0,
            pageSize: +data.per_page || 15
        }
        let where = {status: ['wait', data.status]}
        data.sites && data.sites.length ? where.site = data.sites : null
        if (data.name) {
            where = {... where,[Op.or]: [
                    {name: {[Op.startsWith]: data.name}},
                    {phone: {[Op.endsWith]: data.name}}
                ]
            }
        }
        let response = await Lead.paginate({... paginatorOptions, where, include, order})
        let leads = response.data.map(lead => ({
            ...lead,
            postpones: lead.postpones.reverse(),
            comments: lead.comments.reverse()
        }))
        let paginator_data = {
            total: response.meta.total,
            lastPage: response.meta.last,
            perPage: response.meta.pageSize,
            currentPage: response.meta.current + 1
        }
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
        let call_today = await Lead.findAll({
            include: ['postpones', 'comments'], where: {status: 'process'}, order: [['id', 'ASC']]
        })
        call_today = call_today.filter(lead => lead.last_postpone_date === today)
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
