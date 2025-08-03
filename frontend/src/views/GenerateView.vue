<script setup>
import { ref } from 'vue'
import { getTranscript } from '../composables/getTranscript.js'

const tiktokUrl = ref('')
const transcriptResult = ref(null)
const loading = ref(false)
const error = ref(null)

const handleGetTranscript = async () => {
  loading.value = true
  error.value = null
  transcriptResult.value = null
  try {
    transcriptResult.value = await getTranscript(tiktokUrl.value)
  } catch (err) {
    error.value = err.message || 'Failed to fetch transcript.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <h1 class="section-title">Generated Recipes</h1>
    <div class="transcript-section">
      <input v-model="tiktokUrl" placeholder="Enter TikTok video URL" class="url-input" />
      <button @click="handleGetTranscript" :disabled="loading || !tiktokUrl" class="transcript-btn">
        {{ loading ? 'Loading...' : 'Get Transcript' }}
      </button>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="transcriptResult" class="transcript-result">
        <pre>{{ transcriptResult }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transcript-section {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
.url-input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 300px;
  max-width: 100%;
}
.transcript-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  background: #4CAF50;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.transcript-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}
.error-msg {
  color: #dc3545;
}
.transcript-result {
  background: #222;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  max-width: 100%;
  overflow-x: auto;
}
</style>
