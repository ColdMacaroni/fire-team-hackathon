<script setup>

</script>

<template>
    <div class="mobile-nav-container">
        <nav class="mobile-nav">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
            <RouterLink to="/recipe" class="nav-link">Recipe</RouterLink>
            <RouterLink to="/create" class="nav-link">Create</RouterLink>
        </nav>
    </div>
</template>

<style scoped>
.mobile-nav-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100vw;
    background: #2d2d2d;
}

.mobile-nav {
    display: flex;
    width: 100%;
    justify-content: space-around;
    background: #2d2d2d;
    border-bottom: 1px solid #404040;
}

.nav-link {
    padding: 20px;
    background: #2d2d2d;
    color: #e0e0e0;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
    flex: 1;
    text-align: center;
}

.nav-link:hover {
    background: #404040;
    color: #ffffff;
}

.nav-link.router-link-active {
    color: #4CAF50;
    border-bottom-color: #4CAF50;
    background: #404040;
}
</style>