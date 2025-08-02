<script setup>
  import { ref, onMounted, computed } from 'vue'
  import LargeCard from '../components/explore/LargeCard.vue'
  import SmallCard from '../components/explore/SmallCard.vue'
  import { useRecipes } from '../composables/useRecipes'
  import RecipeCard from '../components/RecipeCard.vue'

  const { recipes, loading, error, loadAllRecipes } = useRecipes()

  const currentIndex = ref(0)
  const isDragging = ref(false)
  const startX = ref(0)
  const currentX = ref(0)
  const translateX = ref(0)

  onMounted(() => {
    loadAllRecipes()
  })

  // Computed properties for swipe logic
  const currentRecipe = computed(() => {
    return recipes.value[currentIndex.value] || null
  })

  const prevRecipe = computed(() => {
    const index = currentIndex.value - 1
    return index >= 0 ? recipes.value[index] : null
  })

  const nextRecipe = computed(() => {
    const index = currentIndex.value + 1
    return index < recipes.value.length ? recipes.value[index] : null
  })

  const canSwipeLeft = computed(() => currentIndex.value > 0)
  const canSwipeRight = computed(
    () => currentIndex.value < recipes.value.length - 1
  )

  // Touch event handlers
  const handleTouchStart = e => {
    isDragging.value = true
    startX.value = e.touches[0].clientX
    currentX.value = startX.value
  }

  const handleTouchMove = e => {
    if (!isDragging.value) return

    currentX.value = e.touches[0].clientX
    const deltaX = currentX.value - startX.value

    // Limit the drag distance
    const maxDrag = 200
    translateX.value = Math.max(-maxDrag, Math.min(maxDrag, deltaX))
  }

  const handleTouchEnd = () => {
    if (!isDragging.value) return

    const deltaX = currentX.value - startX.value
    const threshold = 100 // Minimum distance to trigger swipe

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && canSwipeLeft.value) {
        // Swipe right - go to previous
        currentIndex.value--
      } else if (deltaX < 0 && canSwipeRight.value) {
        // Swipe left - go to next
        currentIndex.value++
      }
    }

    // Reset
    isDragging.value = false
    translateX.value = 0
  }

  // Keyboard navigation for testing
  const handleKeyDown = e => {
    if (e.key === 'ArrowLeft' && canSwipeLeft.value) {
      currentIndex.value--
    } else if (e.key === 'ArrowRight' && canSwipeRight.value) {
      currentIndex.value++
    }
  }

  onMounted(() => {
    loadAllRecipes()
    // Add keyboard listener for testing
    window.addEventListener('keydown', handleKeyDown)
  })
</script>

<template>
  <div class="explore-container">
    <div class="page-swiper">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading recipes...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <h2>Oops!</h2>
        <p>{{ error }}</p>
      </div>

      <!-- Swipe Container -->
      <div
        v-else-if="recipes.length > 0"
        class="swipe-container"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- Previous Recipe (Small Card) -->
        <div
          v-if="prevRecipe"
          class="card-wrapper prev-card"
          :class="{ visible: canSwipeLeft }"
        >
          <SmallCard :recipe="prevRecipe" />
        </div>

        <!-- Current Recipe (Large Card) -->
        <div
          class="card-wrapper current-card"
          :style="{ transform: `translateX(${translateX}px)` }"
        >
          <LargeCard :recipe="currentRecipe" />
        </div>

        <!-- Next Recipe (Small Card) -->
        <div
          v-if="nextRecipe"
          class="card-wrapper next-card"
          :class="{ visible: canSwipeRight }"
        >
          <SmallCard :recipe="nextRecipe" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <h2>No recipes found</h2>
        <p>Try refreshing the page or check back later.</p>
      </div>
    </div>

    <!-- Pinterest-style Grid Section -->
    <div class="recipe-grid-section">
      <div v-if="loading" class="grid-loading">
        <div class="loading-spinner"></div>
        <p>Loading recipes...</p>
      </div>

      <div v-else-if="recipes.length > 0" class="recipe-grid">
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
          class="grid-recipe-card"
        />
        <!-- Spacer to prevent cards from going under navbar -->
        <div class="navbar-spacer"></div>
      </div>

      <div v-else class="grid-empty">
        <h3>No recipes available</h3>
        <p>Check back later for new recipes!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .explore-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100%;
  }

  .page-swiper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40%;
    width: 100%;
    overflow: hidden;
    position: relative;
    background-color: var(--color-background);
  }

  .swipe-container {
    position: relative;
    width: 100%;
    height: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: pan-y; /* Allow vertical scrolling but handle horizontal swipes */
  }

  .card-wrapper {
    position: absolute;
    transition: transform 0.3s ease-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .current-card {
    z-index: 10;
    transform: translateX(0);
  }

  .prev-card {
    z-index: 5;
    transform: translateX(-120%);
    opacity: 0.7;
  }

  .next-card {
    z-index: 5;
    transform: translateX(120%);
    opacity: 0.7;
  }

  .prev-card.visible {
    transform: translateX(-85%);
    opacity: 0.8;
  }

  .next-card.visible {
    transform: translateX(85%);
    opacity: 0.8;
  }

  .navigation-indicators {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 20;
  }

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .indicator.active {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .loading-container,
  .error-container,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--color-text);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Mobile-specific styles */
  @media (max-width: 768px) {
    .page-swiper {
      height: 50vh;
      width: 100vw;
    }

    .swipe-container {
      touch-action: pan-y;
    }
  }

  /* Prevent text selection during swipe */
  .swipe-container {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .recipe-grid-section {
    display: flex;
    flex-direction: column;
    height: 60%;
    width: 100%;
    padding: 20px;
    /* Hide scrollbar for webkit browsers */
    scrollbar-width: none; /* Firefox */
  }

  /* Hide scrollbar for webkit browsers (Chrome, Safari, Edge) */
  .recipe-grid-section::-webkit-scrollbar {
    display: none;
  }

  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;
    max-width: 800px;
    margin: 0 auto 100px auto; /* Added bottom margin for navbar */
  }

  .grid-loading,
  .grid-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--color-text);
  }

  .grid-recipe-card {
    width: 100%;
    height: auto;
  }

  .navbar-spacer {
    height: 200px; /* Increased height to account for navbar + extra space */
    width: 100%;
    grid-column: 1 / -1; /* Span all columns */
  }

  /* Responsive grid adjustments */
  @media (max-width: 768px) {
    .recipe-grid {
      gap: 12px;
      padding: 0 10px;
    }

    .recipe-grid-section {
      padding: 15px 10px;
    }
  }

  @media (max-width: 480px) {
    .recipe-grid {
      gap: 10px;
      padding: 0 5px;
    }
  }
</style>
