const axios = require('axios')
const FormData = require('form-data')

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
        return Promise.resolve(response.data)
    } catch (e) {
        return Promise.reject(new Error(`Send sms error: ${e}`))
    }
}

module.exports = {
    sendSms
}   