<script setup>
  import { ref, onMounted, computed, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRecipes } from '../composables/useRecipes'

  const route = useRoute()
  const router = useRouter()
  const recipe = ref(null)
  const checkedIngredients = ref(new Set())
  const isLiked = ref(false)

  const { loading, error, loadRecipeById, updateRecipeLikes } = useRecipes()

  const recipeId = computed(() => route.params.id)

  // Number formatter using Intl.NumberFormat
  const nf = new Intl.NumberFormat('en', { notation: 'compact' })
  const formattedLikes = computed(() => {
    return nf.format(recipe.value?.likes || 0)
  })

  // Computed property for recipe name character count
  const recipeNameCharCount = computed(() => {
    return recipe.value?.name?.length || 0
  })

  const recipeNameFontSize = computed(() => {
    if (!recipe.value?.name) return 36
    const length = recipe.value.name.length

    if (length <= 15) return 36
    if (length <= 25) return 32
    if (length <= 35) return 28
    if (length <= 45) return 24
    return 20
  })

  onMounted(() => {
    loadRecipe()
    loadCheckedIngredients()
    loadLikeStatus()
    // Scroll to top when recipe page loads
    window.scrollTo(0, 0)
  })

  const loadRecipe = async () => {
    const foundRecipe = await loadRecipeById(recipeId.value)
    if (foundRecipe) {
      recipe.value = foundRecipe
      console.log(recipe.value)
    }
  }

  const loadCheckedIngredients = () => {
    const saved = localStorage.getItem(`checkedIngredients_${recipeId.value}`)
    if (saved) {
      checkedIngredients.value = new Set(JSON.parse(saved))
    }
  }

  const toggleIngredient = ingredientText => {
    if (checkedIngredients.value.has(ingredientText)) {
      checkedIngredients.value.delete(ingredientText)
    } else {
      checkedIngredients.value.add(ingredientText)
    }

    // Save to localStorage
    localStorage.setItem(
      `checkedIngredients_${recipeId.value}`,
      JSON.stringify([...checkedIngredients.value])
    )
  }

  const isIngredientChecked = ingredientText => {
    return checkedIngredients.value.has(ingredientText)
  }

  const loadLikeStatus = () => {
    const saved = localStorage.getItem(`liked_${recipeId.value}`)
    if (saved) {
      isLiked.value = JSON.parse(saved)
    }
  }

  const toggleLike = () => {
    isLiked.value = !isLiked.value

    // Save to localStorage
    localStorage.setItem(
      `liked_${recipeId.value}`,
      JSON.stringify(isLiked.value)
    )

    // Update recipe likes count
    if (recipe.value) {
      if (isLiked.value) {
        recipe.value.likes = (recipe.value.likes || 0) + 1
      } else {
        recipe.value.likes = Math.max(0, (recipe.value.likes || 0) - 1)
      }

      // Update localStorage with new likes count
      const savedRecipes = localStorage.getItem('createdRecipes')
      if (savedRecipes) {
        const recipes = JSON.parse(savedRecipes)
        const recipeIndex = recipes.findIndex(
          r => r.id === parseInt(recipeId.value)
        )
        if (recipeIndex !== -1) {
          recipes[recipeIndex].likes = recipe.value.likes
          localStorage.setItem('createdRecipes', JSON.stringify(recipes))
        }
      }
    }
  }

  const goBack = () => {
    router.back()
  }

  const goToHome = () => {
    router.push('/')
  }

  // Parse tags from JSON string format
  const parsedTags = computed(() => {
    if (!recipe.value?.tags) return []

    // If tags is already an array of objects, return as is
    if (Array.isArray(recipe.value.tags) && recipe.value.tags.length > 0) {
      // Check if first item is a string (JSON format) or object
      if (typeof recipe.value.tags[0] === 'string') {
        return recipe.value.tags.map(tag => {
          try {
            return JSON.parse(tag)
          } catch (e) {
            console.error('Error parsing tag:', tag, e)
            return { id: 0, name: tag }
          }
        })
      }
      return recipe.value.tags
    }

    return []
  })

  // Parse ingredients from JSON string format
  const parsedIngredients = computed(() => {
    if (!recipe.value?.ingredients) return []

    // If ingredients is already an array of objects, return as is
    if (
      Array.isArray(recipe.value.ingredients) &&
      recipe.value.ingredients.length > 0
    ) {
      // Check if first item is a string (JSON format) or object
      if (typeof recipe.value.ingredients[0] === 'string') {
        return recipe.value.ingredients.map(ingredient => {
          try {
            return JSON.parse(ingredient)
          } catch (e) {
            console.error('Error parsing ingredient:', ingredient, e)
            return { id: 0, ingredient: ingredient, amount: null, unit: null }
          }
        })
      }
      return recipe.value.ingredients
    }

    return []
  })
</script>
<template>
  <div class="recipe-view">
    <!-- Floating Back Button -->
    <button @click="goBack" class="back-button-floating" title="Go back">
      <FontAwesomeIcon icon="fa-arrow-left" />
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading recipe...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <h2>Oops!</h2>
      <p>{{ error }}</p>
      <button @click="goToHome" class="back-button">Go Home</button>
    </div>

    <!-- Recipe Content -->
    <div v-else-if="recipe" class="recipe-container">
      <div class="recipe-header">
        <img
          v-if="recipe.image"
          :src="recipe.image"
          alt="Recipe Image"
          class="recipe-image"
        />
        <div v-else class="recipe-image"></div>
      </div>
      <div class="recipe-content">
        <div class="recipe-name">
          <h1 :style="{ fontSize: recipeNameFontSize + 'px' }">
            {{ recipe.name }}
          </h1>
          <button
            class="like-button"
            :class="{ liked: isLiked }"
            @click="toggleLike"
          >
            <p class="like-icon">🔥</p>
            <p class="like-count">{{ formattedLikes }}</p>
          </button>
        </div>
        <div class="recipe-rating">
          <div class="stars-container">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= recipe.rating }"
            >
              ★
            </span>
            <p>({{ recipe.reviews }})</p>
          </div>
        </div>
        <div class="recipe-tags">
          <p>
            Tags:
            <span
              v-for="(tag, index) in parsedTags"
              :key="tag.id || index"
              class="tag-item"
            >
              {{ tag.name }}{{ index < parsedTags.length - 1 ? ', ' : '' }}
            </span>
          </p>
        </div>
        <div class="recipe-ingredients">
          <h2>Ingredients</h2>
          <ul>
            <li
              v-for="ingredient in parsedIngredients"
              :key="ingredient.id || ingredient.ingredient"
              class="ingredient-item"
              :class="{ checked: isIngredientChecked(ingredient.ingredient) }"
              @click="toggleIngredient(ingredient.ingredient)"
            >
              <div class="ingredient-icon">
                <FontAwesomeIcon
                  v-if="isIngredientChecked(ingredient.ingredient)"
                  icon="fa-times"
                  class="cross-icon"
                />
                <FontAwesomeIcon v-else icon="fa-check" class="check-icon" />
              </div>
              <div class="ingredient-details">
                <p class="ingredient-name">{{ ingredient.ingredient }}</p>
                <p
                  v-if="ingredient.amount || ingredient.unit"
                  class="ingredient-amount"
                >
                  {{ ingredient.amount
                  }}{{ ingredient.unit ? ' ' + ingredient.unit : '' }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="recipe-instructions">
          <h2>Instructions</h2>
          <p>{{ recipe.instructions }}</p>
        </div>
      </div>

      <!-- Spacer to prevent navbar overlap -->
      <div class="navbar-spacer"></div>

      <div class="recipe-footer"></div>
    </div>
  </div>
</template>
<style scoped>
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

  .recipe-content {
    width: 92%;
  }

  .recipe-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    position: relative;
  }

  .like-button {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: none;
    background-color: #666;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .like-button.liked {
    background-color: #ff6b6b;
    animation: pulse 0.3s ease;
  }

  .recipe-name {
    display: flex;
    justify-content: space-between;
    align-items: flex-start; /* Changed from center to allow for multi-line text */
    min-height: 80px; /* Increased height for better text wrapping */
    gap: 16px; /* Add gap between title and like button */
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
    flex: 1; /* Allow title to take available space */
    text-align: left; /* Align text to the left for better readability */
    /* Dynamic font size based on character count */
    font-size: clamp(20px, calc(36px - (var(--char-count, 0) * 0.8px)), 36px);
  }

  .recipe-name .like-button {
    flex-shrink: 0; /* Prevent like button from shrinking */
    align-self: center; /* Center the like button vertically */
  }

  .recipe-name p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-align: center;
    font-family: var(--font-secondary);
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .recipe-rating {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 98%; /* Makes the like button align with the number */
  }

  .like-count {
    font-size: 20px !important;
  }

  .recipe-rating p {
    color: #616060;
    font-family: var(--font-secondary);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 125.725%; /* 20.116px */
  }

  .recipe-tags {
    display: flex;
    gap: 4px;
  }
  .recipe-tags p {
    color: #fff;
    font-family: 'Merriweather Sans';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 125.725%; /* 22.631px */
  }

  .tag-item {
    color: #ffd700;
    font-weight: 500;
  }

  .stars {
    display: flex;
    gap: 2px;
  }

  .star {
    font-size: 20px;
    color: #666;
    transition: color 0.2s ease;
  }

  .star.filled {
    color: #ffd700;
  }

  .rating-text {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }

  .recipe-ingredients {
    width: 336px;
  }

  .recipe-ingredients h2 {
    color: #fff;
    font-family: var(--font-secondary);
    font-size: 20px;
    font-weight: 600;
    margin-top: 15px;
  }

  .recipe-ingredients ul {
    list-style: none;
  }

  .ingredient-item {
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .ingredient-item.checked p {
    color: #ff6b6b;
    text-decoration: line-through;
  }

  .ingredient-item:not(.checked) p {
    color: #26b360;
  }

  .ingredient-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .ingredient-item.checked .ingredient-icon {
    background-color: #ff6b6b;
  }

  .ingredient-item:not(.checked) .ingredient-icon {
    background-color: #26b360;
  }

  .check-icon {
    color: #fff;
    font-size: 12px;
  }

  .stars-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cross-icon {
    color: #fff;
    font-size: 12px;
  }

  .ingredient-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ingredient-name {
    margin: 0;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .ingredient-amount {
    margin: 0;
    transition: all 0.2s ease;
    font-size: 14px;
    opacity: 0.8;
    font-style: italic;
  }

  .ingredient-item p {
    margin: 0;
    transition: all 0.2s ease;
  }
  .recipe-instructions {
    margin-top: 10px;
  }
  p {
    color: var(--color-primary);
    font-size: 16px;
    font-family: var(--font-secondary);
    text-align: justify;
  }
  h2 {
    color: #fff;
    font-family: var(--font-secondary);
    font-size: 20px;
    font-weight: 600;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .recipe-view {
    min-height: 100vh;
    padding: 20px;
    position: relative;
  }

  .back-button-floating {
    position: fixed;
    top: 20px;
    left: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .back-button-floating:hover {
    background-color: rgba(255, 255, 255, 1);
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  .back-button-floating:active {
    transform: scale(0.95);
  }

  .navbar-spacer {
    height: 100px; /* Height to account for navbar */
    width: 100%;
  }
</style>
