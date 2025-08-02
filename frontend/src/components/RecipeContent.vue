<script setup>
import { defineProps } from 'vue'
import RecipeHeader from './RecipeHeader.vue'
import RecipeRating from './RecipeRating.vue'
import RecipeTags from './RecipeTags.vue'
import RecipeIngredients from './RecipeIngredients.vue'
import RecipeInstructions from './RecipeInstructions.vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="recipe-content">
    <!-- Header with name and rank -->
    <RecipeHeader :recipe="recipe" />
    
    <!-- Rating -->
    <RecipeRating :rating="recipe.rating" />
    
    <!-- Tags -->
    <RecipeTags :tags="recipe.tags" />
    
    <!-- Ingredients -->
    <RecipeIngredients :ingredients="recipe.ingredients" />
    
    <!-- Instructions -->
    <RecipeInstructions :instructions="recipe.instructions" />
  </div>
</template>

<style scoped>
.recipe-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  color: #ffffff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .recipe-content {
    padding: 1rem;
  }
}
</style> 