<script setup>
  import { ref } from 'vue'

  import { getTranscript } from '../composables/getTranscript.js'
  import { getAIRecipe } from '../composables/getAIRecipe.js'
  import { useRecipes } from '../composables/useRecipes.js'
  import AIRecipeIngredientDisplay from '../components/AIRecipeIngredientDisplay.vue'
  import AIRecipeInstructionDisplay from '../components/AIRecipeInstructionDisplay.vue'

  const tiktokUrl = ref('')
  const loading = ref(false)
  const error = ref(null)
  const aiRecipeResult = ref(null)
  const aiError = ref(null)

  // Use recipes composable
  const {
    saveRecipe,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes()

  // Loading and error states for save operation
  const isSaving = ref(false)
  const saveError = ref('')
  const saveSuccess = ref('')

  const handleSearch = async () => {
    loading.value = true
    error.value = null
    aiRecipeResult.value = null
    aiError.value = null
    saveError.value = ''
    saveSuccess.value = ''
    try {
      const transcript = await getTranscript(tiktokUrl.value)
      console.log(transcript)
      const aiResponse = await getAIRecipe(transcript)
      console.log(aiResponse)

      // Parse the JSON response from AI
      try {
        // Clean the response - remove markdown code blocks if present
        let cleanedResponse = aiResponse.trim()

        // Remove ```json and ``` if they exist
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '')
        }
        if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\s*/, '')
        }
        if (cleanedResponse.endsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/\s*```$/, '')
        }

        // Fix newline issues in JSON - handle multiline strings properly
        // First, let's try to parse as-is, and if it fails, we'll try to fix it
        try {
          aiRecipeResult.value = JSON.parse(cleanedResponse)
        } catch (parseError) {
          // If parsing fails, try to fix common issues
          console.log('Initial parse failed, attempting to fix JSON...')

          // Replace actual newlines with escaped newlines, but be more careful
          let fixedResponse = cleanedResponse

          // Find all string values and fix newlines within them
          fixedResponse = fixedResponse.replace(
            /"([^"]*(?:\n[^"]*)*)"/g,
            (match, content) => {
              return '"' + content.replace(/\n/g, '\\n') + '"'
            }
          )

          aiRecipeResult.value = JSON.parse(fixedResponse)
        }

        console.log(cleanedResponse)
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError)
        aiError.value = 'Failed to parse AI recipe response'
      }
    } catch (err) {
      error.value =
        err.message || 'Failed to fetch transcript or generate recipe.'
    } finally {
      loading.value = false
    }
  }

  // Handle saving the AI-generated recipe
  const handleSaveRecipe = async () => {
    if (!aiRecipeResult.value) return

    try {
      isSaving.value = true
      saveError.value = ''
      saveSuccess.value = ''

      // Debug: Log the original AI recipe result
      console.log('Original AI recipe result:', aiRecipeResult.value)

      // Format the AI recipe data to match the exact structure expected by the backend
      const recipeData = {
        name:
          (aiRecipeResult.value.name || 'AI Generated Recipe') +
          ' - ' +
          new Date().toISOString().slice(0, 19).replace('T', ' '),
        image: aiRecipeResult.value.image || '/recipe_not_found.png',
        tags: Array.isArray(aiRecipeResult.value.tags)
          ? aiRecipeResult.value.tags.filter(tag => tag && tag.trim() !== '')
          : [''],
        ingredients: Array.isArray(aiRecipeResult.value.ingredients)
          ? aiRecipeResult.value.ingredients
              .map(ing => {
                // Handle different possible ingredient formats from AI
                const ingredientName =
                  ing.ingredient || ing.name || ing.item || ''
                const amount = ing.amount || ing.quantity || ing.qty || ''
                const unit = ing.unit || 'g'

                return {
                  ingredient: ingredientName,
                  amount: amount,
                  unit: unit,
                }
              })
              .filter(ing => ing.ingredient.trim() !== '') // Remove empty ingredients
          : [
              {
                ingredient: 'Sample ingredient',
                amount: '1',
                unit: 'g',
              },
            ],
        instructions: aiRecipeResult.value.instructions || '',
        description: aiRecipeResult.value.description || 'No Description',
        cooktime: parseInt(aiRecipeResult.value.cookingTime) || 30,
        difficulty: parseInt(aiRecipeResult.value.difficulty) || 2,
      }

      console.log('Formatted recipe data:', recipeData)
      console.log(
        'Formatted recipe data JSON:',
        JSON.stringify(recipeData, null, 2)
      )

      // Validate required fields
      if (!recipeData.name || recipeData.name.trim() === '') {
        throw new Error('Recipe name is required')
      }

      if (!recipeData.instructions || recipeData.instructions.trim() === '') {
        throw new Error('Recipe instructions are required')
      }

      if (
        !Array.isArray(recipeData.ingredients) ||
        recipeData.ingredients.length === 0
      ) {
        throw new Error('At least one ingredient is required')
      }

      const savedRecipe = await saveRecipe(recipeData)

      if (savedRecipe) {
        console.log('Recipe saved successfully:', savedRecipe)
        saveSuccess.value = 'Recipe saved successfully!'
      } else {
        saveError.value = 'Failed to save recipe. Please try again.'
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
      saveError.value =
        error.message || 'Failed to save recipe. Please try again.'
    } finally {
      isSaving.value = false
    }
  }
</script>

<template>
  <div class="page-container">
    <!-- Save Button - appears at top when AI recipe is generated -->
    <div v-if="aiRecipeResult" class="save-button-container">
      <button
        @click="handleSaveRecipe"
        :disabled="isSaving"
        class="save-btn"
        aria-label="Save Recipe"
      >
        {{ isSaving ? 'Saving Recipe...' : 'Save Recipe' }}
      </button>
      <div v-if="saveSuccess" class="success-msg">{{ saveSuccess }}</div>
      <div v-if="saveError" class="error-msg">{{ saveError }}</div>
    </div>

    <h1 class="section-title">Generated Recipes</h1>

    <div class="search-bar-container">
      <input
        v-model="tiktokUrl"
        placeholder="Enter TikTok video URL"
        class="url-input"
        @keyup.enter="handleSearch"
      />
      <button
        @click="handleSearch"
        :disabled="loading || !tiktokUrl"
        class="search-btn"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" stroke="#fff" stroke-width="2" />
          <path
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
            d="M20 20l-3-3"
          />
        </svg>
      </button>
    </div>
    <div v-if="error" class="error-msg">{{ error }}</div>
    <div v-if="aiError" class="error-msg">{{ aiError }}</div>
    <div v-if="loading" class="loading-msg">Loading...</div>
    <div v-if="aiRecipeResult" class="recipe-container">
      <AIRecipeIngredientDisplay :recipe="aiRecipeResult" />
      <AIRecipeInstructionDisplay :recipe="aiRecipeResult" />
    </div>
  </div>
</template>

<style scoped>
  .search-bar-container {
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  .url-input {
    padding: 0.5rem 1rem;
    border-radius: 6px 0 0 6px;
    border: 1px solid #ccc;
    width: 300px;
    max-width: 100%;
    font-size: 1rem;
  }
  .search-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: #4caf50;
    color: #fff;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
  }
  .search-btn:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
  .error-msg {
    color: #dc3545;
    margin-top: 1rem;
  }
  .loading-msg {
    color: #4caf50;
    margin-top: 1rem;
  }
  .recipe-container {
    border-radius: 8px;
    margin-top: 2rem;
  }

  .transcript-result {
    background: #222;
    color: #fff;
    padding: 1rem;
    border-radius: 8px;
    max-width: 100%;
    overflow-x: auto;
    margin-top: 1.5rem;
  }

  .save-button-container {
    margin: 1rem 0 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .save-btn {
    background-color: var(--color-accent);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
    max-width: 300px;
  }

  .save-btn:hover:not(:disabled) {
    background-color: #1976d2;
  }

  .save-btn:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }

  .success-msg {
    background-color: #4caf50;
    color: white;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
  }
</style>
