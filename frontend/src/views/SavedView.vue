<script setup>
import { ref, onMounted } from 'vue'
import RecipeCard from '../components/RecipeCard.vue'

const favouritedRecipes = ref([])

onMounted(() => {
    loadRecipes()
})

const loadRecipes = () => {
    try {
        const favouriteRecipes = localStorage.getItem('favouritedRecipes')
        if (favouriteRecipes) {
            favouritedRecipes.value = JSON.parse(favouriteRecipes)
        }
    } catch (error) {
        console.error('Error loading recipes from localStorage:', error)
    }
}
</script>

<template>
    <div class="page-container" data-v-inspector="src/views/SavedView.vue:24:5">
        <div v-if="favouritedRecipes.length > 0" class="favourited-recipes" data-v-inspector="src/views/SavedView.vue:25:9">
            <h1 class="section-title" data-v-inspector="src/views/SavedView.vue:26:13">Favourited Recipes</h1>
            <div class="recipes-grid" data-v-inspector="src/views/SavedView.vue:27:13">
                <RecipeCard v-for="recipe in favouritedRecipes" :key="recipe.id" :recipe="recipe" data-v-inspector="src/views/SavedView.vue:28:17" />
            </div>
        </div>
        <div v-else class="empty-state" data-v-inspector="src/views/SavedView.vue:31:9">
            <h1 data-v-inspector="src/views/SavedView.vue:32:13">No favourited recipes yet</h1>
            <p data-v-inspector="src/views/SavedView.vue:33:13">Favourite your first recipe to see it here!</p>
            <button type="button" class="create-btn" data-v-inspector="src/views/SavedView.vue:34:13">
                <RouterLink to="/explore" class="nav-link" data-v-inspector="src/views/SavedView.vue:35:17">
                    <FontAwesomeIcon icon="fa-compass" data-v-inspector="src/views/SavedView.vue:36:21" />
                    Explore
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