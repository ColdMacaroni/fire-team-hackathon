import { ref, computed } from 'vue'
import recipesData from '../data/recipes.json'

export function useRecipes() {
  const recipes = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Load all recipes from data/recipes.json
  const loadAllRecipes = async () => {
    try {
      loading.value = true
      error.value = null

      // Load recipes from the JSON file
      recipes.value = recipesData.recipes || []
    } catch (err) {
      error.value = 'Failed to load recipes'
      console.error('Error loading recipes from JSON file:', err)
    } finally {
      loading.value = false
    }
  }

  // Load a specific recipe by ID from data/recipes.json or localStorage
  const loadRecipeById = async recipeId => {
    try {
      loading.value = true
      error.value = null

      // First, try to find the recipe in the JSON file
      const allRecipes = recipesData.recipes || []
      let foundRecipe = allRecipes.find(
        recipe => recipe.id === parseInt(recipeId)
      )

      // If not found in JSON, check localStorage (for user-created recipes)
      if (!foundRecipe) {
        const savedRecipes = localStorage.getItem('createdRecipes')
        if (savedRecipes) {
          const localStorageRecipes = JSON.parse(savedRecipes)
          foundRecipe = localStorageRecipes.find(
            recipe => recipe.id === parseInt(recipeId)
          )
        }
      }

      if (foundRecipe) {
        return foundRecipe
      } else {
        error.value = 'Recipe not found'
        return null
      }
    } catch (err) {
      error.value = 'Failed to load recipe'
      console.error('Error loading recipe:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Load favorited recipes
  const loadFavoritedRecipes = async () => {
    try {
      loading.value = true
      error.value = null

      const savedRecipes = localStorage.getItem('createdRecipes')
      if (savedRecipes) {
        const allRecipes = JSON.parse(savedRecipes)
        recipes.value = allRecipes.filter(recipe => recipe.isFavorited === true)
      } else {
        recipes.value = []
      }
    } catch (err) {
      error.value = 'Failed to load favorited recipes'
      console.error('Error loading favorited recipes:', err)
    } finally {
      loading.value = false
    }
  }

  // Load created recipes (non-favorited)
  const loadCreatedRecipes = async () => {
    try {
      loading.value = true
      error.value = null

      const savedRecipes = localStorage.getItem('createdRecipes')
      if (savedRecipes) {
        const allRecipes = JSON.parse(savedRecipes)
        recipes.value = allRecipes.filter(recipe => recipe.isFavorited !== true)
      } else {
        recipes.value = []
      }
    } catch (err) {
      error.value = 'Failed to load created recipes'
      console.error('Error loading created recipes:', err)
    } finally {
      loading.value = false
    }
  }

  // Save a new recipe
  const saveRecipe = async recipeData => {
    try {
      loading.value = true
      error.value = null

      // Generate unique ID
      const newId = Date.now()

      // Format the recipe data
      const formattedRecipe = {
        id: newId,
        name: recipeData.name,
        image: recipeData.image || '',
        rating: 0,
        reviews: 0,
        tags: recipeData.tags.filter(tag => tag.trim() !== ''),
        ingredients: recipeData.ingredients
          .filter(ing => ing.ingredient.trim() !== '')
          .map(ing => ({
            ingredient: ing.ingredient,
            amount: ing.amount,
            unit: ing.unit,
          })),
        instructions: recipeData.instructions,
        isFavorited: false,
        likes: 0,
        dislikes: 0,
        comments: 0,
      }

      // Get existing recipes
      const existingRecipes = JSON.parse(
        localStorage.getItem('createdRecipes') || '[]'
      )

      // Add new recipe
      const updatedRecipes = [...existingRecipes, formattedRecipe]

      // Save to localStorage
      localStorage.setItem('createdRecipes', JSON.stringify(updatedRecipes))

      // Update local recipes array
      recipes.value = updatedRecipes

      return formattedRecipe
    } catch (err) {
      error.value = 'Failed to save recipe'
      console.error('Error saving recipe:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update recipe likes
  const updateRecipeLikes = (recipeId, newLikesCount) => {
    try {
      const savedRecipes = JSON.parse(
        localStorage.getItem('createdRecipes') || '[]'
      )
      const recipeIndex = savedRecipes.findIndex(
        r => r.id === parseInt(recipeId)
      )

      if (recipeIndex !== -1) {
        savedRecipes[recipeIndex].likes = newLikesCount
        localStorage.setItem('createdRecipes', JSON.stringify(savedRecipes))

        // Update local recipes if they're loaded
        if (recipes.value.length > 0) {
          const localIndex = recipes.value.findIndex(
            r => r.id === parseInt(recipeId)
          )
          if (localIndex !== -1) {
            recipes.value[localIndex].likes = newLikesCount
          }
        }

        return true
      }
      return false
    } catch (err) {
      console.error('Error updating recipe likes:', err)
      return false
    }
  }

  // Toggle recipe favorite status
  const toggleRecipeFavorite = recipeId => {
    try {
      const savedRecipes = JSON.parse(
        localStorage.getItem('createdRecipes') || '[]'
      )
      const recipeIndex = savedRecipes.findIndex(
        r => r.id === parseInt(recipeId)
      )

      if (recipeIndex !== -1) {
        savedRecipes[recipeIndex].isFavorited =
          !savedRecipes[recipeIndex].isFavorited
        localStorage.setItem('createdRecipes', JSON.stringify(savedRecipes))

        // Update local recipes if they're loaded
        if (recipes.value.length > 0) {
          const localIndex = recipes.value.findIndex(
            r => r.id === parseInt(recipeId)
          )
          if (localIndex !== -1) {
            recipes.value[localIndex].isFavorited =
              savedRecipes[recipeIndex].isFavorited
          }
        }

        return true
      }
      return false
    } catch (err) {
      console.error('Error toggling recipe favorite:', err)
      return false
    }
  }

  // Listener to stream data
  const streamDataListener = () => {
    const eventSource = new EventSource('/api/recipes/stream')
    eventSource.onmessage = event => {
      const data = JSON.parse(event.data)
      console.log('Received data:', data)
    }
  }

  // Computed properties
  const hasRecipes = computed(() => recipes.value.length > 0)
  const recipesCount = computed(() => recipes.value.length)

  return {
    // State
    recipes,
    loading,
    error,

    // Computed
    hasRecipes,
    recipesCount,

    // Methods
    loadAllRecipes,
    loadRecipeById,
    loadFavoritedRecipes,
    loadCreatedRecipes,
    saveRecipe,
    updateRecipeLikes,
    toggleRecipeFavorite,
  }
}
