<script setup>
import { ref } from 'vue'

import { getTranscript } from '../composables/getTranscript.js'
import { getAIRecipe } from '../composables/getAIRecipe.js'
import AIRecipeIngredientDisplay from '../components/AIRecipeIngredientDisplay.vue'
import AIRecipeInstructionDisplay from '../components/AIRecipeInstructionDisplay.vue'


const tiktokUrl = ref('')
const loading = ref(false)
const error = ref(null)
const aiRecipeResult = ref(null)
const aiError = ref(null)

const handleSearch = async () => {
  loading.value = true
  error.value = null
  aiRecipeResult.value = null
  aiError.value = null
  try {
    const transcript = await getTranscript(tiktokUrl.value)
    aiRecipeResult.value = await getAIRecipe(transcript)
  } catch (err) {
    error.value = err.message || 'Failed to fetch transcript or generate recipe.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <h1 class="section-title">Generated Recipes</h1>
    <div class="search-bar-container">
      <input v-model="tiktokUrl" placeholder="Enter TikTok video URL" class="url-input" @keyup.enter="handleSearch" />
      <button @click="handleSearch" :disabled="loading || !tiktokUrl" class="search-btn" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#fff" stroke-width="2"/><path stroke="#fff" stroke-width="2" stroke-linecap="round" d="M20 20l-3-3"/></svg>
      </button>
    </div>
    <div v-if="error" class="error-msg">{{ error }}</div>
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
  background: #4CAF50;
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
  color: #4CAF50;
  margin-top: 1rem;
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
</style>
