import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SavedView from '../views/SavedView.vue'
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
    path: '/saved',
    name: 'Saved',
    component: SavedView,
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
