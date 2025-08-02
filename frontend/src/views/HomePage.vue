<script setup>
import { ref } from 'vue'
import RecipeCard from '../components/RecipeCard.vue'

// Sample recipe data
const recipes = ref([
  {
    id: 1,
    name: "Spaghetti Carbonara",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStkMsf20yz6nzSO0UOX5zVDppUWEljNaSN3w&s",
    rank: 4,
    rating: 4.5,
    tags: ["Italian", "Pasta", "Quick"],
    ingredients: [
      { ingredient: "Spaghetti", amount: "400", unit: "g" },
      { ingredient: "Eggs", amount: "4", unit: "piece" },
      { ingredient: "Parmesan", amount: "100", unit: "g" },
      { ingredient: "Bacon", amount: "200", unit: "g" }
    ],
    instructions: "1. Cook pasta according to package instructions\n2. Fry bacon until crispy\n3. Beat eggs with parmesan\n4. Mix hot pasta with egg mixture\n5. Add bacon and serve immediately",
    isFavorited: false,
    likes: 128,
    dislikes: 3,
    comments: 24
  },
  {
    id: 2,
    name: "Chicken Tikka Masala",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    rank: 5,
    rating: 4.8,
    tags: ["Indian", "Spicy", "Creamy"],
    ingredients: [
      { ingredient: "Chicken", amount: "500", unit: "g" },
      { ingredient: "Yogurt", amount: "200", unit: "ml" },
      { ingredient: "Tomato sauce", amount: "400", unit: "ml" },
      { ingredient: "Cream", amount: "200", unit: "ml" }
    ],
    instructions: "1. Marinate chicken in yogurt and spices\n2. Grill chicken until charred\n3. Make sauce with tomatoes and cream\n4. Simmer chicken in sauce\n5. Garnish with cilantro",
    isFavorited: true,
    likes: 256,
    dislikes: 8,
    comments: 45
  },
  {
    id: 3,
    name: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    rank: 3,
    rating: 4.2,
    tags: ["Salad", "Healthy", "Fresh"],
    ingredients: [
      { ingredient: "Romaine lettuce", amount: "1", unit: "head" },
      { ingredient: "Parmesan", amount: "50", unit: "g" },
      { ingredient: "Croutons", amount: "100", unit: "g" },
      { ingredient: "Caesar dressing", amount: "100", unit: "ml" }
    ],
    instructions: "1. Wash and chop lettuce\n2. Make caesar dressing\n3. Toss lettuce with dressing\n4. Add croutons and parmesan\n5. Serve immediately",
    isFavorited: false,
    likes: 89,
    dislikes: 2,
    comments: 12
  }
])

// Interactive functions
const toggleFavorite = (recipe) => {
  recipe.isFavorited = !recipe.isFavorited
}

const likeRecipe = (recipe) => {
  recipe.likes++
}

const dislikeRecipe = (recipe) => {
  recipe.dislikes++
}

const showComments = (recipe) => {
  console.log(`Show comments for ${recipe.name}`)
}
</script>

<template>
  <div class="home-page">
    <div class="scroller-container">
      <div class="recipe-cards">
        <RecipeCard 
          v-for="recipe in recipes" 
          :key="recipe.id" 
          :recipe="recipe"
          @toggle-favorite="toggleFavorite"
          @like-recipe="likeRecipe"
          @dislike-recipe="dislikeRecipe"
          @show-comments="showComments"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  height: 100%;
  width: 100%;
  background: #1a1a1a;
  overflow: hidden;
}

.scroller-container {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
}

.recipe-cards {
  display: flex;
  height: 100%;
  min-width: max-content;
}
</style>