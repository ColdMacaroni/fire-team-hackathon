<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="recipe-image">
    <img :src="image" :alt="name" />
  </div>
</template>

<style scoped>
.recipe-image {
  width: 40%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-image {
    width: 35%;
  }
}

@media (max-width: 480px) {
  .recipe-image {
    width: 100%;
    height: 200px;
  }
}
</style> 