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
    <div class="recipe-content-inner">

    <!-- Header with name and rank -->
    <RecipeHeader :recipe="recipe" />
    
    <!-- Rating -->
    <RecipeRating :rating="recipe.rating" />
    
    <!-- Tags -->
    <RecipeTags :tags="recipe.tags" />
    </div>
    
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

.recipe-content-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
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