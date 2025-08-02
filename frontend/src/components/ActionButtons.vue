<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggleFavorite', 'likeRecipe', 'dislikeRecipe', 'showComments'])

const handleToggleFavorite = () => {
  emit('toggleFavorite', props.recipe)
}

const handleLikeRecipe = () => {
  emit('likeRecipe', props.recipe)
}

const handleDislikeRecipe = () => {
  emit('dislikeRecipe', props.recipe)
}

const handleShowComments = () => {
  emit('showComments', props.recipe)
}
</script>

<template>
  <div class="action-buttons">
    <button 
      @click="handleToggleFavorite"
      class="action-btn favorite-btn"
      :class="{ 'favorited': recipe.isFavorited }"
    >
      <span class="emoji">🔥️</span>
    </button>
    
    <button 
      @click="handleShowComments"
      class="action-btn comment-btn"
    >
      <span class="emoji">💬</span>
      <span class="count">{{ recipe.comments }}</span>
    </button>
    
    <button 
      @click="handleDislikeRecipe"
      class="action-btn dislike-btn"
    >
      <span class="emoji">🧯</span>
      <span class="count">{{ recipe.dislikes }}</span>
    </button>
  </div>
</template>

<style scoped>
.action-buttons {
  position: fixed;
  right: 20px;
  top: 75%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1000;
}

.action-btn {
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.action-btn.favorited {
  background: rgba(255, 0, 0, 0.8);
}

.action-btn.favorited:hover {
  background: rgba(255, 0, 0, 0.9);
}

.emoji {
  font-size: 1.4rem;
}

.count {
  font-size: 0.8rem;
  margin-top: 0.2rem;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .action-buttons {
    right: 15px;
    gap: 15px;
  }
  
  .action-btn {
    width: 50px;
    height: 50px;
  }
  
  .emoji {
    font-size: 1.2rem;
  }
  
  .count {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    right: 10px;
    gap: 12px;
  }
  
  .action-btn {
    width: 45px;
    height: 45px;
  }
  
  .emoji {
    font-size: 1.1rem;
  }
  
  .count {
    font-size: 0.6rem;
  }
}
</style> 