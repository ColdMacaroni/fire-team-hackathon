import { ref, computed } from 'vue'
import apiService from '../services/api.js'

export function useRecipes() {
  const recipes = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Load all recipes from Flask backend
  const loadAllRecipes = async () => {
    try {
      loading.value = true
      error.value = null

      // First, get recipe IDs from ingredient filter endpoint
      const recipeIdsResponse = await apiService.getRecipesByIngredients('-') // Get recipes without any ingredient filter
      console.log('Recipe IDs response:', recipeIdsResponse)

      if (recipeIdsResponse && Array.isArray(recipeIdsResponse)) {
        // Extract all recipe IDs and convert to comma-separated string
        const recipeIds = recipeIdsResponse.map(recipe => recipe.id)
        const recipeIdsString = recipeIds.join(',')
        console.log('Recipe IDs string:', recipeIdsString)

        if (recipeIdsString) {
          // Get full recipe details using the comma-separated string of IDs
          const fullRecipes = await apiService.getRecipesByIds(recipeIdsString)
          console.log('Full recipes response:', fullRecipes)
          recipes.value = fullRecipes || []
          return fullRecipes || []
        } else {
          recipes.value = []
          return []
        }
      } else {
        recipes.value = []
        return []
      }
    } catch (err) {
      error.value = 'Failed to load recipes from backend'
      console.error('Error loading recipes from backend:', err)
      // Set empty array instead of falling back to JSON
      recipes.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Load all recipes and return the data (for use in other components)
  const getAllRecipes = async () => {
    try {
      // First, get recipe IDs from ingredient filter endpoint
      const recipeIdsResponse = await apiService.getRecipesByIngredients('-') // Get recipes without any ingredient filter
      console.log('Recipe IDs response:', recipeIdsResponse)

      if (recipeIdsResponse && Array.isArray(recipeIdsResponse)) {
        // Extract all recipe IDs and convert to comma-separated string
        const recipeIds = recipeIdsResponse.map(recipe => recipe.id)
        const recipeIdsString = recipeIds.join(',')
        console.log('Recipe IDs string:', recipeIdsString)

        if (recipeIdsString) {
          // Get full recipe details using the comma-separated string of IDs
          const fullRecipes = await apiService.getRecipesByIds(recipeIdsString)
          console.log('Full recipes response:', fullRecipes)
          return fullRecipes || []
        } else {
          return []
        }
      } else {
        return []
      }
    } catch (err) {
      console.error('Error loading recipes from backend:', err)
      return []
    }
  }

  // Load a specific recipe by ID from Flask backend
  const loadRecipeById = async recipeId => {
    try {
      loading.value = true
      error.value = null

      // Load from Flask backend
      const backendRecipes = await apiService.getRecipeById(recipeId)
      if (backendRecipes && backendRecipes.length > 0) {
        return backendRecipes[0] // Return the first recipe from the array
      }

      // If not found in backend, check localStorage (for user-created recipes)
      const savedRecipes = localStorage.getItem('createdRecipes')
      if (savedRecipes) {
        const localStorageRecipes = JSON.parse(savedRecipes)
        const foundRecipe = localStorageRecipes.find(
          recipe => recipe.id === parseInt(recipeId)
        )
        if (foundRecipe) {
          return foundRecipe
        }
      }

      error.value = 'Recipe not found'
      return null
    } catch (err) {
      error.value = 'Failed to load recipe from backend'
      console.error('Error loading recipe from backend:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Load trending recipes from Flask backend
  const loadTrendingRecipes = async (limit = 10) => {
    try {
      loading.value = true
      error.value = null

      // Get trending recipes from backend
      const trendingRecipes = await apiService.getTrendingRecipes(0, limit)
      recipes.value = trendingRecipes || []
      return trendingRecipes || []
    } catch (err) {
      error.value = 'Failed to load trending recipes'
      console.error('Error loading trending recipes:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Get trending recipes and return the data (for use in other components)
  const getTrendingRecipes = async (limit = 10) => {
    try {
      // Get trending recipes from backend
      const trendingRecipes = await apiService.getTrendingRecipes(0, limit)
      console.log('Trending recipes response:', trendingRecipes)
      return trendingRecipes || []
    } catch (err) {
      console.error('Error loading trending recipes:', err)
      return []
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

      // Format the recipe data (without ID - backend will generate it)
      const formattedRecipe = {
        name: recipeData.name,
        image: recipeData.image || '',
        tags: recipeData.tags.filter(tag => tag.trim() !== ''),
        ingredients: recipeData.ingredients
          .filter(ing => ing.ingredient.trim() !== '')
          .map(ing => ({
            ingredient: ing.ingredient,
            amount: ing.amount,
            unit: ing.unit,
          })),
        instructions: recipeData.instructions,
        description: recipeData.description || '',
        cookingTime: parseInt(recipeData.cookingTime) || 0,
        difficulty: parseInt(recipeData.difficulty) || 1,
      }

      // Send recipe to backend and get the response with generated ID
      const backendResponse = await apiService.saveRecipe(formattedRecipe)
      console.log('Backend response:', backendResponse)

      // Extract the ID from the backend response
      if (backendResponse && backendResponse.id) {
        // Add the backend-generated ID to the recipe
        const recipeWithId = {
          ...formattedRecipe,
          id: backendResponse.id,
          rating: 0,
          reviews: 0,
          isFavorited: false,
          likes: 0,
          dislikes: 0,
          comments: 0,
        }

        // Get existing recipes from localStorage
        const existingRecipes = JSON.parse(
          localStorage.getItem('createdRecipes') || '[]'
        )

        // Add new recipe with backend-generated ID
        const updatedRecipes = [...existingRecipes, recipeWithId]

        // Save to localStorage
        localStorage.setItem('createdRecipes', JSON.stringify(updatedRecipes))

        // Update local recipes array
        recipes.value = updatedRecipes

        return recipeWithId
      } else {
        throw new Error('Backend did not return a valid ID')
      }
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
    getAllRecipes,
    loadRecipeById,
    loadTrendingRecipes,
    getTrendingRecipes,
    loadFavoritedRecipes,
    loadCreatedRecipes,
    saveRecipe,
    updateRecipeLikes,
    toggleRecipeFavorite,
  }
}
