<script setup>
  import { ref, onMounted } from 'vue'
  import { useRecipes } from '../../composables/useRecipes'

  const { loadRecipeById } = useRecipes()

  const recipe = ref(null)

  onMounted(() => {
    recipe = loadRecipe()
  })
</script>
<template>
  <div class="large-card">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      alt="Image couldn't be loaded."
      class="recipe-image"
    />
    <div v-else class="recipe-image">
      <FontAwesomeIcon icon="fa-solid fa-image" />
    </div>
  </div>
</template>

<style scoped>
  .recipe-image {
    display: flex;
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    width: 330px;
    height: 250px;
    aspect-ratio: 33/25;
  }
</style>
