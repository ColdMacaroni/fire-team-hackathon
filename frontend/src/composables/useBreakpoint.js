import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint() {
  const isDesktop = ref(false)
  const isMobile = ref(false)
  const screenWidth = ref(0)

  const checkBreakpoint = () => {
    const width = window.innerWidth
    screenWidth.value = width
    isDesktop.value = width > 768
    isMobile.value = width <= 768
  }

  onMounted(() => {
    // Set initial values
    checkBreakpoint()

    // Add event listener for window resize
    window.addEventListener('resize', checkBreakpoint)
  })

  onUnmounted(() => {
    // Clean up event listener
    window.removeEventListener('resize', checkBreakpoint)
  })

  return {
    isDesktop,
    isMobile,
    screenWidth,
  }
}
