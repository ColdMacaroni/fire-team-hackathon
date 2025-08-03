<script setup>
  import { reactive, watch, ref } from 'vue'
  import { useRecipes } from '../composables/useRecipes.js'
  import ImageUpload from '../components/create/ImageUpload.vue'
  import RecipeNameInput from '../components/create/RecipeNameInput.vue'
  import TagsInput from '../components/create/TagsInput.vue'
  import IngredientsTable from '../components/create/IngredientsTable.vue'
  import InstructionsInput from '../components/create/InstructionsInput.vue'
  import DescriptionInput from '../components/create/DescriptionInput.vue'

  // Use recipes composable
  const {
    saveRecipe,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes()

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
    description: '',
    cookingTime: '',
    difficulty: 1,
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

  // Handle form submission using useRecipes
  const submitRecipe = async () => {
    try {
      isSubmitting.value = true
      submitError.value = ''
      submitSuccess.value = ''

      // Save recipe using useRecipes composable
      console.log(recipeData)
      const savedRecipe = await saveRecipe(recipeData)

      if (savedRecipe) {
        console.log('Recipe saved successfully:', savedRecipe)
        submitSuccess.value = 'Recipe created successfully!'
        resetForm()
      } else {
        submitError.value = 'Failed to save recipe. Please try again.'
        console.log("Couldn't save")
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
    recipeData.description = ''
    recipeData.cookingTime = ''
    recipeData.difficulty = 1
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
            Recipe Name*
          </h2>
          <RecipeNameInput
            v-model="recipeData.name"
            data-v-inspector="src/views/CreateView.vue:213:21"
          />
        </div>

        <!-- Description Section -->
        <div class="form-section">
          <h2>Description</h2>
          <DescriptionInput v-model="recipeData.description" />
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

        <!-- Cooking Time Section -->
        <div class="form-section">
          <h2>Cooking Time (minutes)</h2>
          <input
            v-model="recipeData.cookingTime"
            type="number"
            min="1"
            placeholder="Enter cooking time in minutes"
            class="form-input"
          />
        </div>

        <!-- Difficulty Section -->
        <div class="form-section">
          <h2>Difficulty Level</h2>
          <select v-model="recipeData.difficulty" class="form-input">
            <option value="1">1 - Easy</option>
            <option value="2">2 - Beginner</option>
            <option value="3">3 - Intermediate</option>
            <option value="4">4 - Advanced</option>
            <option value="5">5 - Expert</option>
          </select>
        </div>

        <!-- Ingredients Section -->
        <div
          class="form-section"
          data-v-inspector="src/views/CreateView.vue:223:17"
        >
          <h2 data-v-inspector="src/views/CreateView.vue:224:21">
            Ingredients*
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
            Instructions*
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

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #404040;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    background: #404040;
    color: #ffffff;
  }

  .form-input::placeholder {
    color: #b0b0b0;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-accent);
    background: #505050;
  }

  .form-input option {
    background: #404040;
    color: #ffffff;
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
