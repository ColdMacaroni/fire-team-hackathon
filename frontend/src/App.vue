<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useBreakpoint } from './components/useBreakpoint.js'
import NavigationBar from './components/NavigationBar.vue'
const { isDesktop, isMobile } = useBreakpoint()
</script>

<template>
  <div id="app" data-v-inspector="src/App.vue:9:3">
    <!-- Desktop Warning Message -->
    <div v-if="isDesktop" class="desktop-warning" data-v-inspector="src/App.vue:11:5">
      <div class="warning-content" data-v-inspector="src/App.vue:12:7">
        <div class="warning-icon" data-v-inspector="src/App.vue:13:9"></div>
        <h1 data-v-inspector="src/App.vue:14:9">Mobile Only</h1>
        <p data-v-inspector="src/App.vue:15:9">This application is designed for mobile use only.</p>
        <p data-v-inspector="src/App.vue:16:9">Please switch to a smaller screen to continue.</p>
      </div>
    </div>

    <!-- Mobile Content -->
    <div v-else-if="isMobile" class="mobile-content" data-v-inspector="src/App.vue:21:5">
      <div class="mobile-body" data-v-inspector="src/App.vue:22:7">
        <RouterView data-v-inspector="src/App.vue:23:9" />
      </div>
      <div class="mobile-nav" data-v-inspector="src/App.vue:25:7">
        <NavigationBar data-v-inspector="src/App.vue:26:9" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './assets/base.css';

#app {
  background-color: var(--color-background);
  color: var(--color-text);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  /* iOS Safari momentum scrolling fix */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: none;
  position: relative;
}

.mobile-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  /* iOS Safari momentum scrolling fix */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: none;
  position: relative;
}

.mobile-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px calc(80px + env(safe-area-inset-bottom, 0)) 20px;
  /* Space for the bottom navbar plus safe area */
  box-sizing: border-box;
  /* iOS Safari momentum scrolling improvements */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  /* Prevent momentum scrolling from affecting parent containers */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

.mobile-nav {
  position: fixed;
  bottom: env(safe-area-inset-bottom, 0);
  left: 0;
  width: 100%;
  z-index: 1000;
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
</style>