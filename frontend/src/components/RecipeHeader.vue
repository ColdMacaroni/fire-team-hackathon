<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="recipe-header">
    <h2 class="recipe-name">{{ recipe.name }}</h2>
    <div class="recipe-rank">
      <span class="fire-emoji">🔥</span>
      <span class="rank-number">{{ recipe.rank }}</span>
    </div>
  </div>
</template>

<style scoped>
.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.recipe-name {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  flex: 1;
}

.recipe-rank {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #4CAF50;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.fire-emoji {
  font-size: 1.2rem;
}

.rank-number {
  font-weight: 700;
  color: #ffffff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-name {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .recipe-name {
    font-size: 1.3rem;
  }
}
</style> 