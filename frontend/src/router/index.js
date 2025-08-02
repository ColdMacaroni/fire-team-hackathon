import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import RecipePage from '../views/RecipePage.vue'
import CreatePage from '../views/CreatePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/recipe',
    name: 'Recipe',
    component: RecipePage
  },
  {
    path: '/create',
    name: 'Create',
    component: CreatePage 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 