<template>
  <div class="region-map-3d" ref="containerRef">
    <canvas ref="canvasRef" class="rm3d-canvas" />
    <!-- Region labels overlay -->
    <div class="rm3d-labels" ref="labelsRef">
      <div
        v-for="rg in regionLabels"
        :key="rg.name"
        class="region-label"
        :class="[`risk-${rg.riskLevel}`]"
        :style="rg.style"
      >
        <span class="rl-name">{{ rg.name }}</span>
        <span class="rl-stats">{{ rg.depletionRate }}% · {{ rg.sales }}亿</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface RegionInfo {
  name: string
  totalSales: number
  dealCount: number
  avgPrice: number
  depletionRate: number
  returnRate: number
  inventoryPressure: number
  riskLevel: 'low' | 'medium' | 'high'
  projects: number
  suggestion: string
}

interface ProjectBuilding {
  name: string
  city: string
  district: string
  avgPrice: number
  depletionRate: number
  x: number
  z: number
  height: number
  color: string
  statusLabel: string
  statusClass: string
}

const props = defineProps<{
  regions: RegionInfo[]
  projectBuildings: ProjectBuilding[]
}>()

const emit = defineEmits<{
  (e: 'select-region', name: string): void
  (e: 'hover-building', building: ProjectBuilding | null): void
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const labelsRef = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number | null = null
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2
let buildingMeshes: THREE.Mesh[] = []
let regionZones: { name: string; riskLevel: string; mesh: THREE.Mesh; centerX: number; centerZ: number }[] = []
let hoveredMesh: THREE.Mesh | null = null
let labelUpdateNeeded = true

// Region label positions (screen-space, updated each frame)
const regionLabels = ref<Array<{
  name: string; riskLevel: string; depletionRate: number; sales: string; style: Record<string, string>
}>>([])

// Region center positions for 3D scene
const regionPositions: Record<string, { cx: number; cz: number; color: string; riskLevel: string; depletionRate: number; sales: number }> = {
  '裕华区': { cx: 5, cz: -1.5, color: '#22C55E', riskLevel: 'low', depletionRate: 0, sales: 0 },
  '长安区': { cx: 3.5, cz: -4.5, color: '#F59E0B', riskLevel: 'medium', depletionRate: 0, sales: 0 },
  '桥西区': { cx: -3.5, cz: -0.8, color: '#F59E0B', riskLevel: 'medium', depletionRate: 0, sales: 0 },
  '新华区': { cx: -2, cz: 5, color: '#22C55E', riskLevel: 'low', depletionRate: 0, sales: 0 },
  '鹿泉区': { cx: -8.5, cz: 4, color: '#EF4444', riskLevel: 'high', depletionRate: 0, sales: 0 },
  '高新区': { cx: 8, cz: 3, color: '#EF4444', riskLevel: 'high', depletionRate: 0, sales: 0 },
}

function init() {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  const w = container.offsetWidth
  const h = container.offsetHeight

  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a1628, 0.008)

  // Camera - closer zoom so buildings are clearly visible
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 500)
  camera.position.set(8, 18, 20)
  camera.lookAt(0, 2, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setClearColor(0x0a1628, 1)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  // Controls - zoomed in enough to see all projects
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.minDistance = 8
  controls.maxDistance = 50
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.6
  controls.target.set(0, 2, 0)
  controls.maxPolarAngle = Math.PI / 2.3
  controls.minPolarAngle = 0.3

  // Raycaster
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2(-999, -999)

  // Lights
  const ambientLight = new THREE.AmbientLight(0x4a6fa5, 0.6)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(20, 30, 15)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048
  dirLight.shadow.camera.near = 0.5
  dirLight.shadow.camera.far = 100
  dirLight.shadow.camera.left = -25
  dirLight.shadow.camera.right = 25
  dirLight.shadow.camera.top = 25
  dirLight.shadow.camera.bottom = -25
  scene.add(dirLight)

  // Blue point light
  const p1 = new THREE.PointLight(0x60a5fa, 1.2, 40)
  p1.position.set(0, 12, 0)
  scene.add(p1)

  // Accent lights per region risk
  const redLight = new THREE.PointLight(0xef4444, 0.4, 30)
  redLight.position.set(-8, 8, 4)
  scene.add(redLight)

  const greenLight = new THREE.PointLight(0x22c55e, 0.3, 30)
  greenLight.position.set(5, 8, -2)
  scene.add(greenLight)

  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(60, 60)
  const groundMat = new THREE.MeshPhongMaterial({
    color: 0x0c1a2e,
    transparent: true,
    opacity: 0.9,
    shininess: 10,
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.01
  ground.receiveShadow = true
  scene.add(ground)

  // Grid
  const grid = new THREE.GridHelper(60, 30, 0x1a3050, 0x0f1e30)
  grid.position.y = 0.01
  scene.add(grid)

  // Update region positions with real data
  updateRegionData()

  // Build region zones (flat colored areas)
  buildRegionZones()

  // Build project buildings
  buildProjectBuildings()

  // Build particles
  buildParticles()

  // Event listeners
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('click', onMouseClick)

  // Animation
  animate()
}

function updateRegionData() {
  for (const r of props.regions) {
    if (regionPositions[r.name]) {
      regionPositions[r.name].depletionRate = r.depletionRate
      regionPositions[r.name].sales = r.totalSales
      regionPositions[r.name].riskLevel = r.riskLevel
      regionPositions[r.name].color = r.riskLevel === 'high' ? '#EF4444' : r.riskLevel === 'medium' ? '#F59E0B' : '#22C55E'
    }
  }
}

function buildRegionZones() {
  // Create flat colored zones for each region
  const zoneSize = 8
  for (const [name, pos] of Object.entries(regionPositions)) {
    const color = new THREE.Color(pos.color)

    // Zone base plane
    const zoneGeo = new THREE.PlaneGeometry(zoneSize, zoneSize)
    const zoneMat = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    })
    const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat)
    zoneMesh.rotation.x = -Math.PI / 2
    zoneMesh.position.set(pos.cx, 0.02, pos.cz)
    zoneMesh.receiveShadow = true
    scene.add(zoneMesh)

    // Zone border (ring)
    const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(zoneSize, 0.02, zoneSize))
    const borderMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.2 })
    const borderLine = new THREE.LineSegments(borderGeo, borderMat)
    borderLine.position.set(pos.cx, 0.03, pos.cz)
    scene.add(borderLine)

    regionZones.push({ name, riskLevel: pos.riskLevel, mesh: zoneMesh, centerX: pos.cx, centerZ: pos.cz })
  }
}

function buildProjectBuildings() {
  for (const proj of props.projectBuildings) {
    const color = new THREE.Color(proj.color)
    const buildingWidth = 1.6
    const buildingDepth = 1.6

    // Main building
    const geo = new THREE.BoxGeometry(buildingWidth, proj.height, buildingDepth)
    const mat = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.9,
      shininess: 100,
      specular: new THREE.Color(0x333333),
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(proj.x, proj.height / 2, proj.z)
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Store building data
    ;(mesh as any).buildingData = proj

    // Edge glow
    const edges = new THREE.EdgesGeometry(geo)
    const edgeMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.35 })
    mesh.add(new THREE.LineSegments(edges, edgeMat))

    // Top cap glow
    const topGeo = new THREE.PlaneGeometry(buildingWidth + 0.3, buildingDepth + 0.3)
    const topMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.25 })
    const topPlane = new THREE.Mesh(topGeo, topMat)
    topPlane.rotation.x = -Math.PI / 2
    topPlane.position.y = proj.height / 2 + 0.02
    mesh.add(topPlane)

    // Ground glow circle
    const glowGeo = new THREE.PlaneGeometry(buildingWidth + 1, buildingDepth + 1)
    const glowMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.08 })
    const glowPlane = new THREE.Mesh(glowGeo, glowMat)
    glowPlane.rotation.x = -Math.PI / 2
    glowPlane.position.y = -proj.height / 2 + 0.01
    mesh.add(glowPlane)

    scene.add(mesh)
    buildingMeshes.push(mesh)
  }

  // Connection lines between buildings in same region
  const lineMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.06 })
  for (let i = 0; i < props.projectBuildings.length; i++) {
    for (let j = i + 1; j < props.projectBuildings.length; j++) {
      const a = props.projectBuildings[i]
      const b = props.projectBuildings[j]
      if (a.city === b.city) {
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2)
        if (dist < 10) {
          const points = [
            new THREE.Vector3(a.x, Math.min(a.height, b.height) * 0.7, a.z),
            new THREE.Vector3(b.x, Math.min(a.height, b.height) * 0.7, b.z),
          ]
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
          scene.add(new THREE.Line(lineGeo, lineMat))
        }
      }
    }
  }
}

function buildParticles() {
  const count = 200
  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40
    positions[i * 3 + 1] = Math.random() * 20 + 3
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40

    const t = Math.random()
    if (t < 0.33) {
      colors[i * 3] = 0.38; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.98
    } else if (t < 0.66) {
      colors[i * 3] = 0.02; colors[i * 3 + 1] = 0.84; colors[i * 3 + 2] = 0.62
    } else {
      colors[i * 3] = 0.38; colors[i * 3 + 1] = 0.71; colors[i * 3 + 2] = 0.83
    }
    sizes[i] = Math.random() * 0.12 + 0.04
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const mat = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
  })

  scene.add(new THREE.Points(geo, mat))
}

function onMouseMove(event: MouseEvent) {
  const container = containerRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // Raycasting
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(buildingMeshes, false)

  if (intersects.length > 0) {
    const mesh = intersects[0].object as THREE.Mesh
    if (hoveredMesh !== mesh) {
      // Reset old
      if (hoveredMesh) {
        ;(hoveredMesh.material as THREE.MeshPhongMaterial).opacity = 0.9
        hoveredMesh.scale.setScalar(1)
      }
      hoveredMesh = mesh
      ;(hoveredMesh.material as THREE.MeshPhongMaterial).opacity = 1.0
      hoveredMesh.scale.setScalar(1.08)
      const data = (mesh as any).buildingData as ProjectBuilding
      emit('hover-building', data)
      container.style.cursor = 'pointer'
    }
  } else {
    if (hoveredMesh) {
      ;(hoveredMesh.material as THREE.MeshPhongMaterial).opacity = 0.9
      hoveredMesh.scale.setScalar(1)
      hoveredMesh = null
      emit('hover-building', null)
      container.style.cursor = 'grab'
    }
  }
}

function onMouseClick() {
  if (hoveredMesh) {
    const data = (hoveredMesh as any).buildingData as ProjectBuilding
    emit('select-region', data.city)
  }
}

function updateRegionLabels() {
  const container = containerRef.value
  if (!container) return

  const w = container.offsetWidth
  const h = container.offsetHeight
  const labels: typeof regionLabels.value = []

  for (const [name, pos] of Object.entries(regionPositions)) {
    // Project 3D position to 2D screen
    const vec = new THREE.Vector3(pos.cx, 0.5, pos.cz)
    vec.project(camera)

    const x = (vec.x * 0.5 + 0.5) * w
    const y = (-vec.y * 0.5 + 0.5) * h

    // Only show if in front of camera
    if (vec.z < 1 && x > 0 && x < w && y > 0 && y < h) {
      labels.push({
        name,
        riskLevel: pos.riskLevel,
        depletionRate: pos.depletionRate,
        sales: pos.sales.toFixed(1),
        style: {
          left: x + 'px',
          top: y + 'px',
          transform: 'translate(-50%, -50%)',
        },
      })
    }
  }

  regionLabels.value = labels
}

let time = 0
function animate() {
  time += 0.005
  animationId = requestAnimationFrame(animate)
  controls.update()

  // Subtle building animation
  buildingMeshes.forEach((mesh, i) => {
    const baseY = (mesh as any).buildingData.height / 2
    mesh.position.y = baseY + Math.sin(time * 2 + i * 0.5) * 0.03
  })

  renderer.render(scene, camera)

  // Update labels every few frames
  if (labelUpdateNeeded || Math.floor(time * 200) % 3 === 0) {
    updateRegionLabels()
    labelUpdateNeeded = false
  }
}

function handleResize() {
  const container = containerRef.value
  if (!container) return
  const w = container.offsetWidth
  const h = container.offsetHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  labelUpdateNeeded = true
}

watch(() => props.projectBuildings, () => {
  // Could rebuild if data changes, but for now it's static mock
}, { deep: true })

onMounted(() => {
  setTimeout(init, 150)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) cancelAnimationFrame(animationId)
  if (controls) controls.dispose()
  if (renderer) renderer.dispose()
  buildingMeshes = []
  regionZones = []
})
</script>

<style scoped lang="scss">
.region-map-3d {
  width: 100%;
  height: 100%;
  min-height: 520px;
  position: relative;
  cursor: grab;
  &:active { cursor: grabbing; }
  border-radius: 16px;
  overflow: hidden;
}

.rm3d-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.rm3d-labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.region-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(15, 18, 23, 0.75);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(96, 165, 250, 0.15);
  transition: opacity 0.3s;

  &.risk-low { border-color: rgba(34, 197, 94, 0.25); }
  &.risk-medium { border-color: rgba(245, 158, 11, 0.25); }
  &.risk-high { border-color: rgba(239, 68, 68, 0.25); }
}

.rl-name {
  font-size: 12px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.rl-stats {
  font-size: 10px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: #94a3b8;
  white-space: nowrap;

  .risk-low & { color: #22C55E; }
  .risk-medium & { color: #F59E0B; }
  .risk-high & { color: #EF4444; }
}
</style>
