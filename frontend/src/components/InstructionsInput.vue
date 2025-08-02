<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <textarea 
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    placeholder="Enter cooking instructions step by step..."
    class="instructions-textarea"
    rows="8"
    required
  ></textarea>
</template>

<style scoped>
.instructions-textarea {
  width: 100%;
  max-width: 100%;
  padding: 16px;
  border: 2px solid #404040;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 150px;
  box-sizing: border-box;
  background: #404040;
  color: #ffffff;
}

.instructions-textarea::placeholder {
  color: #b0b0b0;
}

.instructions-textarea:focus {
  outline: none;
  border-color: #4CAF50;
  background: #505050;
}

@media (max-width: 480px) {
  .instructions-textarea {
    font-size: 0.95rem;
    padding: 14px;
    min-height: 120px;
  }
}
</style> 