import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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
      path: '/details/:trainNumber',
      name: 'details',
      component: trainDetailView,
      props: true,
    }
  ]
})

export default router
