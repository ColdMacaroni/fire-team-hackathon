<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  defineProps({
    recipe: {
      type: Object,
      required: true,
    },
  })

  function navigateToRecipe(id) {
    router.push(`/recipe/${id}`)
  }
</script>

<template>
  <div
    class="recipe-card"
    @click="navigateToRecipe(recipe.id)"
    data-v-inspector="src/components/RecipeCard.vue:11:5"
  >
    <div
      v-if="recipe.image != ''"
      class="recipe-image"
      data-v-inspector="src/components/RecipeCard.vue:12:9"
    >
      <img
        :src="recipe.image"
        :alt="recipe.name"
        data-v-inspector="src/components/RecipeCard.vue:13:13"
      />
    </div>
    <div
      v-else
      class="recipe-image"
      data-v-inspector="src/components/RecipeCard.vue:15:9"
    ></div>
    <div
      class="recipe-content"
      data-v-inspector="src/components/RecipeCard.vue:17:9"
    >
      <h3
        class="recipe-name"
        data-v-inspector="src/components/RecipeCard.vue:18:13"
      >
        {{ recipe.name }}
      </h3>
      <div class="recipe-stars">
        <div class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= recipe.rating }"
          >
            ★
          </span>
        </div>
        <span class="rating-text">({{ recipe.reviews }})</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .recipe-card {
    background-color: var(--color-background-secondary);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }

  .recipe-card:hover {
    transform: translateY(-2px);
  }

  .recipe-image {
    height: 120px;
    overflow: hidden;
  }

  .recipe-image img {
    height: 100%;
    object-fit: cover;
  }

  .recipe-content {
    padding: 12px;
  }

  .recipe-name {
    color: var(--color-text);
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .recipe-stars {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stars {
    display: flex;
    gap: 1px;
  }

  .star {
    font-size: 14px;
    color: #666;
    transition: color 0.2s ease;
  }

  .star.filled {
    color: #ffd700;
  }

  .rating-text {
    color: var(--color-text);
    opacity: 0.7;
    font-size: 12px;
  }
</style>
