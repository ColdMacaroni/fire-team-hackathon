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
  margin-bottom: 2rem;
}

.recipe-instructions h3 {
  color: #4CAF50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.instructions-text {
  margin-right: 2rem;
}

.recipe-instructions p {
  color: #e0e0e0;
  line-height: 1.6;
  white-space: pre-line;
}
</style> 