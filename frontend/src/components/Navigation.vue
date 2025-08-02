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
}
.nav-link {
    padding: 30px;
    background-color: #fff;
}
</style>