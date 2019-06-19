import Vue from 'vue'
import VueRouter from 'vue-router'
import {store} from '../store'

const RegisterView = require('../components/RegisterView.vue').default
const LoginView = require('../components/LoginView.vue').default
const HomeView = require('../components/HomeView.vue').default


Vue.use(VueRouter)

const routes = [
    {
        path: '/register',
        component: RegisterView,
        meta: {title: 'Регистрация', auth: false}
    },
    {
        path: '/login',
        component: LoginView,
        meta: {title: 'Авторизация', auth: false}
    },
    {
        path: '/home',
        component: HomeView,
        meta: {title: '', auth: true}
    },
]

export function createRouter() {
    const router = new VueRouter({
        routes
    })
    router.beforeEach((to, from, next) => {
        document.title = to.meta.title + ' ОСТРОВКИ'
        next()
    })
    return router
}
