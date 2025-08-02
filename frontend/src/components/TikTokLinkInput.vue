<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// Validate TikTok URL format
const validateTikTokUrl = (url) => {
  if (!url) return true // Empty is valid (optional field)
  const tiktokRegex = /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/
  return tiktokRegex.test(url)
}

// Handle input change with validation
const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="tiktok-link-container">
    <input 
      type="url" 
      :value="modelValue"
      @input="handleInput"
      placeholder="https://www.tiktok.com/@username/video/1234567890"
      class="tiktok-link-input"
    />
    <div class="input-hint">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.7-1.35 3.73-1.31 1.31-3.07 1.61-4.89 1.32-1.83-.29-3.34-1.31-4.08-3.01-.55-1.34-.4-2.79-.35-4.2.1-2.76.06-5.52.07-8.28.01-.82-.02-1.64.02-2.45.07-1.3.47-2.48 1.32-3.35 1.24-1.24 2.84-1.61 4.44-1.35.47.07.93.23 1.37.42z"/>
      </svg>
      <span>Optional: Add TikTok video link for this recipe</span>
    </div>
  </div>
</template>

<style scoped>
.tiktok-link-container {
  width: 100%;
}

.tiktok-link-input {
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  border: 2px solid #404040;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  background: #404040;
  color: #ffffff;
}

.tiktok-link-input::placeholder {
  color: #b0b0b0;
}

.tiktok-link-input:focus {
  outline: none;
  border-color: #4CAF50;
  background: #505050;
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.875rem;
  color: #b0b0b0;
}

.input-hint svg {
  color: #4CAF50;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .tiktok-link-input {
    font-size: 0.95rem;
    padding: 10px 14px;
  }
  
  .input-hint {
    font-size: 0.8rem;
  }
}
</style> 