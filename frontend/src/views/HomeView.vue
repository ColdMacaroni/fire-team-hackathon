<script setup>
  import { ref, onMounted } from 'vue'
  import RecipeCard from '../components/RecipeCard.vue'

  const createdRecipes = ref([])
  const favouritedRecipes = ref([])

  onMounted(() => {
    loadRecipes()
  })

  const loadRecipes = () => {
    try {
      const savedRecipes = localStorage.getItem('createdRecipes')
      if (savedRecipes) {
        createdRecipes.value = JSON.parse(savedRecipes)
      }
    } catch (error) {
      console.error('Error loading recipes from localStorage:', error)
    }
  }
</script>

<template>
  <div class="page-container" data-v-inspector="src/views/HomeView.vue:25:5">
    <div
      v-if="createdRecipes.length > 0"
      class="content-wrapper"
      data-v-inspector="src/views/HomeView.vue:26:9"
    >
      <h1 class="section-title" data-v-inspector="src/views/HomeView.vue:27:13">
        Your Recipes
      </h1>
      <div class="recipes-grid" data-v-inspector="src/views/HomeView.vue:28:13">
        <RecipeCard
          v-for="recipe in createdRecipes"
          :key="recipe.id"
          :recipe="recipe"
          data-v-inspector="src/views/HomeView.vue:29:17"
        />
      </div>
    </div>
    <div
      v-else
      class="empty-state"
      data-v-inspector="src/views/HomeView.vue:32:9"
    >
      <h1 data-v-inspector="src/views/HomeView.vue:33:13">
        No created recipes yet
      </h1>
      <p data-v-inspector="src/views/HomeView.vue:34:13">
        Create your first recipe to see it here!
      </p>
      <button
        type="button"
        class="create-btn"
        data-v-inspector="src/views/HomeView.vue:35:13"
      >
        <RouterLink
          to="/create"
          class="nav-link"
          data-v-inspector="src/views/HomeView.vue:36:17"
        >
          <FontAwesomeIcon
            icon="fa-plus"
            data-v-inspector="src/views/HomeView.vue:37:21"
          />
          Create
        </RouterLink>
      </button>
    </div>
  </div>
</template>

<style scoped>
  .favourited-recipes {
    margin-top: 20px;
  }

  .recipes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .nav-link {
    color: var(--color-text);
    font-size: 16px;
    text-decoration: none;
    text-align: left;
    display: flex;
    padding: 20px;
    gap: 10px;
    justify-content: center;
    align-items: center;
    background-color: var(--color-accent);
  }

  .create-btn {
    background: var(--color-accent);
    border: none;
    padding: 10px 20px;
    margin-top: 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 40px 20px;
  }

  .empty-state h1 {
    color: var(--color-text);
  }

  .empty-state p {
    color: var(--color-text);
  }
</style>
