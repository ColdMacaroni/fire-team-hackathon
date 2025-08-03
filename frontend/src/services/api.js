const API_BASE_URL = '/api/v1'

class ApiService {
  async request(endpoint, options = {}) {
    console.log('API_BASE_URL', API_BASE_URL)
    console.log('endpoint', endpoint)
    const url = `${API_BASE_URL}${endpoint}`
    console.log('url', url)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Check if backend is available
  async checkBackendHealth() {
    try {
      await this.request('/recipe/by-id/1')
      return true
    } catch (error) {
      console.warn('Backend is not available:', error)
      return false
    }
  }

  // Get recipe by ID
  async getRecipeById(recipeId) {
    return this.request(`/recipe/by-id/${recipeId}`)
  }

  // Get trending recipe by offset
  async getTrendingRecipe(offset = 0, count = 1) {
    return this.request(`/recipe/trending/${offset}/${count}`)
  }

  // Get multiple trending recipes
  async getTrendingRecipes(offset = 0, count = 10) {
    return this.request(`/recipe/trending/${offset}/${count}`)
  }

  // Get recipes filtered by ingredients
  async getRecipesByIngredients(without, with_ = '-') {
    return this.request(`/recipe/filter/ingredient/${without}/${with_}`)
  }

  // Get recipes filtered by tags
  async getRecipesByTags(without, with_ = '-') {
    return this.request(`/recipe/filter/tag/${without}/${with_}`)
  }

  // Get all tags
  async getAllTags() {
    return this.request('/tag/all')
  }

  // Get tag by ID
  async getTagById(tagId) {
    return this.request(`/tag/by-id/${tagId}`)
  }

  // Get all ingredients
  async getAllIngredients() {
    return this.request('/ingredient/all')
  }

  // Get ingredient by ID
  async getIngredientById(ingredientId) {
    return this.request(`/ingredient/by-id/${ingredientId}`)
  }

  // Get multiple recipes by IDs
  async getRecipesByIds(recipeIds) {
    const idsString = Array.isArray(recipeIds) ? recipeIds.join(',') : recipeIds
    return this.request(`/recipe/by-id/${idsString}`)
  }

  // Save a new recipe
  async saveRecipe(recipeData) {
    return this.request('/recipe/save', {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    })
  }

  // Get all available recipes (you might want to add this endpoint to your Flask backend)
  async getAllRecipes() {
    // This would require adding a new endpoint to your Flask backend
    // For now, we'll use the existing endpoint with a range of IDs
    const recipeIds = Array.from({ length: 50 }, (_, i) => i + 1) // Get first 50 recipes
    return this.getRecipesByIds(recipeIds)
  }
}

export default new ApiService()
