<script setup>
import { ref, onMounted } from 'vue'
import RecipeCard from '../components/RecipeCard.vue'

const recipes = ref([])

// Load recipes from JSON file
const loadRecipes = async () => {
  try {
    const response = await fetch('/src/data/recipes.json')
    const data = await response.json()
    recipes.value = data.recipes
  } catch (error) {
    console.error('Error loading recipes:', error)
  }
}

// Interactive functions
const toggleFavorite = (recipe) => {
  recipe.isFavorited = !recipe.isFavorited
}

const likeRecipe = (recipe) => {
  recipe.likes++
}

const dislikeRecipe = (recipe) => {
  recipe.dislikes++
}

const showComments = (recipe) => {
  console.log(`Show comments for ${recipe.name}`)
}
onMounted(() => {
  loadRecipes()
})

</script>

<template>
  <div class="home-page">
    <div class="scroller-container">
      <div class="recipe-cards">
        <RecipeCard 
          v-for="recipe in recipes" 
          :key="recipe.id" 
          :recipe="recipe"
          @toggle-favorite="toggleFavorite"
          @like-recipe="likeRecipe"
          @dislike-recipe="dislikeRecipe"
          @show-comments="showComments"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  background: #1a1a1a;
  overflow: hidden;
}

.scroller-container {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
}

.recipe-cards {
  display: flex;
  height: 100%;
  min-width: max-content;
  padding: 0 5vw;
}
</style>