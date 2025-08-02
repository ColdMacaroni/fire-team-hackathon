<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  instructions: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="recipe-instructions">
    <h3>Instructions:</h3>
    <p class="instructions-text">{{ instructions }}</p>
  </div>
</template>

<style scoped>
.recipe-instructions {
  display: flex;
flex-direction: column;
align-items: flex-start;
gap: 10px;
align-self: stretch;
}

.recipe-instructions h3 {
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

.instructions-text {
  color: #FFF;
  font-family: "Merriweather Sans";
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 125.725%; /* 25.145px */
  text-align: justify;
}

</style> 