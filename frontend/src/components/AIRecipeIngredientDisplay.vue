<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipe: {
    type: [Object, String],
    required: true
  }
})

const ingredients = computed(() => {
  let r = props.recipe;
  if (typeof r === 'string') {
    try { r = JSON.parse(r); } catch { return []; }
  }
  return Array.isArray(r.ingredients) ? r.ingredients : [];
});
</script>

<template>
  <div>
    <h2>Ingredients</h2>
    <ul>
      <li v-for="(ing, i) in ingredients" :key="i">{{ ing }}</li>
    </ul>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 0.5rem;
}
ul {
  margin: 0;
  padding-left: 1.2rem;
}
li {
  margin-bottom: 0.2rem;
}
</style>
