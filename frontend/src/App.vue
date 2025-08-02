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
      <div class="mobile-body">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  padding: 0 !important;
  margin: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.mobile-content {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}

.mobile-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.desktop-warning {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.warning-content {
  text-align: center;
  padding: 2rem;
}

.warning-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: #dc3545;
  border-radius: 50%;
  position: relative;
}

.warning-icon::before {
  content: "⚠";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: white;
}
</style>
