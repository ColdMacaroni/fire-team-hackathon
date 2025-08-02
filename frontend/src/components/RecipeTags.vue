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
    <p>Tags:</p>
    <p 
      v-for="tag in tags" 
      :key="tag" 
      class="tag"
    >
      {{ tag }}
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
  display: flex;
padding: 0 3px;
justify-content: center;
align-items: center;
background: #472D2D;
color: #FFF;
font-family: "Merriweather Sans";
font-size: 14px;

}
</style> 