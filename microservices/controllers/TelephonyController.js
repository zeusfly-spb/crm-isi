const axios = require('axios')
const moment = require('moment')

const sendSms = async data => {
    try {
        const form_params = {
            base_type: 'isi',
            user_id: data['user_id'] ? $data['user_id'] : 0,
            extension: data['extension'],
            phone: data['phone'],
            text: data['text']
        }
        const response = await axios.post('https://crmkin.ru/tel/api/vpbx/sms/send', {...form_params})
        return Promise.resolve(response.status)
    } catch (e) {
        return Promise.reject(new Error(`Send sms error: ${e}`))
    }
}

const substituteEventText = ({text, event = null}) => {
    if (!event) {
        return text
    }
    const time = moment(data.event.date).format('hh:mm')
    const date = moment(data.event.date).format('DD/MM/YYYY')
    let result = text.replace('||TIME||', time)
    return result.replace('||DATE||', date)
}

module.exports = {
    sendSms,
    substituteEventText
}   