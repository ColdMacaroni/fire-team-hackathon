<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    recipe: {
      type: [Object, String],
      required: true,
    },
  })

  const ingredients = computed(() => {
    let r = props.recipe
    if (typeof r === 'string') {
      try {
        r = JSON.parse(r)
      } catch {
        return []
      }
    }
    return Array.isArray(r.ingredients) ? r.ingredients : []
  })
</script>

<template>
  <div class="ingredients-block">
    <h2>Ingredients:</h2>
    <ul>
      <li v-for="(ingredient, i) in ingredients" :key="i">
        {{
          ingredient.amount && ingredient.amount !== 'N/A'
            ? ingredient.amount
            : ''
        }}
        {{
          ingredient.unit && ingredient.unit !== 'N/A' ? ingredient.unit : ''
        }}
        {{ ingredient.ingredient }}
      </li>
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
  .ingredients-block {
    background: #232323;
    color: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    padding: 1.5rem 1.2rem 1.2rem 1.2rem;
    margin-bottom: 1.5rem;
    width: 100%;
  }
</style>
