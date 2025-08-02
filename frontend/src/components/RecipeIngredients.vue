<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  ingredients: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="recipe-ingredients">
    <h3>Ingredients:</h3>
    <ul>
      <li 
        v-for="ingredient in ingredients" 
        :key="ingredient.ingredient"
      >
        {{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.ingredient }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.recipe-ingredients {
  margin-bottom: 2rem;
}

.recipe-ingredients h3 {
  color: #4CAF50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.recipe-ingredients ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recipe-ingredients li {
  color: #e0e0e0;
  padding: 0.25rem 0;
  font-size: 0.95rem;
}
</style> 