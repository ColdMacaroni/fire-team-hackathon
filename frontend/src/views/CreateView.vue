<script setup>
  import { reactive, watch, ref } from 'vue'
  import ImageUpload from '../components/create/ImageUpload.vue'
  import RecipeNameInput from '../components/create/RecipeNameInput.vue'
  import TagsInput from '../components/create/TagsInput.vue'
  import IngredientsTable from '../components/create/IngredientsTable.vue'
  import InstructionsInput from '../components/create/InstructionsInput.vue'

  // Reactive data for the form
  const recipeData = reactive({
    image: null,
    name: '',
    tags: [''],
    ingredients: [
      {
        ingredient: '',
        amount: '',
        unit: 'g',
      },
    ],
    instructions: '',
  })

  // Loading and error states
  const isSubmitting = ref(false)
  const submitError = ref('')
  const submitSuccess = ref('')

  // Watcher that prints recipeData every time it updates
  watch(
    recipeData,
    newValue => {
      console.log('Recipe data updated:', newValue)
    },
    { deep: true }
  )

  // Function to export recipe data to JSON file
  const exportRecipeToJSON = async recipeData => {
    try {
      // Generate a unique ID (you might want to implement a better ID generation system)
      const newId = Date.now()

      // Format the recipe data according to recipes.json structure
      const formattedRecipe = {
        id: newId,
        name: recipeData.name,
        image: recipeData.image || '', // Default image if none provided
        rank: 0, // Random rank between 3-5
        rating: 0, // Random rating between 3.5-5.0
        reviews: 0, // Random reviews between 5-25
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
        likes: 0, // Random likes between 50-150
        dislikes: 0, // Random dislikes between 1-11
        comments: 0, // Random comments between 10-40
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
        recipes: updatedRecipes,
      }

      // Convert to JSON string with proper formatting
      const jsonString = JSON.stringify(jsonData, null, 2)

      // Save to localStorage as fallback
      try {
        const existingRecipes = JSON.parse(
          localStorage.getItem('createdRecipes') || '[]'
        )
        existingRecipes.push(formattedRecipe)
        localStorage.setItem('createdRecipes', JSON.stringify(existingRecipes))
        console.log('Recipe saved to localStorage:', formattedRecipe)
        console.log('Total recipes in localStorage:', existingRecipes.length)
      } catch (error) {
        console.error('Failed to save recipe to localStorage:', error)
      }

      // Send the recipe to the backend to save to recipes.json
      try {
        const saveResponse = await fetch(
          "/api/v1/recipe/save",
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedRecipe),
          }
        )

        if (saveResponse.ok) {
          const saveResult = await saveResponse.json()
          console.log('Recipe saved to recipes.json:', saveResult)
        } else {
          console.error('Failed to save recipe to JSON file')
        }
      } catch (error) {
        console.error(
          'Backend save failed, but recipe is saved in localStorage:',
          error
        )
      }

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
        var reader = new FileReader();
        var imageFile = reader.readAsDataURL(blob);
        formData.append('image', imageFile)
      }

      // Add other form data
      formData.append('name', recipeData.name)
      formData.append(
        'tags',
        JSON.stringify(recipeData.tags.filter(tag => tag.trim() !== ''))
      )
      formData.append(
        'ingredients',
        JSON.stringify(
          recipeData.ingredients.filter(ing => ing.ingredient.trim() !== '')
        )
      )
      formData.append('instructions', recipeData.instructions)

      // Send to Flask backend
      const response = await fetch('/api/v1/recipe/save', {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('Recipe saved successfully:', result)
        submitSuccess.value =
          'Recipe created successfully and exported to JSON!'
        resetForm()
      } else {
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
      submitError.value =
        error.message || 'Failed to save recipe. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }

  // Reset form after successful submission
  const resetForm = () => {
    recipeData.image = null
    recipeData.name = ''
    recipeData.tags = ['']
    recipeData.ingredients = [
      {
        ingredient: '',
        amount: '',
        unit: 'g',
      },
    ]
    recipeData.instructions = ''
  }
</script>

<template>
  <div class="create-page" data-v-inspector="src/views/CreateView.vue:191:5">
    <div
      class="create-content"
      data-v-inspector="src/views/CreateView.vue:192:9"
    >
      <h1
        class="section-title"
        data-v-inspector="src/views/CreateView.vue:193:13"
      >
        Create a New Recipe
      </h1>

      <!-- Success/Error Messages -->
      <div
        v-if="submitSuccess"
        class="success-message"
        data-v-inspector="src/views/CreateView.vue:196:13"
      >
        {{ submitSuccess }}
      </div>
      <div
        v-if="submitError"
        class="error-message"
        data-v-inspector="src/views/CreateView.vue:199:13"
      >
        {{ submitError }}
      </div>

      <form
        @submit.prevent="submitRecipe"
        class="recipe-form"
        data-v-inspector="src/views/CreateView.vue:203:13"
      >
        <!-- Image Upload Section -->
        <div
          class="form-section"
          data-v-inspector="src/views/CreateView.vue:205:17"
        >
          <h2 data-v-inspector="src/views/CreateView.vue:206:21">
            Recipe Image
          </h2>
          <ImageUpload
            v-model:image="recipeData.image"
            data-v-inspector="src/views/CreateView.vue:207:21"
          />
        </div>

        <!-- Recipe Name Section -->
        <div
          class="form-section"
          data-v-inspector="src/views/CreateView.vue:211:17"
        >
          <h2 data-v-inspector="src/views/CreateView.vue:212:21">
            Recipe Name
          </h2>
          <RecipeNameInput
            v-model="recipeData.name"
            data-v-inspector="src/views/CreateView.vue:213:21"
          />
        </div>

        <!-- Tags Section -->
        <div
          class="form-section"
          data-v-inspector="src/views/CreateView.vue:217:17"
        >
          <h2 data-v-inspector="src/views/CreateView.vue:218:21">Tags</h2>
          <TagsInput
            v-model="recipeData.tags"
            data-v-inspector="src/views/CreateView.vue:219:21"
          />
        </div>

        <!-- Ingredients Section -->
        <div
          class="form-section"
          data-v-inspector="src/views/CreateView.vue:223:17"
        >
          <h2 data-v-inspector="src/views/CreateView.vue:224:21">
            Ingredients
          </h2>
          <IngredientsTable
            v-model="recipeData.ingredients"
            data-v-inspector="src/views/CreateView.vue:225:21"
          />
        </div>

        <!-- Instructions Section -->
        <div
          class="form-section"
          data-v-inspector="src/views/CreateView.vue:229:17"
        >
          <h2 data-v-inspector="src/views/CreateView.vue:230:21">
            Instructions
          </h2>
          <InstructionsInput
            v-model="recipeData.instructions"
            data-v-inspector="src/views/CreateView.vue:231:21"
          />
        </div>

        <!-- Submit Button -->
        <div
          class="form-section"
          data-v-inspector="src/views/CreateView.vue:235:17"
        >
          <button
            type="submit"
            class="submit-btn"
            :disabled="isSubmitting"
            data-v-inspector="src/views/CreateView.vue:236:21"
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
    background-color: var(--color-background);
    padding: 20px;
    box-sizing: border-box;
    padding-bottom: 100px;
    min-height: 90vh;
  }

  .create-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-section {
    margin-bottom: 30px;
  }

  .form-section h2 {
    margin-bottom: 15px;
    color: var(--color-text);
    font-size: 18px;
  }

  .success-message {
    background-color: #4caf50;
    color: white;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .error-message {
    background-color: #f44336;
    color: white;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .submit-btn {
    background-color: var(--color-accent);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
  }
</style>
