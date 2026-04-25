<template>
  <div class="digital-flipper inline-flex items-baseline" :class="containerClass">
    <span class="digital-number" :style="{ fontSize: size + 'px', color: color }">
      {{ formattedValue }}
    </span>
    <span v-if="suffix" class="text-sm ml-1 opacity-60" :style="{ color: color }">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  value: number
  decimals?: number
  suffix?: string
  size?: number
  color?: string
  containerClass?: string
  duration?: number
}>()

const displayValue = ref(0)
let animationFrame: number | null = null

function animate(from: number, to: number) {
  const dur = props.duration || 1500
  const start = performance.now()
  const diff = to - from

  function step(timestamp: number) {
    const elapsed = timestamp - start
    const progress = Math.min(elapsed / dur, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = from + diff * eased
    if (progress < 1) {
      animationFrame = requestAnimationFrame(step)
    }
  }

  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = requestAnimationFrame(step)
}

watch(() => props.value, (newVal, oldVal) => {
  animate(oldVal || 0, newVal)
}, { immediate: true })

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
})

const formattedValue = computed(() => {
  const dec = props.decimals ?? 0
  return displayValue.value.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})
</script>
