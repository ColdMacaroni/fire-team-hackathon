<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    recipe: {
      type: [Object, String],
      required: true,
    },
  })

  const instructions = computed(() => {
    let r = props.recipe
    if (typeof r === 'string') {
      try {
        r = JSON.parse(r)
      } catch {
        return []
      }
    }
    if (Array.isArray(r.instructions)) return r.instructions
    if (typeof r.instructions === 'string') {
      // Split by newlines and filter out empty lines
      return r.instructions.split('\n').filter(step => step.trim() !== '')
    }
    return []
  })
</script>

<template>
  <div>
    <h2>Instructions:</h2>
    <ol>
      <li v-for="(step, i) in instructions" :key="i">{{ step }}</li>
    </ol>
  </div>
</template>

<style scoped>
  h2 {
    margin-bottom: 0.5rem;
  }
  ol {
    margin: 0;
    padding-left: 1.2rem;
  }
  li {
    margin-bottom: 0.2rem;
  }
</style>
