<script setup>
import { defineProps, defineEmits } from 'vue'
import RecipeImage from './RecipeImage.vue'
import RecipeContent from './RecipeContent.vue'
import ActionButtons from './ActionButtons.vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggleFavorite', 'likeRecipe', 'dislikeRecipe', 'showComments'])

const handleToggleFavorite = () => {
  emit('toggleFavorite', props.recipe)
}

const handleLikeRecipe = () => {
  emit('likeRecipe', props.recipe)
}

const handleDislikeRecipe = () => {
  emit('dislikeRecipe', props.recipe)
}

const handleShowComments = () => {
  emit('showComments', props.recipe)
}
</script>

<template>
  <div class="recipe-card">
    <!-- Recipe Image -->
    <RecipeImage :image="recipe.image" :name="recipe.name" />
    
    <!-- Recipe Content -->
    <RecipeContent :recipe="recipe" />
    
    <!-- Side Action Buttons -->
    <ActionButtons 
      :recipe="recipe"
      @toggle-favorite="handleToggleFavorite"
      @like-recipe="handleLikeRecipe"
      @dislike-recipe="handleDislikeRecipe"
      @show-comments="handleShowComments"
    />
  </div>
</template>

<style scoped>
.recipe-card {
  width: 90vw;
  height: 100%;
  display: flex;
  scroll-snap-align: center;
  background: #2d2d2d;
  border-right: 1px solid #404040;
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .recipe-card {
    flex-direction: column;
  }
}
</style> 