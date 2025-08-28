<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getTranscript } from '../composables/getTranscript.js'
import { getAIRecipe } from '../composables/getAIRecipe.js'
import { useRecipes } from '../composables/useRecipes.js'
import AIRecipeIngredientDisplay from '../components/AIRecipeIngredientDisplay.vue'
import AIRecipeInstructionDisplay from '../components/AIRecipeInstructionDisplay.vue'

const router = useRouter()
const tiktokUrl = ref('')
const loading = ref(false)
const error = ref(null)
const aiRecipeResult = ref(null)
const aiError = ref(null)

// Function to generate random colors for recipe backgrounds
const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

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
      image: aiRecipeResult.value.image || generateRandomColor(),
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

      // Wait a moment to show success message, then redirect to recipe page
      setTimeout(() => {
        console.log('Attempting to navigate to recipe:', savedRecipe.id)
        router.push({ name: 'Recipe', params: { id: savedRecipe.id } })
          .then(() => {
            console.log('Navigation successful')
          })
          .catch((error) => {
            console.error('Navigation failed:', error)
          })
      }, 1500)
    } else {
      console.log("Didn't save")
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
  <div class="generate-page">
    <div class="generate-content">
      <h1 class="section-title">Generate AI Recipes</h1>

      <!-- Success/Error Messages -->
      <div v-if="saveSuccess" class="success-message">{{ saveSuccess }}</div>
      <div v-if="saveError" class="error-message">{{ saveError }}</div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="aiError" class="error-message">{{ aiError }}</div>

      <!-- URL Input Section -->
      <div class="form-section">
        <h2>Enter TikTok Video URL</h2>
        <div class="search-bar-container">
          <input v-model="tiktokUrl" placeholder="Paste TikTok video URL here..." class="form-input"
            @keyup.enter="handleSearch" />
          <button @click="handleSearch" :disabled="loading || !tiktokUrl" class="search-btn" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="#fff" stroke-width="2" />
              <path stroke="#fff" stroke-width="2" stroke-linecap="round" d="M20 20l-3-3" />
            </svg>
            {{ loading ? 'Generating...' : 'Generate Recipe' }}
          </button>
        </div>
        <div v-if="loading" class="loading-message">Generating your recipe...</div>
      </div>

      <!-- Generated Recipe Section -->
      <div v-if="aiRecipeResult" class="form-section">
        <h2>Generated Recipe</h2>

        <!-- Save Button -->
        <div class="save-button-container">
          <button @click="handleSaveRecipe" :disabled="isSaving" class="submit-btn" aria-label="Save Recipe">
            {{ isSaving ? 'Saving Recipe...' : 'Save Recipe' }}
          </button>
        </div>

        <!-- Recipe Display -->
        <div class="recipe-display">
          <AIRecipeIngredientDisplay :recipe="aiRecipeResult" />
          <AIRecipeInstructionDisplay :recipe="aiRecipeResult" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generate-page {
  background-color: var(--color-background);
  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 100px;
  min-height: 90vh;
}

.generate-content {
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  color: var(--color-text);
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
}

.form-section {
  margin-bottom: 30px;
  background-color: var(--color-background-secondary);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.form-section h2 {
  margin-bottom: 20px;
  color: var(--color-text);
  font-size: 20px;
  font-weight: 600;
}

.success-message {
  background-color: #4caf50;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

.error-message {
  background-color: #f44336;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

.loading-message {
  color: var(--color-accent);
  text-align: center;
  font-weight: 500;
  margin-top: 15px;
}

.search-bar-container {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.form-input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: var(--color-background);
  color: var(--color-text);
  min-height: 50px;
}

.form-input::placeholder {
  color: var(--color-text-secondary);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  background: var(--color-background);
  box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.1);
}

.search-btn {
  padding: 14px 24px;
  border: none;
  background: var(--color-accent);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-height: 50px;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-btn:disabled {
  background: var(--color-disabled);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.save-button-container {
  margin-bottom: 25px;
  text-align: center;
}

.submit-btn {
  background-color: var(--color-accent);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:disabled {
  background: var(--color-disabled);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.recipe-display {
  margin-top: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .generate-page {
    padding: 15px;
  }

  .search-bar-container {
    flex-direction: column;
  }

  .search-btn {
    justify-content: center;
  }

  .form-section {
    padding: 20px;
  }

  .section-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .generate-content {
    max-width: 100%;
  }

  .form-section {
    padding: 15px;
  }

  .section-title {
    font-size: 24px;
  }
}
</style>
