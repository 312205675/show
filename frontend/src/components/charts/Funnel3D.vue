<template>
  <div ref="containerRef" class="funnel-3d" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useThemeStore } from '@/store/theme'

const props = defineProps<{
  stages: Array<{ name: string; count: number; color: string }>
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const themeStore = useThemeStore()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number | null = null
let funnelGroup: THREE.Group

function init() {
  const container = containerRef.value
  if (!container) return

  const w = container.offsetWidth
  const h = container.offsetHeight

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a1628, 0.015)

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
  camera.position.set(0, 12, 22)
  camera.lookAt(0, 3, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 10
  controls.maxDistance = 50
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.5
  controls.target.set(0, 3, 0)

  // Lights
  const ambient = new THREE.AmbientLight(0x4a9eff, 0.5)
  scene.add(ambient)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(10, 20, 10)
  dirLight.castShadow = true
  scene.add(dirLight)
  const pointLight = new THREE.PointLight(0x4a9eff, 0.8, 40)
  pointLight.position.set(-5, 15, 5)
  scene.add(pointLight)

  // Ground
  const groundGeo = new THREE.PlaneGeometry(40, 40)
  const groundMat = new THREE.MeshPhongMaterial({ color: 0x0a1628, transparent: true, opacity: 0.6 })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // Grid
  const grid = new THREE.GridHelper(40, 20, 0x1a3050, 0x0f1e30)
  grid.position.y = 0.01
  scene.add(grid)

  // Build funnel
  funnelGroup = new THREE.Group()
  scene.add(funnelGroup)
  buildFunnel()

  // Particles
  const particleCount = 40
  const pGeo = new THREE.BufferGeometry()
  const pos = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 20
    pos[i * 3 + 1] = Math.random() * 15 + 1
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const pMat = new THREE.PointsMaterial({ color: 0x4a9eff, size: 0.1, transparent: true, opacity: 0.4 })
  scene.add(new THREE.Points(pGeo, pMat))

  // Animate
  let time = 0
  function animate() {
    time += 0.003
    animationId = requestAnimationFrame(animate)
    controls.update()

    // Gentle float on funnel stages
    funnelGroup.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      const baseY = mesh.userData.baseY || 0
      mesh.position.y = baseY + Math.sin(time * 2 + i * 0.5) * 0.08
    })

    renderer.render(scene, camera)
  }
  animate()

  // Resize
  const handleResize = () => {
    if (!container) return
    const nw = container.offsetWidth
    const nh = container.offsetHeight
    camera.aspect = nw / nh
    camera.updateProjectionMatrix()
    renderer.setSize(nw, nh)
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (animationId) cancelAnimationFrame(animationId)
    controls.dispose()
    renderer.dispose()
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  })
}

function buildFunnel() {
  // Clear previous
  while (funnelGroup.children.length > 0) {
    const child = funnelGroup.children[0]
    funnelGroup.remove(child)
  }

  const maxCount = Math.max(...props.stages.map(s => s.count), 1)
  const stageHeight = 2
  const topRadius = 6
  const bottomMinRadius = 1.5

  props.stages.forEach((stage, i) => {
    const ratio = stage.count / maxCount
    const topR = topRadius * ratio
    const bottomR = topRadius * (i < props.stages.length - 1 ? props.stages[i + 1].count / maxCount : bottomMinRadius / topRadius)

    const color = new THREE.Color(stage.color || '#4a9eff')
    const geo = new THREE.CylinderGeometry(
      Math.max(bottomR, 0.5),
      Math.max(topR, 0.5),
      stageHeight,
      32,
      1,
      false
    )
    const mat = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.82,
      shininess: 60,
    })
    const mesh = new THREE.Mesh(geo, mat)
    const yPos = (props.stages.length - 1 - i) * (stageHeight + 0.3) + stageHeight / 2
    mesh.position.y = yPos
    mesh.userData.baseY = yPos
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Edge glow
    const edges = new THREE.EdgesGeometry(geo)
    const lineMat = new THREE.LineBasicMaterial({ color: stage.color || '#4a9eff', transparent: true, opacity: 0.25 })
    const line = new THREE.LineSegments(edges, lineMat)
    mesh.add(line)

    funnelGroup.add(mesh)
  })

  // Center funnel group
  funnelGroup.position.y = 0
}

watch(() => props.stages, () => {
  if (funnelGroup) buildFunnel()
}, { deep: true })

onMounted(() => {
  setTimeout(init, 100)
})
</script>

<style scoped>
.funnel-3d {
  width: 100%;
  height: 100%;
  min-height: 200px;
  cursor: grab;
}
.funnel-3d:active {
  cursor: grabbing;
}
</style>
