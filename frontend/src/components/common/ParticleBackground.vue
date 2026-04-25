<template>
  <canvas ref="canvasRef" class="particle-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particles: Array<{
  x: number; y: number; vx: number; vy: number; size: number; alpha: number
}> = []

function init() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  if (!ctx) return

  const resize = () => {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  }
  resize()
  window.addEventListener('resize', resize)

  const w = () => canvas.offsetWidth
  const h = () => canvas.offsetHeight

  // Create particles
  const count = Math.min(80, Math.floor((w() * h()) / 15000))
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w(),
    y: Math.random() * h(),
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.5 + 0.1,
  }))

  function draw() {
    ctx.clearRect(0, 0, w(), h())

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`
      ctx.fill()

      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > w()) p.vx *= -1
      if (p.y < 0 || p.y > h()) p.vy *= -1
    })

    animationId = requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    if (animationId) cancelAnimationFrame(animationId)
  })
}

onMounted(init)
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
