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
    stars.push('filled')
  }
  
  if (hasHalfStar) {
    stars.push('half')
  }
  
  const emptyStars = 5 - stars.length
  for (let i = 0; i < emptyStars; i++) {
    stars.push('empty')
  }
  
  return stars
})
</script>

<template>
  <div class="recipe-rating">
    <div class="stars">
      <svg 
        v-for="(starType, index) in starRating" 
        :key="index"
        class="star"
        :class="starType"
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
          :fill="starType === 'filled' ? '#FFD700' : starType === 'half' ? 'url(#halfGradient)' : 'none'"
          :stroke="starType === 'empty' ? '#666' : 'none'"
          stroke-width="1"
        />
        <defs v-if="starType === 'half'">
          <linearGradient id="halfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" style="stop-color:#FFD700;stop-opacity:1" />
            <stop offset="50%" style="stop-color:transparent;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <span class="rating-text">{{ rating }}/5</span>
  </div>
</template>

<style scoped>
.recipe-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  transition: transform 0.2s ease;
}

.star.filled {
  fill: #FFD700;
}

.star.half {
  fill: url(#halfGradient);
}

.star.empty {
  fill: none;
  stroke: #666;
  stroke-width: 1;
}

.rating-text {
  color: #e0e0e0;
  font-weight: 600;
  font-family: 'Merriweather Sans', sans-serif;
}
</style> 