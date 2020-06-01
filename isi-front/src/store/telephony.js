import Vue from 'vue'

export default {
    actions: {
        sendSMS ({dispatch, getters, rootState}, data) {
            return new Promise((resolve, reject) => {
            Vue.axios.post('https://crmkin.ru/tel/api/vpbx/sms/send', {
                    base_type: 'isi',
                    user_id: rootState.authUser.id,
                    extension: getters.currentVpbxExtension,
                    phone: data.number,
                    text: data.text
                })

                    .then(res => {
                        dispatch('pushMessage', {
                            text: `СМС отправлено на номер ${data.number}`
                        })
                        resolve(res)
                    })
                    .catch(e => reject(e))
            })
        }
    }
}
