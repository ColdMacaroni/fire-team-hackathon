<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import RecipeImage from '../components/RecipeImage.vue'
import RecipeHeader from '../components/RecipeHeader.vue'
import RecipeRating from '../components/RecipeRating.vue'
import RecipeTags from '../components/RecipeTags.vue'

const route = useRoute()
const recipe = ref(null)
const loading = ref(true)
const error = ref(null)

// Load recipe data based on ID from route
const loadRecipe = async () => {
  try {
    const recipeId = parseInt(route.params.id)
    
    // Load recipes from JSON file
    const response = await fetch('/src/data/recipes.json')
    const data = await response.json()
    
    // Find the specific recipe by ID
    const foundRecipe = data.recipes.find(r => r.id === recipeId)
    
    if (foundRecipe) {
      recipe.value = foundRecipe
    } else {
      error.value = 'Recipe not found'
    }
  } catch (err) {
    console.error('Error loading recipe:', err)
    error.value = 'Failed to load recipe'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRecipe()
})
</script>

<template>
  <div class="recipe-showcase">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading recipe...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <h2>Oops!</h2>
      <p>{{ error }}</p>
      <router-link to="/" class="back-link">← Back to Home</router-link>
    </div>

    <!-- Recipe Content -->
    <div v-else-if="recipe" class="recipe-container">
      <!-- Header Section -->
      <header class="recipe-header">
        <div class="header-content">
          <h1 class="recipe-title">{{ recipe.name }}</h1>
          <div class="recipe-meta">
            <div class="rating-section">
              <RecipeRating :rating="recipe.rating" />
              <span class="reviews-count">({{ recipe.reviews }} reviews)</span>
            </div>
            <div class="rank-section">
              <span class="rank-label">Rank:</span>
              <span class="rank-value">{{ recipe.rank }}/5</span>
            </div>
          </div>
          <RecipeTags :tags="recipe.tags" />
        </div>
      </header>

      <!-- Main Content -->
      <main class="recipe-main">
        <!-- Recipe Image -->
        <div class="recipe-image-section">
          <RecipeImage :image="recipe.image" :name="recipe.name" />
        </div>

        <!-- Recipe Details -->
        <div class="recipe-details">
          <!-- Ingredients Section -->
          <section class="ingredients-section">
            <h2 class="section-title">Ingredients</h2>
            <div class="ingredients-list">
              <div 
                v-for="ingredient in recipe.ingredients" 
                :key="ingredient.ingredient"
                class="ingredient-item"
              >
                <span class="ingredient-amount">{{ ingredient.amount }} {{ ingredient.unit }}</span>
                <span class="ingredient-name">{{ ingredient.ingredient }}</span>
              </div>
            </div>
          </section>

          <!-- Instructions Section -->
          <section class="instructions-section">
            <h2 class="section-title">Instructions</h2>
            <div class="instructions-list">
              <div 
                v-for="(instruction, index) in recipe.instructions.split('\n')" 
                :key="index"
                class="instruction-step"
                v-show="instruction.trim()"
              >
                <span class="step-number">{{ index + 1 }}</span>
                <span class="step-text">{{ instruction.replace(/^\d+\.\s*/, '') }}</span>
              </div>
            </div>
          </section>

          <!-- Recipe Stats -->
          <section class="recipe-stats">
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Likes</span>
                <span class="stat-value">{{ recipe.likes }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Comments</span>
                <span class="stat-value">{{ recipe.comments }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Reviews</span>
                <span class="stat-value">{{ recipe.reviews }}</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- Footer -->
      <footer class="recipe-footer">
        <router-link to="/" class="back-button">
          ← Back to Recipes
        </router-link>
        <div class="share-section">
          <button class="share-button" @click="navigator.share ? navigator.share({title: recipe.name, url: window.location.href}) : navigator.clipboard.writeText(window.location.href)">
            📤 Share Recipe
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.recipe-showcase {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
  text-align: center;
  padding: 2rem;
}

.error h2 {
  color: #dc3545;
  margin: 0;
}

.back-link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: #4CAF50;
  color: white;
}

/* Recipe Container */
.recipe-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Header Section */
.recipe-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem 2rem;
  text-align: center;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.recipe-title {
  font-family: 'Merriweather', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.recipe-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reviews-count {
  font-size: 0.9rem;
  opacity: 0.9;
}

.rank-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rank-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.rank-value {
  font-weight: 600;
  font-size: 1.1rem;
}

/* Main Content */
.recipe-main {
  flex: 1;
  padding: 2rem;
}

/* Recipe Image */
.recipe-image-section {
  margin-bottom: 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

/* Recipe Details */
.recipe-details {
  display: grid;
  gap: 3rem;
}

/* Section Titles */
.section-title {
  font-family: 'Merriweather', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #4CAF50;
  display: inline-block;
}

/* Ingredients Section */
.ingredients-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #4CAF50;
}

.ingredients-list {
  display: grid;
  gap: 1rem;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.ingredient-item:hover {
  transform: translateX(4px);
}

.ingredient-amount {
  font-weight: 600;
  color: #4CAF50;
  min-width: 80px;
  font-family: 'Merriweather Sans', sans-serif;
}

.ingredient-name {
  font-size: 1.1rem;
  color: #2c3e50;
}

/* Instructions Section */
.instructions-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.instructions-list {
  display: grid;
  gap: 1.5rem;
}

.instruction-step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  background: #4CAF50;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.step-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
  flex: 1;
}

/* Recipe Stats */
.recipe-stats {
  background: #2c3e50;
  color: white;
  padding: 2rem;
  border-radius: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #4CAF50;
}

/* Footer */
.recipe-footer {
  background: #f8f9fa;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-button {
  background: #6c757d;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  background: #5a6268;
}

.share-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.share-button:hover {
  background: #45a049;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-header {
    padding: 2rem 1rem 1.5rem;
  }
  
  .recipe-title {
    font-size: 2rem;
  }
  
  .recipe-meta {
    gap: 1rem;
  }
  
  .recipe-main {
    padding: 1.5rem;
  }
  
  .ingredients-section,
  .instructions-section {
    padding: 1.5rem;
  }
  
  .recipe-footer {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .recipe-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .recipe-title {
    font-size: 1.75rem;
  }
  
  .recipe-main {
    padding: 1rem;
  }
  
  .ingredients-section,
  .instructions-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .ingredient-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .ingredient-amount {
    min-width: auto;
  }
}
</style> 