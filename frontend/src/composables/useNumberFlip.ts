import { ref, watch, onUnmounted, type Ref } from 'vue'

export function useNumberFlip(targetValue: Ref<number>, duration = 1500) {
  const displayValue = ref(0)
  let animationFrame: number | null = null

  function animate(from: number, to: number) {
    const start = performance.now()
    const diff = to - from

    function step(timestamp: number) {
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      displayValue.value = from + diff * eased

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    if (animationFrame) cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(step)
  }

  watch(targetValue, (newVal, oldVal) => {
    animate(oldVal || 0, newVal)
  }, { immediate: true })

  onUnmounted(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
  })

  return { displayValue }
}
