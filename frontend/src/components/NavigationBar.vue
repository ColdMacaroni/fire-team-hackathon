<script setup>
  // Navigation component logic can be added here
</script>

<template>
  <nav
    class="navigation-bar"
    data-v-inspector="src/components/NavigationBar.vue:6:5"
  >
    <RouterLink
      to="/"
      class="nav-link"
      data-v-inspector="src/components/NavigationBar.vue:7:9"
    >
      <FontAwesomeIcon
        icon="fa-compass"
        data-v-inspector="src/components/NavigationBar.vue:8:13"
      />
      <p data-v-inspector="src/components/NavigationBar.vue:9:13">Explore</p>
    </RouterLink>
    <RouterLink
      to="/create"
      class="nav-link"
      data-v-inspector="src/components/NavigationBar.vue:11:9"
    >
      <FontAwesomeIcon
        icon="fa-plus"
        data-v-inspector="src/components/NavigationBar.vue:12:13"
      />
      <p data-v-inspector="src/components/NavigationBar.vue:13:13">Create</p>
    </RouterLink>
    <RouterLink
      to="/home"
      class="nav-link"
      data-v-inspector="src/components/NavigationBar.vue:15:9"
    >
      <FontAwesomeIcon
        icon="fa-pen"
        data-v-inspector="src/components/NavigationBar.vue:16:13"
      />
      <p data-v-inspector="src/components/NavigationBar.vue:17:13">Saved</p>
    </RouterLink>
    <RouterLink
      to="/generate"
      class="nav-link"
      data-v-inspector="src/components/NavigationBar.vue:19:9"
    >
      <FontAwesomeIcon
        icon="fa-bookmark"
        data-v-inspector="src/components/NavigationBar.vue:20:13"
      />
      <p data-v-inspector="src/components/NavigationBar.vue:21:13">Generate</p>
    </RouterLink>
  </nav>
</template>

<style scoped>
  .navigation-bar {
    display: flex;
    position: fixed;
    bottom: env(safe-area-inset-bottom, 0);
    left: 0;
    background-color: var(--color-background-secondary);
    width: 100%;
    padding: 6px 24px;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    height: 10vh;
    /* Add padding to account for safe area */
    padding-bottom: calc(6px + env(safe-area-inset-bottom, 0));
    /* iOS Safari momentum scrolling fix */
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-perspective: 1000;
    perspective: 1000;
    /* Prevent momentum scrolling from affecting fixed elements */
    -webkit-overflow-scrolling: auto;
  }

  .nav-link {
    color: var(--color-text);
    text-decoration: none;
    font-size: 16px;
    text-align: left;
    display: flex;
    padding: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: color 0.2s ease;
  }

  .nav-link > p {
    padding-top: 5px;
  }

  .nav-link.router-link-active {
    color: var(--color-accent);
  }

  .nav-link.router-link-active svg {
    color: var(--color-accent);
  }
</style>
