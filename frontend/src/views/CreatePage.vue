<script setup>
import { reactive, watch, ref } from 'vue'
import ImageUpload from '../components/ImageUpload.vue'
import RecipeNameInput from '../components/RecipeNameInput.vue'
import TagsInput from '../components/TagsInput.vue'
import IngredientsTable from '../components/IngredientsTable.vue'
import InstructionsInput from '../components/InstructionsInput.vue'

// Reactive data for the form
const recipeData = reactive({
  image: null,
  name: '',
  tags: [''],
  ingredients: [{
    ingredient: '',
    amount: '',
    unit: 'g'
  }],
  instructions: ''
})

// Loading and error states
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref('')

// Watcher that prints recipeData every time it updates
watch(recipeData, (newValue) => {
  console.log('Recipe data updated:', newValue)
}, { deep: true })

// Function to export recipe data to JSON file
const exportRecipeToJSON = async (recipeData) => {
  try {
    // Generate a unique ID (you might want to implement a better ID generation system)
    const newId = Date.now()
    
    // Format the recipe data according to recipes.json structure
    const formattedRecipe = {
      id: newId,
      name: recipeData.name,
      image: recipeData.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop", // Default image if none provided
      rank: Math.floor(Math.random() * 3) + 3, // Random rank between 3-5
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Random rating between 3.5-5.0
      reviews: Math.floor(Math.random() * 20) + 5, // Random reviews between 5-25
      tags: recipeData.tags.filter(tag => tag.trim() !== ''),
      ingredients: recipeData.ingredients
        .filter(ing => ing.ingredient.trim() !== '')
        .map(ing => ({
          ingredient: ing.ingredient,
          amount: ing.amount,
          unit: ing.unit
        })),
      instructions: recipeData.instructions,
      isFavorited: false,
      likes: Math.floor(Math.random() * 100) + 50, // Random likes between 50-150
      dislikes: Math.floor(Math.random() * 10) + 1, // Random dislikes between 1-11
      comments: Math.floor(Math.random() * 30) + 10 // Random comments between 10-40
    }
    
    // Try to read existing recipes.json file
    let existingRecipes = []
    try {
      const response = await fetch('/src/data/recipes.json')
      if (response.ok) {
        const data = await response.json()
        existingRecipes = data.recipes || []
      }
    } catch (error) {
      console.log('Could not read existing recipes.json, starting fresh')
    }
    
    // Add the new recipe to existing recipes
    const updatedRecipes = [...existingRecipes, formattedRecipe]
    
    // Create the JSON structure with all recipes
    const jsonData = {
      recipes: updatedRecipes
    }
    
    // Convert to JSON string with proper formatting
    const jsonString = JSON.stringify(jsonData, null, 2)
    
    // Create a blob and download link for the updated recipes.json
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    // Create download link
    const link = document.createElement('a')
    link.href = url
    link.download = 'recipes.json'
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('Recipe added to recipes.json:', formattedRecipe)
    console.log('Total recipes in file:', updatedRecipes.length)
    return formattedRecipe
    
  } catch (error) {
    console.error('Error exporting recipe to JSON:', error)
    throw error
  }
}

// Handle form submission to Flask backend
const submitRecipe = async () => {
  try {
    isSubmitting.value = true
    submitError.value = ''
    submitSuccess.value = ''
    
    // Export recipe to JSON file
    const exportedRecipe = await exportRecipeToJSON(recipeData)
    
    // Create FormData for multipart/form-data upload
    const formData = new FormData()
    
    // Convert blob URL back to file for upload
    if (recipeData.image) {
      const response = await fetch(recipeData.image)
      const blob = await response.blob()
      const imageFile = new File([blob], 'recipe-image.jpg', { type: 'image/jpeg' })
      formData.append('image', imageFile)
    }
    
    // Add other form data
    formData.append('name', recipeData.name)
    formData.append('tags', JSON.stringify(recipeData.tags.filter(tag => tag.trim() !== '')))
    formData.append('ingredients', JSON.stringify(recipeData.ingredients.filter(ing => ing.ingredient.trim() !== '')))
    formData.append('instructions', recipeData.instructions)
    
    // Send to Flask backend
    const response = await fetch('http://localhost:5000/api/recipes', {
      method: 'POST',
      body: formData
      // Don't set Content-Type header - let browser set it with boundary
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('Recipe saved successfully:', result)
      submitSuccess.value = 'Recipe created successfully and exported to JSON!'
      resetForm()
    } else {
      throw new Error(result.error || `HTTP error! status: ${response.status}`)
    }
    
  } catch (error) {
    console.error('Error saving recipe:', error)
    submitError.value = error.message || 'Failed to save recipe. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Reset form after successful submission
const resetForm = () => {
  recipeData.image = null
  recipeData.name = ''
  recipeData.tags = ['']
  recipeData.ingredients = [{
    ingredient: '',
    amount: '',
    unit: 'g'
  }]
  recipeData.instructions = ''
}
</script>

<template>
  <div class="create-page">
    <div class="create-content">
      <h1>Create a New Recipe</h1>
      
      <!-- Success/Error Messages -->
      <div v-if="submitSuccess" class="success-message">
        {{ submitSuccess }}
      </div>
      <div v-if="submitError" class="error-message">
        {{ submitError }}
      </div>
      
      <form @submit.prevent="submitRecipe" class="recipe-form">
        <!-- Image Upload Section -->
        <div class="form-section">
          <h2>Recipe Image</h2>
          <ImageUpload 
            v-model:image="recipeData.image"
          />
        </div>

        <!-- Recipe Name Section -->
        <div class="form-section">
          <h2>Recipe Name</h2>
          <RecipeNameInput 
            v-model="recipeData.name"
          />
        </div>

        <!-- Tags Section -->
        <div class="form-section">
          <h2>Tags</h2>
          <TagsInput 
            v-model="recipeData.tags"
          />
        </div>

        <!-- Ingredients Section -->
        <div class="form-section">
          <h2>Ingredients</h2>
          <IngredientsTable 
            v-model="recipeData.ingredients"
          />
        </div>

        <!-- Instructions Section -->
        <div class="form-section">
          <h2>Instructions</h2>
          <InstructionsInput 
            v-model="recipeData.instructions"
          />
        </div>

        <!-- Submit Button -->
        <div class="form-section">
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Creating Recipe...' : 'Create Recipe' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-page {
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.create-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
}

.create-content h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-weight: 700;
  text-align: center;
}

.success-message {
  background: #1e4d2b;
  color: #4CAF50;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #4CAF50;
}

.error-message {
  background: #4d1e1e;
  color: #ff6b6b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #ff6b6b;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.form-section {
  background: #2d2d2d;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #404040;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  width: 100%;
  box-sizing: border-box;
}

.form-section h2 {
  margin: 0 0 1rem 0;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
}

.submit-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.submit-btn:hover:not(:disabled) {
  background: #45a049;
}

.submit-btn:disabled {
  background: #666666;
  cursor: not-allowed;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .create-content {
    padding: 0.75rem;
  }
  
  .form-section {
    padding: 1.25rem;
  }
  
  .create-content h1 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .create-content {
    padding: 0.5rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .create-content h1 {
    font-size: 1.5rem;
  }
  
  .form-section h2 {
    font-size: 1.2rem;
  }
}
</style>