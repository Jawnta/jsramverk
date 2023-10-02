import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import allTickets from '../components/allTickets.vue'
import trainDetailView from '../components/trainDetailView.vue'

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
        }
    ]
})

export default router
