<script setup>
import { defineProps, ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const recipeNameRef = ref(null)

// Function to adjust font size based on text length
const adjustFontSize = () => {
  if (!recipeNameRef.value) return
  
  const element = recipeNameRef.value
  const text = element.textContent
  const containerWidth = 336 - 80 // Account for rank space on the right
  
  // Base font size calculation based on text length
  let fontSize = Math.max(16, Math.min(36, 36 - (text.length - 10) * 0.8))
  
  // Apply the font size
  element.style.fontSize = `${fontSize}px`
  
  // Check if text still overflows and reduce further if needed
  if (element.scrollWidth > containerWidth) {
    const ratio = containerWidth / element.scrollWidth
    fontSize = Math.max(14, fontSize * ratio)
    element.style.fontSize = `${fontSize}px`
  }
}

onMounted(() => {
  nextTick(() => {
    adjustFontSize()
  })
})
</script>

<template>
  <div class="recipe-header">
    <h2 ref="recipeNameRef" class="recipe-name">{{ recipe.name }}</h2>
    <div class="recipe-rank">
      <span class="fire-emoji">🔥</span>
      <span class="rank-number">{{ recipe.rank }}</span>
    </div>
  </div>
</template>

<style scoped>
.recipe-header {
  display: flex;
  width: 336px;
  align-items: center;
  position: relative;
}

.recipe-name {
  margin: 0 !important;
  color: #FFF;
  font-family: Merriweather;
  font-style: normal;
  font-weight: 400;
  line-height: 125.725%;
  font-size: clamp(14px, 4vw, 36px);
  max-width: 256px; /* Leave space for rank */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: font-size 0.2s ease;
}

.recipe-rank {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
}

.fire-emoji {
  font-size: 1.2rem;
}

.rank-number {
  font-weight: 700;
  color: #FFF;
  text-align: center;
  font-family: "Merriweather Sans";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-name {
    font-size: clamp(12px, 3.5vw, 28px);
  }
}

@media (max-width: 480px) {
  .recipe-name {
    font-size: clamp(10px, 3vw, 24px);
  }
}
</style> 