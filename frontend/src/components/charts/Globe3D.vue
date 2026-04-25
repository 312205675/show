<template>
  <div ref="containerRef" class="globe-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  markers?: Array<{ name: string; lat: number; lng: number; size: number; value: number }>
}>()

const containerRef = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let globe: THREE.Mesh
let animationId: number
let isDisposed = false

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function init() {
  if (!containerRef.value) return
  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 3

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  // Globe
  const globeGeom = new THREE.SphereGeometry(1, 64, 64)
  const globeMat = new THREE.MeshPhongMaterial({
    color: 0x0d1135,
    transparent: true,
    opacity: 0.9,
    wireframe: false,
  })
  globe = new THREE.Mesh(globeGeom, globeMat)
  scene.add(globe)

  // Wireframe overlay
  const wireGeom = new THREE.SphereGeometry(1.005, 32, 32)
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  })
  const wireGlobe = new THREE.Mesh(wireGeom, wireMat)
  scene.add(wireGlobe)

  // Atmosphere glow
  const glowGeom = new THREE.SphereGeometry(1.15, 64, 64)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.05,
    side: THREE.BackSide,
  })
  const glow = new THREE.Mesh(glowGeom, glowMat)
  scene.add(glow)

  // Add markers
  if (props.markers) {
    props.markers.forEach(m => {
      const pos = latLngToVector3(m.lat, m.lng, 1.01)
      const markerGeom = new THREE.SphereGeometry(m.size * 0.02, 16, 16)
      const markerMat = new THREE.MeshBasicMaterial({
        color: m.value > 70 ? 0x00d4ff : m.value > 50 ? 0xa855f7 : 0x00ff88,
        transparent: true,
        opacity: 0.9,
      })
      const marker = new THREE.Mesh(markerGeom, markerMat)
      marker.position.copy(pos)
      globe.add(marker)

      // Pulse ring
      const ringGeom = new THREE.RingGeometry(m.size * 0.03, m.size * 0.05, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeom, ringMat)
      ring.position.copy(pos)
      ring.lookAt(0, 0, 0)
      globe.add(ring)
    })
  }

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404060, 1.5)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.8)
  directionalLight.position.set(5, 3, 5)
  scene.add(directionalLight)

  // Animation
  function animate() {
    if (isDisposed) return
    animationId = requestAnimationFrame(animate)
    globe.rotation.y += 0.003
    renderer.render(scene, camera)
  }
  animate()

  // Resize handler
  const handleResize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    isDisposed = true
    window.removeEventListener('resize', handleResize)
    if (animationId) cancelAnimationFrame(animationId)
    renderer.dispose()
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  })
}

onMounted(() => {
  // Small delay to ensure container is sized
  setTimeout(init, 100)
})
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
  cursor: grab;
}
.globe-container:active {
  cursor: grabbing;
}
</style>
