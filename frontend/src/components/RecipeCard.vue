<script setup>
defineProps({
    recipe: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="recipe-card" data-v-inspector="src/components/RecipeCard.vue:11:5">
        <div v-if="recipe.image != ''" class="recipe-image" data-v-inspector="src/components/RecipeCard.vue:12:9">
            <img :src="recipe.image" :alt="recipe.name" data-v-inspector="src/components/RecipeCard.vue:13:13" />
        </div>
        <div v-else class="recipe-image" data-v-inspector="src/components/RecipeCard.vue:15:9">
        </div>
        <div class="recipe-content" data-v-inspector="src/components/RecipeCard.vue:17:9">
            <h3 class="recipe-name" data-v-inspector="src/components/RecipeCard.vue:18:13">{{ recipe.name }}</h3>
            <div class="recipe-likes" data-v-inspector="src/components/RecipeCard.vue:19:13">
                <span class="likes-count" data-v-inspector="src/components/RecipeCard.vue:20:17">{{ recipe.likes }}</span>
                <span class="likes-label" data-v-inspector="src/components/RecipeCard.vue:21:17">likes</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.recipe-card {
    background-color: var(--color-background-secondary);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.recipe-card:hover {
    transform: translateY(-2px);
}

.recipe-image {
    height: 120px;
    overflow: hidden;
}

.recipe-image img {
    height: 100%;
    object-fit: cover;
}

.recipe-content {
    padding: 12px;
}

.recipe-name {
    color: var(--color-text);
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.recipe-likes {
    display: flex;
    align-items: center;
    gap: 4px;
}

.likes-count {
    color: var(--color-accent);
    font-weight: bold;
    font-size: 14px;
}

.likes-label {
    color: var(--color-text);
    opacity: 0.7;
    font-size: 12px;
}
</style>
