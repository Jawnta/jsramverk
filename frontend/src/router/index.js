import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import allTickets from '../components/allTickets.vue'
import trainDetailView from '../components/trainDetailView.vue'
import loginPage from '../components/loginPage.vue'
import registerPage from '../components/registerPage.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/tickets',
            name: 'tickets',
            component: allTickets
        },
        {
            path: '/details/:trainNumber',
            name: 'details',
            component: trainDetailView,
            props: true
        },
        {
            path: '/details/:trainNumber/edit',
            name: 'edit',
            component: trainDetailView,
            props: true
        },
        {
            path: '/details/:trainNumber/edit/:ticketId',
            name: 'editTicket',
            component: trainDetailView,
            props: true
        },
        {
            path: '/login',
            name: 'login',
            component: loginPage
        },
        {
            path: '/register',
            name: 'register',
            component: registerPage
        }
    ]
})

router.beforeEach((to, from, next) => {
    console.log(to, from, next)
    next()
    // const isAuthenticated = false // Replace with your own authentication check
    // if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' })
    // else next()
})

export default router
