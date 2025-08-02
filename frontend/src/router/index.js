import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GenerateView from '../views/GenerateView.vue'
import ExploreView from '../views/ExploreView.vue'
import CreateView from '../views/CreateView.vue'
import RecipeView from '../views/RecipeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/generate',
    name: 'Generate',
    component: GenerateView,
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateView,
  },
  {
    path: '/explore',
    name: 'Explore',
    component: ExploreView,
  },
  {
    path: '/recipe/:id',
    name: 'Recipe',
    component: RecipeView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
