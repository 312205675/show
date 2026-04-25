<template>
  <div ref="containerRef" class="scene-3d" :class="{ 'interactive': interactive }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useThemeStore } from '@/store/theme'

const props = withDefaults(defineProps<{
  interactive?: boolean
  buildings?: Array<{ x: number; z: number; w: number; h: number; d: number; color: number; name?: string }>
  autoRotate?: boolean
  showParticles?: boolean
}>(), {
  interactive: false,
  autoRotate: true,
  showParticles: true,
})

const containerRef = ref<HTMLDivElement | null>(null)
const themeStore = useThemeStore()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls | null = null
let animationId: number | null = null
let buildings: THREE.Group
let mouseX = 0

const defaultBuildings = [
  { x: -6, z: -6, w: 2.5, h: 8, d: 2.5, color: 0x4a9eff },
  { x: -6, z: -2, w: 2, h: 12, d: 2, color: 0x00d68f },
  { x: -6, z: 2, w: 2.5, h: 6, d: 3, color: 0xffab00 },
  { x: -6, z: 6, w: 2, h: 10, d: 2, color: 0x4a9eff },
  { x: -2, z: -6, w: 3, h: 10, d: 2.5, color: 0x00d68f },
  { x: -2, z: -2, w: 2.5, h: 16, d: 2.5, color: 0x4a9eff },
  { x: -2, z: 2, w: 3, h: 7, d: 2, color: 0xff4757 },
  { x: -2, z: 6, w: 2, h: 9, d: 3, color: 0x00d68f },
  { x: 2, z: -6, w: 2, h: 5, d: 2.5, color: 0xffab00 },
  { x: 2, z: -2, w: 3, h: 14, d: 2.5, color: 0x4a9eff },
  { x: 2, z: 2, w: 2.5, h: 8, d: 3, color: 0x00d68f },
  { x: 2, z: 6, w: 2, h: 11, d: 2, color: 0x4a9eff },
  { x: 6, z: -6, w: 2.5, h: 6, d: 2, color: 0xa78bfa },
  { x: 6, z: -2, w: 2, h: 9, d: 3, color: 0x00d68f },
  { x: 6, z: 2, w: 3, h: 4, d: 2.5, color: 0xff4757 },
  { x: 6, z: 6, w: 2.5, h: 13, d: 2, color: 0x4a9eff },
]

function createBuilding(x: number, z: number, w: number, h: number, d: number, color: number): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d)
  const mat = new THREE.MeshPhongMaterial({
    color,
    transparent: true,
    opacity: 0.85,
    shininess: 80,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(x, h / 2, z)
  mesh.castShadow = true
  mesh.receiveShadow = true

  const edges = new THREE.EdgesGeometry(geo)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x4a9eff, transparent: true, opacity: 0.2 })
  const line = new THREE.LineSegments(edges, lineMat)
  mesh.add(line)

  return mesh
}

function init() {
  const container = containerRef.value
  if (!container) return

  const w = container.offsetWidth
  const h = container.offsetHeight

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a1628, 0.018)

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
  camera.position.set(20, 18, 20)
  camera.lookAt(0, 3, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  // OrbitControls for interactive mode
  if (props.interactive) {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 10
    controls.maxDistance = 60
    controls.autoRotate = props.autoRotate
    controls.autoRotateSpeed = 1.5
    controls.target.set(0, 3, 0)
  }

  // Lights
  const ambient = new THREE.AmbientLight(0x4a9eff, 0.4)
  scene.add(ambient)

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(10, 20, 10)
  dirLight.castShadow = true
  scene.add(dirLight)

  const pointLight1 = new THREE.PointLight(0x4a9eff, 1, 40)
  pointLight1.position.set(-10, 12, -10)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0x00d68f, 0.6, 30)
  pointLight2.position.set(10, 8, 10)
  scene.add(pointLight2)

  // Ground
  const groundGeo = new THREE.PlaneGeometry(60, 60)
  const groundMat = new THREE.MeshPhongMaterial({ color: 0x0a1628, transparent: true, opacity: 0.8 })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // Grid
  const gridHelper = new THREE.GridHelper(60, 30, 0x1a3050, 0x0f1e30)
  gridHelper.position.y = 0.01
  scene.add(gridHelper)

  // Buildings group
  buildings = new THREE.Group()
  scene.add(buildings)
  buildCity()

  // Particles
  if (props.showParticles) {
    const particleCount = 80
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = Math.random() * 20 + 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({ color: 0x4a9eff, size: 0.15, transparent: true, opacity: 0.5 })
    scene.add(new THREE.Points(particleGeo, particleMat))
  }

  // Animate
  let time = 0
  function animate() {
    time += 0.005
    animationId = requestAnimationFrame(animate)

    if (controls) {
      controls.update()
    } else {
      // Default rotation mode
      buildings.rotation.y = time * 0.15 + mouseX * 0.1

      buildings.children.forEach((b, i) => {
        const mesh = b as THREE.Mesh
        mesh.position.y = (mesh.geometry as THREE.BoxGeometry).parameters.height / 2 +
          Math.sin(time * 2 + i * 0.5) * 0.05
      })

      camera.position.x = 20 + Math.sin(time * 0.5) * 2
      camera.position.z = 20 + Math.cos(time * 0.5) * 2
      camera.lookAt(0, 3, 0)
    }

    renderer.render(scene, camera)
  }
  animate()

  // Resize
  function handleResize() {
    if (!container) return
    const nw = container.offsetWidth
    const nh = container.offsetHeight
    camera.aspect = nw / nh
    camera.updateProjectionMatrix()
    renderer.setSize(nw, nh)
  }
  window.addEventListener('resize', handleResize)

  // Mouse interaction (only for non-interactive mode)
  function handleMouseMove(e: MouseEvent) {
    if (!props.interactive) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
    }
  }
  window.addEventListener('mousemove', handleMouseMove)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
    if (controls) controls.dispose()
    if (animationId) cancelAnimationFrame(animationId)
    renderer.dispose()
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  })
}

function buildCity() {
  while (buildings.children.length > 0) {
    buildings.remove(buildings.children[0])
  }

  const buildingData = props.buildings || defaultBuildings
  buildingData.forEach(b => {
    const mesh = createBuilding(b.x, b.z, b.w, b.h, b.d, b.color)
    buildings.add(mesh)
  })
}

watch(() => props.buildings, () => {
  if (buildings) buildCity()
}, { deep: true })

onMounted(() => {
  init()
})
</script>

<style scoped>
.scene-3d {
  width: 100%;
  height: 100%;
  min-height: 120px;
}
.scene-3d.interactive {
  cursor: grab;
}
.scene-3d.interactive:active {
  cursor: grabbing;
}
</style>
