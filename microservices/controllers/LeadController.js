const models = require('../models')
const Lead = models.Lead
const { Op } = require("sequelize")

const index = async data => {
    try {
        const order = [['id', 'DESC']]
        let include = ['event']
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
        return Promise.resolve({response, counts})
    } catch (e) {
        return Promise.reject(new Error(`Lead load error: ${e}`))
    }
}

module.exports = {
    index
}
