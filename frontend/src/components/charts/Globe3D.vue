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
let animationId: number
let isDisposed = false
let particleSystem: THREE.Points
let buildingGroup: THREE.Group
let dataFlowGroup: THREE.Group
let ringGroup: THREE.Group
let mouseX = 0
let mouseY = 0

function init() {
  if (!containerRef.value) return
  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a0e1a, 0.008)

  // Camera
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.set(0, 30, 60)
  camera.lookAt(0, 5, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.appendChild(renderer.domElement)

  // ===== Ground Grid =====
  const gridHelper = new THREE.GridHelper(100, 40, 0x1a3a5c, 0x0a1a2c)
  gridHelper.position.y = 0
  scene.add(gridHelper)

  // ===== Central Platform =====
  const platGeom = new THREE.CylinderGeometry(18, 20, 1, 64)
  const platMat = new THREE.MeshPhongMaterial({
    color: 0x0d1b2a,
    transparent: true,
    opacity: 0.8,
    emissive: 0x0a1628,
    emissiveIntensity: 0.3,
  })
  const platform = new THREE.Mesh(platGeom, platMat)
  platform.position.y = 0
  scene.add(platform)

  // Platform ring glow
  const ringGeom = new THREE.TorusGeometry(19, 0.15, 16, 100)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.6 })
  const platRing = new THREE.Mesh(ringGeom, ringMat)
  platRing.rotation.x = Math.PI / 2
  platRing.position.y = 0.5
  scene.add(platRing)

  // ===== Buildings (3D Bar Chart on platform) =====
  buildingGroup = new THREE.Group()
  scene.add(buildingGroup)

  if (props.markers && props.markers.length > 0) {
    const count = Math.min(props.markers.length, 16)
    for (let i = 0; i < count; i++) {
      const m = props.markers[i]
      const angle = (i / count) * Math.PI * 2
      const radius = 10 + (i % 3) * 3
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const buildingHeight = Math.max(2, m.size * 2)

      // Building body
      const bGeom = new THREE.BoxGeometry(2, buildingHeight, 2)
      const bColor = m.value > 70 ? 0x00d4ff : m.value > 50 ? 0xa855f7 : 0x00ff88
      const bMat = new THREE.MeshPhongMaterial({
        color: bColor,
        transparent: true,
        opacity: 0.75,
        emissive: bColor,
        emissiveIntensity: 0.2,
      })
      const building = new THREE.Mesh(bGeom, bMat)
      building.position.set(x, buildingHeight / 2 + 0.5, z)
      buildingGroup.add(building)

      // Building top glow
      const glowGeom = new THREE.BoxGeometry(2.2, 0.3, 2.2)
      const glowMat = new THREE.MeshBasicMaterial({
        color: bColor,
        transparent: true,
        opacity: 0.9,
      })
      const topGlow = new THREE.Mesh(glowGeom, glowMat)
      topGlow.position.set(x, buildingHeight + 0.5, z)
      buildingGroup.add(topGlow)
    }
  }

  // ===== Data Flow Lines =====
  dataFlowGroup = new THREE.Group()
  scene.add(dataFlowGroup)

  if (props.markers && props.markers.length > 0) {
    const flowCount = Math.min(props.markers.length, 8)
    for (let i = 0; i < flowCount; i++) {
      const m = props.markers[i]
      const angle = (i / flowCount) * Math.PI * 2
      const radius = 10 + (i % 3) * 3
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      // Arc line from center to building
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0.5, 0),
        new THREE.Vector3(x / 2, 15 + Math.random() * 10, z / 2),
        new THREE.Vector3(x, 3, z)
      )
      const lineGeom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30))
      const lineColor = m.value > 70 ? 0x00d4ff : 0xa855f7
      const lineMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.3,
      })
      const line = new THREE.Line(lineGeom, lineMat)
      dataFlowGroup.add(line)
    }
  }

  // ===== Floating Rings =====
  ringGroup = new THREE.Group()
  scene.add(ringGroup)

  for (let i = 0; i < 3; i++) {
    const r = 25 + i * 8
    const rGeom = new THREE.TorusGeometry(r, 0.08, 8, 100)
    const rMat = new THREE.MeshBasicMaterial({
      color: [0x00d4ff, 0xa855f7, 0x00ff88][i],
      transparent: true,
      opacity: 0.15,
    })
    const ring = new THREE.Mesh(rGeom, rMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 1 + i * 3
    ringGroup.add(ring)
  }

  // ===== Particle System (Stars / Data Points) =====
  const particleCount = 2000
  const pGeom = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    // Distribute in a sphere
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 30 + Math.random() * 40
    positions[i3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = r * Math.cos(phi) * 0.5 + 5
    positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta)

    const colorChoice = Math.random()
    if (colorChoice < 0.4) {
      colors[i3] = 0; colors[i3 + 1] = 0.83; colors[i3 + 2] = 1  // cyan
    } else if (colorChoice < 0.7) {
      colors[i3] = 0.66; colors[i3 + 1] = 0.33; colors[i3 + 2] = 0.97  // purple
    } else {
      colors[i3] = 0; colors[i3 + 1] = 1; colors[i3 + 2] = 0.53  // green
    }
  }

  pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const pMat = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  particleSystem = new THREE.Points(pGeom, pMat)
  scene.add(particleSystem)

  // ===== Lights =====
  const ambientLight = new THREE.AmbientLight(0x404060, 1.5)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0x00d4ff, 0.8)
  dirLight.position.set(20, 30, 20)
  scene.add(dirLight)

  const pointLight1 = new THREE.PointLight(0xa855f7, 0.6, 60)
  pointLight1.position.set(-15, 15, -15)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0x00ff88, 0.3, 40)
  pointLight2.position.set(15, 10, 15)
  scene.add(pointLight2)

  // Mouse interaction
  container.addEventListener('mousemove', onMouseMove)

  // Animation
  let time = 0
  function animate() {
    if (isDisposed) return
    animationId = requestAnimationFrame(animate)
    time += 0.005

    // Slow camera orbit
    const camAngle = time * 0.15
    const camRadius = 60
    camera.position.x = Math.sin(camAngle) * camRadius + mouseX * 5
    camera.position.z = Math.cos(camAngle) * camRadius
    camera.position.y = 30 + Math.sin(time * 0.5) * 3 + mouseY * 3
    camera.lookAt(0, 5, 0)

    // Rotate particles slowly
    particleSystem.rotation.y = time * 0.1

    // Pulse building heights
    if (buildingGroup) {
      buildingGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) {
          const params = child.geometry.parameters
          if (params.height > 3) {
            child.position.y = params.height / 2 + 0.5 + Math.sin(time * 2 + i * 0.5) * 0.3
          }
        }
      })
    }

    // Rotate rings
    if (ringGroup) {
      ringGroup.children.forEach((ring, i) => {
        ring.rotation.z = time * (0.2 + i * 0.1)
        const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = 0.1 + Math.sin(time * 2 + i) * 0.05
      })
    }

    // Pulse data flow lines
    if (dataFlowGroup) {
      dataFlowGroup.children.forEach((line, i) => {
        const mat = (line as THREE.Line).material as THREE.LineBasicMaterial
        mat.opacity = 0.15 + Math.sin(time * 3 + i * 0.8) * 0.15
      })
    }

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
}

function onMouseMove(e: MouseEvent) {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}

watch(() => props.markers, () => {
  // Re-initialize when markers change significantly
  if (containerRef.value && !isDisposed) {
    const container = containerRef.value
    while (container.firstChild) container.removeChild(container.firstChild)
    init()
  }
}, { deep: true })

onMounted(() => {
  setTimeout(init, 100)
})

onUnmounted(() => {
  isDisposed = true
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    if (containerRef.value && containerRef.value.contains(renderer.domElement)) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }
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
