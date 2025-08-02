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
  <input 
    type="text" 
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    placeholder="Enter recipe name"
    class="recipe-name-input"
    required
  />
</template>

<style scoped>
.recipe-name-input {
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.recipe-name-input:focus {
  outline: none;
  border-color: #007bff;
}

@media (max-width: 480px) {
  .recipe-name-input {
    font-size: 0.95rem;
    padding: 10px 14px;
  }
}
</style> 