<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  instructions: {
    type: String,
    required: true
  }
})

// Format instructions to handle numbered lists properly
const formattedInstructions = computed(() => {
  if (!props.instructions) return ''
  
  // Split by newlines and process each line
  return props.instructions.split('\n').map((line, index) => {
    // If line starts with a number followed by a period, format it as a list item
    if (/^\d+\./.test(line.trim())) {
      return line.trim()
    }
    // If line is empty, return empty string
    if (line.trim() === '') {
      return ''
    }
    // Otherwise, return the line as is
    return line.trim()
  }).filter(line => line !== '').join('\n')
})
</script>

<template>
  <div class="recipe-instructions">
    <h3>Instructions:</h3>
    <div class="instructions-content">
      <div 
        v-for="(line, index) in formattedInstructions.split('\n')" 
        :key="index"
        class="instruction-line"
      >
        {{ line }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-instructions {
  margin-bottom: 2rem;
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
  text-align: left;
}

.instructions-content {
  color: #e0e0e0;
  line-height: 1.6;
}

.instruction-line {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  text-align: left;
}

.instruction-line:last-child {
  margin-bottom: 0;
}
</style> 