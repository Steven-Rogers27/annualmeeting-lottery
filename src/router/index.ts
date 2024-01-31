import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import AllPerson from '../components/AllPerson.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes: [
    {
      path: '/',
      component: Home, 
    },
    {
      path: '/person',
      component: AllPerson,
    },
  ],
})

export default router