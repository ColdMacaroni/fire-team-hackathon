<script setup>
  defineProps({
    recipe: {
      type: Object,
      required: true,
    },
  })
</script>

<template>
  <div class="small-card" v-if="recipe">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      :alt="recipe.name"
      class="recipe-image"
    />
    <div v-else class="recipe-image">
      <FontAwesomeIcon icon="fa-solid fa-image" />
    </div>
    <div class="recipe-header">
      <div class="recipe-name">
        <h1>
          {{ recipe.name }}
        </h1>
      </div>
      <div class="recipe-rating">
        <p>🔥{{ recipe.likes }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .small-card {
    display: flex;
    padding-top: 10px;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    opacity: 0.3;
  }
  .recipe-image {
    background-color: #d9d9d9;
    width: 304px;
    height: 230px;
    aspect-ratio: 152/115;
  }
  .recipe-header {
    display: flex;
    width: 336px;
    padding: 0 15px;
    align-items: center;
  }
  .recipe-name h1 {
    color: #fff;
    font-family: Merriweather;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 125.725%; /* 45.261px */
  }
  .recipe-rating p {
    color: #fff;
    text-align: center;
    font-family: 'Merriweather Sans';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
</style>
