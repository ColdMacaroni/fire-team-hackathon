<script setup>
import { useBreakpoint } from './composables/useBreakpoint'
import Navigation from './components/Navigation.vue'
const { isDesktop, isMobile } = useBreakpoint()
</script>

<template>
  <div id="app">
    <!-- Desktop Warning Message -->
    <div v-if="isDesktop" class="desktop-warning">
      <div class="warning-content">
        <div class="warning-icon"></div>
        <h1>Mobile Only</h1>
        <p>This application is designed for mobile use only.</p>
        <p>Please switch to a smaller screen to continue.</p>
      </div>
    </div>

    <!-- Mobile Content -->
    <div v-else-if="isMobile" class="mobile-content">
      <div class="mobile-nav">
        <Navigation />
      </div>
      <div class="mobile-header">
        <h1>Mobile App</h1>
      </div>
      <div class="mobile-body">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
#app{
  padding: 0;
}
.mobile-content {
  height: 100vh;
  width: 100vw;
}
.mobile-nav {
  position: sticky;
  top: 0;
}
</style>
