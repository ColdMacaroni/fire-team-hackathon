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
    <span 
      v-for="tag in tags" 
      :key="tag" 
      class="tag"
    >
      {{ tag }}
    </span>
  </div>
</template>

<style scoped>
.recipe-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tag {
  background: #4CAF50;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}
</style> 