<script setup>
import { computed } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { useBreakpoint } from './composables/useBreakpoint'

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
      <div class="mobile-header">
        <h1>Mobile App</h1>
        <p>Welcome to your mobile experience!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
