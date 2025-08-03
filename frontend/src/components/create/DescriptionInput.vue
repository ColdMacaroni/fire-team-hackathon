<script setup>
  import { defineProps, defineEmits } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <textarea
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    placeholder="Enter a brief description of your recipe..."
    class="description-textarea"
    rows="4"
    required
  ></textarea>
</template>

<style scoped>
  .description-textarea {
    width: 100%;
    max-width: 100%;
    padding: 16px;
    border: 2px solid #404040;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    box-sizing: border-box;
    background: #404040;
    color: #ffffff;
  }

  .description-textarea::placeholder {
    color: #b0b0b0;
  }

  .description-textarea:focus {
    outline: none;
    border-color: var(--color-accent);
    background: #505050;
  }

  @media (max-width: 480px) {
    .description-textarea {
      font-size: 0.95rem;
      padding: 14px;
      min-height: 80px;
    }
  }
</style>
