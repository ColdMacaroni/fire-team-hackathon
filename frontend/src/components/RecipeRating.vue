<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  rating: {
    type: Number,
    required: true
  }
})

// Star rating component
const starRating = computed(() => {
  const stars = []
  const fullStars = Math.floor(props.rating)
  const hasHalfStar = props.rating % 1 !== 0
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('⭐')
  }
  
  if (hasHalfStar) {
    stars.push('⭐')
  }
  
  const emptyStars = 5 - stars.length
  for (let i = 0; i < emptyStars; i++) {
    stars.push('☆')
  }
  
  return stars.join('')
})
</script>

<template>
  <div class="recipe-rating">
    <span class="stars">{{ starRating }}</span>
    <span class="rating-text">{{ rating }}/5</span>
  </div>
</template>

<style scoped>
.recipe-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stars {
  font-size: 1.2rem;
}

.rating-text {
  color: #e0e0e0;
  font-weight: 600;
}
</style> 