<script setup>

</script>

<template>
  <div class="home-page">
    <div class="home-content">
      <h1>Welcome to Recipe App</h1>
      <p>Create and discover amazing recipes!</p>
      <div class="feature-cards">
        <div class="feature-card">
          <h3>Create Recipes</h3>
          <p>Share your culinary creations with the world</p>
        </div>
        <div class="feature-card">
          <h3>Discover Recipes</h3>
          <p>Find new and exciting recipes to try</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
}

.home-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.home-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.home-content p {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  color: #e0e0e0;
}

.feature-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, background 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4CAF50;
}

.feature-card p {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
  color: #e0e0e0;
}
</style>