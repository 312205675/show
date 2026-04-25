import { ref, onMounted, onUnmounted } from 'vue'

export function useScreenScale() {
  const scale = ref(1)
  const isMobile = ref(false)

  function update() {
    const w = window.innerWidth
    const h = window.innerHeight
    isMobile.value = w < 768

    // Design based on 1920x1080
    const baseW = 1920
    const baseH = 1080
    const scaleX = w / baseW
    const scaleY = h / baseH
    scale.value = Math.min(scaleX, scaleY)

    // For mobile, use a different base
    if (isMobile.value) {
      scale.value = w / 375
    }
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { scale, isMobile }
}
