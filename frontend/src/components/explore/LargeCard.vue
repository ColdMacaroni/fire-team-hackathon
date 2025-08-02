<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const props = defineProps({
    recipe: {
      type: Object,
      required: true,
    },
  })

  const recipeNameFontSize = computed(() => {
    if (!props.recipe?.name) return 36
    const length = props.recipe.name.length

    if (length <= 15) return 36
    if (length <= 25) return 32
    if (length <= 35) return 28
    if (length <= 45) return 24
    return 20
  })
  function navigateToRecipe(id) {
    router.push(`/recipe/${id}`)
  }
</script>
<template>
  <div class="large-card" v-if="recipe">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      @click="navigateToRecipe(recipe.id)"
      alt="Image couldn't be loaded."
      class="recipe-image"
    />
    <div v-else class="recipe-image" @click="navigateToRecipe(recipe.id)">
      <FontAwesomeIcon icon="fa-solid fa-image" />
    </div>
    <div class="recipe-header">
      <div class="recipe-name">
        <h1 :style="{ fontSize: recipeNameFontSize + 'px' }">
          {{ recipe.name }}
        </h1>
      </div>
      <div class="recipe-rating">
        <p>🔥{{ recipe.likes }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .large-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 330px;
    max-width: 90vw; /* Prevent overflow on small screens */
    overflow: hidden; /* Prevent content from spilling out */
  }

  .recipe-image {
    display: flex;
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    width: 100%; /* Use full width of parent */
    max-width: 330px; /* But cap at 330px */
    height: 250px;
    aspect-ratio: 33/25;
    object-fit: cover; /* Ensure image fits properly */
    border-radius: 12px;
  }

  .recipe-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .recipe-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%; /* Use full width of parent */
    max-width: 330px; /* But cap at 330px */
    margin-top: 12px;
  }

  .recipe-name {
    flex: 1;
    margin-right: 12px;
  }

  .recipe-name h1 {
    color: #fff;
    font-family: var(--font-primary);
    font-style: normal;
    font-weight: 400;
    line-height: 1.2;
    margin: 0;
    word-wrap: break-word;
    hyphens: auto;
  }

  .recipe-rating {
    flex-shrink: 0;
  }

  .recipe-rating p {
    color: var(--color-primary);
    font-family: var(--font-secondary);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 125.725%;
    margin: 0;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .large-card {
      width: 100%;
      max-width: 320px; /* Slightly smaller on mobile */
    }

    .recipe-image {
      max-width: 320px;
    }

    .recipe-header {
      max-width: 320px;
    }
  }
</style>
