import Vue from 'vue'
import VueRouter from 'vue-router'
import {store} from '../store'

const RegisterView = require('../components/RegisterView.vue').default
const LoginView = require('../components/LoginView.vue').default
const HomeView = require('../components/HomeView.vue').default
const AccessView = require('../components/AccessView.vue').default


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
    {
        path: '/access',
        component: AccessView,
        meta: {title: 'Доступы'}
    }
]

export function createRouter() {
    const originalPush = VueRouter.prototype.push
    VueRouter.prototype.push = function push (location) {
        return originalPush.call (this , location)
            .catch (err => err)
    }

    const router = new VueRouter({
        routes
    })
    router.beforeEach((to, from, next) => {
        document.title = to.meta.title + ' ОСТРОВКИ'
        next()
    })
    return router
}

