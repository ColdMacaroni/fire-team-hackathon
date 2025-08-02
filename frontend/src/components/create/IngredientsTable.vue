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
  <div class="ingredients-section" data-v-inspector="src/components/create/IngredientsTable.vue:53:3">
    <div class="ingredients-table" data-v-inspector="src/components/create/IngredientsTable.vue:54:5">
      <div class="table-header" data-v-inspector="src/components/create/IngredientsTable.vue:55:7">
        <div class="header-cell" data-v-inspector="src/components/create/IngredientsTable.vue:56:9">Ingredient</div>
        <div class="header-cell" data-v-inspector="src/components/create/IngredientsTable.vue:57:9">Amount</div>
        <div class="header-cell" data-v-inspector="src/components/create/IngredientsTable.vue:58:9">Unit</div>
        <div class="header-cell" data-v-inspector="src/components/create/IngredientsTable.vue:59:9">Action</div>
      </div>
      <div v-for="(ingredient, index) in modelValue" :key="index" class="table-row" data-v-inspector="src/components/create/IngredientsTable.vue:61:7">
        <div class="table-cell" data-v-inspector="src/components/create/IngredientsTable.vue:62:9">
          <input type="text" :value="ingredient.ingredient"
            @input="updateIngredient(index, 'ingredient', $event.target.value)" placeholder="Ingredient name"
            class="ingredient-input" data-v-inspector="src/components/create/IngredientsTable.vue:63:11" />
        </div>
        <div class="table-cell" data-v-inspector="src/components/create/IngredientsTable.vue:67:9">
          <input type="number" :value="ingredient.amount"
            @input="updateIngredient(index, 'amount', $event.target.value)" placeholder="Amount" class="amount-input"
            step="0.1" min="0" data-v-inspector="src/components/create/IngredientsTable.vue:68:11" />
        </div>
        <div class="table-cell" data-v-inspector="src/components/create/IngredientsTable.vue:72:9">
          <select :value="ingredient.unit" @change="updateIngredient(index, 'unit', $event.target.value)"
            class="unit-select" data-v-inspector="src/components/create/IngredientsTable.vue:73:11">
            <option v-for="unit in units" :key="unit" :value="unit" data-v-inspector="src/components/create/IngredientsTable.vue:75:13">
              {{ unit }}
            </option>
          </select>
        </div>
        <div class="table-cell" data-v-inspector="src/components/create/IngredientsTable.vue:80:9">
          <button type="button" @click="removeIngredient(index)" class="remove-btn" v-if="modelValue.length > 1" data-v-inspector="src/components/create/IngredientsTable.vue:81:11">
            ×
          </button>
        </div>
      </div>
    </div>
    <button type="button" @click="addIngredient" class="add-btn" data-v-inspector="src/components/create/IngredientsTable.vue:87:5">
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
  border: 1px solid #404040;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 80px 80px 60px;
  background: #404040;
  border-bottom: 1px solid #505050;
  width: 100%;
}

.header-cell {
  padding: 8px 4px;
  font-weight: 600;
  color: #ffffff;
  font-size: 0.8rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 80px 80px 60px;
  border-bottom: 1px solid #404040;
  width: 100%;
  background: #2d2d2d;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:nth-child(even) {
  background: #353535;
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
  border: 1px solid #505050;
  border-radius: 4px;
  font-size: 0.8rem;
  box-sizing: border-box;
  min-width: 0;
  background: #404040;
  color: #ffffff;
}

.ingredient-input::placeholder,
.amount-input::placeholder {
  color: #b0b0b0;
}

.ingredient-input:focus,
.amount-input:focus {
  outline: none;
  border-color: #4CAF50;
  background: #505050;
}

.unit-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #505050;
  border-radius: 4px;
  font-size: 0.8rem;
  background: #404040;
  color: #ffffff;
  box-sizing: border-box;
  min-width: 0;
}

.unit-select option {
  background: #404040;
  color: #ffffff;
}

.add-btn {
  background: var(--color-accent);
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
  background: var(--color-accent);
}

.remove-btn {
  background: #ff6b6b;
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
  background: #ff5252;
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