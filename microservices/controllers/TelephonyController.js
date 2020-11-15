const axios = require('axios')
const moment = require('moment')
const models = require('../models')
const SmsReport = models.SmsReport
const Island = models.Island

const sendSms = async data => {
    try {
        const form_params = {
            base_type: 'isi',
            user_id: data['user_id'] || 0,
            extension: data['extension'],
            phone: data['phone'],
            text: data['text']
        }
        const response = await axios.post('https://crmkin.ru/tel/api/vpbx/sms/send', {...form_params})
        if (response.status === 200) {
            await SmsReport.create({
                number: data['phone'],
                text: data['text'],
                user_id: data['user_id'] || 0,
                island_id: data['island_id'] || 0
            })
            
        }
        return Promise.resolve(response.status)
    } catch (e) {
        return Promise.reject(new Error(`Send sms error: ${e}`))
    }
}

const substituteEventText = ({text = '', event = null}) => {
    if (!event || !event.date) {
        return text
    }
    const time = moment(event.date).format('hh:mm')
    const date = moment(event.date).format('DD/MM/YYYY')
    let result = text.replace('||TIME||', time)
    return result.replace('||DATE||', date)
}

const eventCreatedNotify = event => {

}

module.exports = {
    sendSms,
    substituteEventText
}   