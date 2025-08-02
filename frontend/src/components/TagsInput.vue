<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => ['']
  }
})

const emit = defineEmits(['update:modelValue'])

// Add new tag
const addTag = () => {
  const newTags = [...props.modelValue, '']
  emit('update:modelValue', newTags)
}

// Remove tag
const removeTag = (index) => {
  if (props.modelValue.length > 1) {
    const newTags = [...props.modelValue]
    newTags.splice(index, 1)
    emit('update:modelValue', newTags)
  }
}

// Update tag value
const updateTag = (index, value) => {
  const newTags = [...props.modelValue]
  newTags[index] = value
  emit('update:modelValue', newTags)
}
</script>

<template>
  <div class="tags-container">
    <div 
      v-for="(tag, index) in modelValue" 
      :key="index" 
      class="tag-input-group"
    >
      <input 
        type="text" 
        :value="tag"
        @input="updateTag(index, $event.target.value)"
        placeholder="Enter tag"
        class="tag-input"
      />
      <button 
        type="button" 
        @click="removeTag(index)" 
        class="remove-btn"
        v-if="modelValue.length > 1"
      >
        ×
      </button>
    </div>
    <button 
      type="button" 
      @click="addTag" 
      class="add-btn"
    >
      + Add Tag
    </button>
  </div>
</template>

<style scoped>
.tags-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.tag-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.tag-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  min-width: 0;
}

.tag-input:focus {
  outline: none;
  border-color: #007bff;
}

.add-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.add-btn:hover {
  background: #218838;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #c82333;
}

@media (max-width: 480px) {
  .tag-input {
    font-size: 0.85rem;
    padding: 8px 10px;
  }
  
  .add-btn {
    font-size: 0.85rem;
    padding: 8px 16px;
  }
  
  .remove-btn {
    width: 26px;
    height: 26px;
    font-size: 1.1rem;
  }
}
</style> 