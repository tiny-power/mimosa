import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '/',
        component: () => import('@/views/home')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home')
    }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

router.beforeEach((to, from, next) => {
    next()
})

export default router
