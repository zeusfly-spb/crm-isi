const { Op } = require("sequelize")
const models = require('../models')
const Deal = models.Deal
const DealAction = models.DealAction
const Subscribe = models.Subscribe
const Product = models.Product
const Type = models.Type
const Size = models.Size


const index = async data => {
    try {
        let where
        data.island_id ?
            where = {[Op.and]: [{created_at: {[Op.startsWith]: data.date}}, {island_id: data.island_id}]} :
            where = {created_at: {[Op.startsWith]: data.date}}
        let deals = await Deal.findAll({where: where,include: {all: true}, order: [['id', 'ASC']]})
        return Promise.resolve(deals)
    } catch (e) {
        return Promise.reject(e)
    }
}

const updatePaymentType = async data => {
    try {
        let deal = await Deal.findByPk(data.deal_id, {include: {all: true}})
        deal.is_cache = data.is_cache
        await deal.save()
        return Promise.resolve(deal)
    } catch (e) {
        return Promise.reject(e)
    }
}

const create = async data => {
    try {
        const newDealAction = await DealAction.findByPk(data.deal_action_id)
        if (['correction', 'prodDefect', 'islandDefect', 'alteration'].includes(newDealAction.type)) {
            data.income = data.expense = 0
        } else if (newDealAction.type === 'return') {
            data.expense = data.income
            data.income = 0
        }
        let dealParams = JSON.parse(JSON.stringify(data))
        delete dealParams.start_date
        const {id} = await Deal.create({...dealParams})
        const deal = await Deal.findByPk(id, {include: ['user', 'customer', 'action']})
        if (deal.action_type === 'subscribe') {
            await Subscribe.create({
                island_id: data.island_id,
                user_id: data.user_id,
                customer_id: data.customer_id,
                subscription_id: data.subscription_id,
                start_date: data.start_date
            })
        }
        if (!['correction', 'subscribe', 'service', 'return'].includes(deal.action_type)) {
            let comment
            const product = await Product.findByPk(data.product_id)
            if (product.description === 'good') {
                comment = `${deal.action.text} ${product.name}`
            } else {
                const type = await Type.findByPk(data.type_id)
                const size = await Size.findByPk(data.size_id)
                comment = `${deal.action.text} ${product.name} ${type.name} ${size.name}`
            }
            await deal.createStockAction({
                user_id: data.user_id,
                type: 'expense',
                island_id: data.island_id,
                product_id: data.product_id,
                type_id: data.type_id,
                size_id: data.size_id,
                count: 1,
                comment: comment
            })
        }
        return Promise.resolve(deal)
    } catch (e) {
        return Promise.reject(new Error(`Error creating deal: ${e}`))
    }
}

module.exports = {
    index,
    updatePaymentType,
    create
}
