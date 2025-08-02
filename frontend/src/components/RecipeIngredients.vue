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
  display: flex;
flex-direction: column;
align-items: flex-start;
gap: 10px;
align-self: stretch;
}

.recipe-ingredients h3 {
  color: #FFF;
font-family: Merriweather;
font-size: 24px;
font-style: normal;
font-weight: 400;
line-height: 125.725%; /* 30.174px */
height: fit-content;
margin: 0;
padding: 0;
}

.recipe-ingredients ul {
  display: flex;
  padding-left: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
}

.recipe-ingredients li {
  color: #FFF;
  font-family: "Merriweather Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 125.725%; /* 25.145px */
}
</style> 