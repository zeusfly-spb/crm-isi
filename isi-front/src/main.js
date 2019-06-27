window.Cookies = require('js-cookie')
require('dotenv').config()

import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

import {store} from './store'

import {createRouter} from './router'
const router = createRouter()

import VeeValidate from 'vee-validate';
import VeeValidate_RU from 'vee-validate/dist/locale/ru';
Vue.use(VeeValidate, {
    locale:     'ru',
    dictionary: {
        ru: VeeValidate_RU,
    },
});

import 'moment/locale/ru';
import moment from 'moment';
moment.locale('ru');
import VueMoment from 'vue-moment';
Vue.use(VueMoment, {
    moment,
});

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

Vue.axios.defaults.headers.common['Accept'] = 'application/json'
Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
Vue.config.productionTip = false

Vue.axios.interceptors.response.use(
    response => {
        return response;
    },
    function(error) {
        if (error.response.status === 401) {
            router.replace('/login');
        }
        return Promise.reject(error.response);
    }
)

const token = Cookies.get('isi-token')
if (token) {
    Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    store.commit('SET_BASE_PATH', process.env.VUE_APP_BASE_URL)

    store.dispatch('setAuthUser')
        .then(() => {
            if (!store.getters.isSuperadmin) {
                store.dispatch('checkAccess')
            }
        })

        .then(() => {
            if (store.getters.isSuperadmin || store.getters.isAllowed) {
                store.dispatch('enterCRM')
                router.push('/home')
            } else {
                // store.dispatch('checkAccess')
                router.push('/access')
            }
        })
} else {
    store.dispatch('logOut')
        .then(() => router.push('/login'))
}

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
