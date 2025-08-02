<script setup>

</script>

<template>
  <div class="recipe-page">
    <div class="recipe-content">
      <h1>Recipe Collection</h1>
      <p>Discover amazing recipes from around the world</p>
      
      <div class="recipe-grid">
        <div class="recipe-card">
          <div class="recipe-image">
            <div class="placeholder-image"></div>
          </div>
          <div class="recipe-info">
            <h3>Spaghetti Carbonara</h3>
            <p>Classic Italian pasta dish</p>
            <div class="recipe-tags">
              <span class="tag">Italian</span>
              <span class="tag">Pasta</span>
            </div>
          </div>
        </div>
        
        <div class="recipe-card">
          <div class="recipe-image">
            <div class="placeholder-image"></div>
          </div>
          <div class="recipe-info">
            <h3>Chicken Tikka Masala</h3>
            <p>Spicy and creamy Indian curry</p>
            <div class="recipe-tags">
              <span class="tag">Indian</span>
              <span class="tag">Spicy</span>
            </div>
          </div>
        </div>
        
        <div class="recipe-card">
          <div class="recipe-image">
            <div class="placeholder-image"></div>
          </div>
          <div class="recipe-info">
            <h3>Caesar Salad</h3>
            <p>Fresh and crispy garden salad</p>
            <div class="recipe-tags">
              <span class="tag">Salad</span>
              <span class="tag">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.recipe-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.recipe-content h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
}

.recipe-content > p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #6c757d;
}

.recipe-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.recipe-image {
  height: 200px;
  background: #e9ecef;
  position: relative;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.recipe-info {
  padding: 1.5rem;
}

.recipe-info h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.recipe-info > p {
  color: #6c757d;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.recipe-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>