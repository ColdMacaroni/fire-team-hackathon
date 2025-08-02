<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [{
      ingredient: '',
      amount: '',
      unit: 'g'
    }]
  }
})

const emit = defineEmits(['update:modelValue'])

// Available units for ingredients
const units = [
  'g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'piece', 'slice', 'clove', 'bunch'
]

// Add new ingredient row
const addIngredient = () => {
  const newIngredients = [...props.modelValue, {
    ingredient: '',
    amount: '',
    unit: 'g'
  }]
  emit('update:modelValue', newIngredients)
}

// Remove ingredient row
const removeIngredient = (index) => {
  if (props.modelValue.length > 1) {
    const newIngredients = [...props.modelValue]
    newIngredients.splice(index, 1)
    emit('update:modelValue', newIngredients)
  }
}

// Update ingredient field
const updateIngredient = (index, field, value) => {
  const newIngredients = [...props.modelValue]
  newIngredients[index] = {
    ...newIngredients[index],
    [field]: value
  }
  emit('update:modelValue', newIngredients)
}
</script>

<template>
  <div class="ingredients-section">
    <div class="ingredients-table">
      <div class="table-header">
        <div class="header-cell">Ingredient</div>
        <div class="header-cell">Amount</div>
        <div class="header-cell">Unit</div>
        <div class="header-cell">Action</div>
      </div>
      <div 
        v-for="(ingredient, index) in modelValue" 
        :key="index" 
        class="table-row"
      >
        <div class="table-cell">
          <input 
            type="text" 
            :value="ingredient.ingredient"
            @input="updateIngredient(index, 'ingredient', $event.target.value)"
            placeholder="Ingredient name"
            class="ingredient-input"
          />
        </div>
        <div class="table-cell">
          <input 
            type="number" 
            :value="ingredient.amount"
            @input="updateIngredient(index, 'amount', $event.target.value)"
            placeholder="Amount"
            class="amount-input"
            step="0.1"
            min="0"
          />
        </div>
        <div class="table-cell">
          <select 
            :value="ingredient.unit"
            @change="updateIngredient(index, 'unit', $event.target.value)"
            class="unit-select"
          >
            <option v-for="unit in units" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
        <div class="table-cell">
          <button 
            type="button" 
            @click="removeIngredient(index)" 
            class="remove-btn"
            v-if="modelValue.length > 1"
          >
            ×
          </button>
        </div>
      </div>
    </div>
    <button 
      type="button" 
      @click="addIngredient" 
      class="add-btn"
    >
      + Add Ingredient
    </button>
  </div>
</template>

<style scoped>
.ingredients-section {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.ingredients-table {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 80px 80px 60px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  width: 100%;
}

.header-cell {
  padding: 8px 4px;
  font-weight: 600;
  color: #495057;
  font-size: 0.8rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 80px 80px 60px;
  border-bottom: 1px solid #dee2e6;
  width: 100%;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 8px 4px;
  display: flex;
  align-items: center;
  min-width: 0;
}

.ingredient-input,
.amount-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.8rem;
  box-sizing: border-box;
  min-width: 0;
}

.ingredient-input:focus,
.amount-input:focus {
  outline: none;
  border-color: #007bff;
}

.unit-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.8rem;
  background: white;
  box-sizing: border-box;
  min-width: 0;
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
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

/* Responsive Design */
@media (max-width: 480px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr 70px 70px 50px;
  }
  
  .header-cell,
  .table-cell {
    padding: 6px 2px;
    font-size: 0.75rem;
  }
  
  .ingredient-input,
  .amount-input,
  .unit-select {
    font-size: 0.75rem;
    padding: 4px 6px;
  }
  
  .remove-btn {
    width: 20px;
    height: 20px;
    font-size: 0.9rem;
  }
}
</style> 