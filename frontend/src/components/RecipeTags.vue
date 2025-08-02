<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="recipe-tags">
    <p>Tags:
    <span 
      v-for="tag in tags" 
      :key="tag" 
      class="tag"
    >
      {{ tag }}
  </span>
  </p>
  </div>
</template>

<style scoped>
.recipe-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  color: #FFF;
font-family: "Merriweather Sans";
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: 125.725%; /* 22.631px */
}

.tag {
padding: 0 3px;
background: #472D2D;
color: #FFF;
font-family: "Merriweather Sans";
font-size: 14px;
height: fit-content;
}
p{
  height: fit-content;
}
</style> 