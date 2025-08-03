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
      // Split by newlines, trim, filter out empty, then trim first 2 chars
      return r.instructions
        .split('\n')
        .map(step => step.trim())
        .filter(step => step !== '')
        .map(step => step.length > 2 ? step.slice(2) : '');
    }
    return []
  })
</script>

<template>
  <div class="ai-card">
    <h2 class="ai-section-title">Instructions</h2>
    <ol class="ai-list-ol">
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
<style scoped>
.ai-card {
  background: #232323;
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  margin-bottom: 1.5rem;
  width: 100%;
}
.ai-section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
  letter-spacing: 0.5px;
}
.ai-list-ol {
  margin: 0;
  padding-left: 1.2rem;
  list-style-type: decimal;
}
.ai-list-ol li {
  margin-bottom: 0.3rem;
  font-size: 1.05rem;
  line-height: 1.5;
}
</style>
