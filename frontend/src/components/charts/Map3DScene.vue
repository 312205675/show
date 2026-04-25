<template>
  <div class="map-3d-scene">
    <div ref="containerRef" class="map-canvas" />
    <div class="map-overlay">
      <div class="map-title">集团项目全景 3D</div>
      <div class="map-legend">
        <span class="legend-item"><span class="dot" style="background:#4a9eff" />销售</span>
        <span class="legend-item"><span class="dot" style="background:#00d68f" />健康</span>
        <span class="legend-item"><span class="dot" style="background:#ffab00" />关注</span>
        <span class="legend-item"><span class="dot" style="background:#ff4757" />风险</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const containerRef = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number | null = null

interface ProjectNode {
  name: string
  x: number
  z: number
  height: number
  color: number
  sales: string
  status: string
}

const projects: ProjectNode[] = [
  { name: '翡翠城', x: -8, z: -6, height: 14, color: 0x4a9eff, sales: '8.2亿', status: '健康' },
  { name: '御河上院', x: -3, z: -8, height: 10, color: 0x00d68f, sales: '5.6亿', status: '健康' },
  { name: '海棠苑', x: 3, z: -6, height: 6, color: 0xffab00, sales: '3.1亿', status: '关注' },
  { name: '锦绣学府', x: 8, z: -3, height: 12, color: 0x4a9eff, sales: '7.8亿', status: '健康' },
  { name: '天颂', x: -6, z: 2, height: 16, color: 0xa78bfa, sales: '9.5亿', status: '高端' },
  { name: '中央云锦', x: 0, z: 0, height: 11, color: 0x4a9eff, sales: '6.2亿', status: '健康' },
  { name: '正定新区', x: 6, z: 2, height: 5, color: 0xff4757, sales: '1.8亿', status: '风险' },
  { name: '栾城壹号院', x: -4, z: 6, height: 4, color: 0xff4757, sales: '1.2亿', status: '风险' },
  { name: '尚宾城', x: 3, z: 7, height: 8, color: 0xffab00, sales: '4.3亿', status: '关注' },
  { name: '长安国风', x: 9, z: 6, height: 13, color: 0x00d68f, sales: '7.1亿', status: '健康' },
  { name: '荣盛华府', x: -9, z: -1, height: 18, color: 0x60a5fa, sales: '12.3亿', status: '标杆' },
  { name: '裕华城', x: 7, z: -8, height: 9, color: 0x4a9eff, sales: '5.0亿', status: '健康' },
]

function init() {
  const container = containerRef.value
  if (!container) return

  const w = container.offsetWidth
  const h = container.offsetHeight

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a1628, 0.012)

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000)
  camera.position.set(25, 22, 25)
  camera.lookAt(0, 3, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 15
  controls.maxDistance = 70
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.2
  controls.target.set(0, 4, 0)
  controls.maxPolarAngle = Math.PI / 2.2

  // Lights
  scene.add(new THREE.AmbientLight(0x4a9eff, 0.4))
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
  dirLight.position.set(15, 25, 15)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 1024
  dirLight.shadow.mapSize.height = 1024
  scene.add(dirLight)
  const p0 = new THREE.PointLight(0x4a9eff, 0.8, 50)
  p0.position.set(0, 15, 0)
  scene.add(p0)
  const p1 = new THREE.PointLight(0x4a9eff, 0.8, 50)
  p1.position.set(-10, 15, -10)
  scene.add(p1)
  const p2 = new THREE.PointLight(0x00d68f, 0.5, 40)
  p2.position.set(10, 10, 10)
  scene.add(p2)

  // Ground
  const groundGeo = new THREE.PlaneGeometry(80, 80)
  const groundMat = new THREE.MeshPhongMaterial({ color: 0x0a1628, transparent: true, opacity: 0.7 })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // Grid
  scene.add(new THREE.GridHelper(80, 40, 0x1a3050, 0x0f1e30).translateY(0.01))

  // Build project buildings
  projects.forEach(p => {
    const geo = new THREE.BoxGeometry(3, p.height, 3)
    const mat = new THREE.MeshPhongMaterial({ color: p.color, transparent: true, opacity: 0.85, shininess: 80 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(p.x, p.height / 2, p.z)
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Edge glow
    const edges = new THREE.EdgesGeometry(geo)
    mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.3 })))

    // Top glow plane
    const topGeo = new THREE.PlaneGeometry(3, 3)
    const topMat = new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.3 })
    const topPlane = new THREE.Mesh(topGeo, topMat)
    topPlane.rotation.x = -Math.PI / 2
    topPlane.position.y = p.height / 2 + 0.01
    mesh.add(topPlane)

    scene.add(mesh)
  })

  // Connection lines between projects
  const lineMat = new THREE.LineBasicMaterial({ color: 0x4a9eff, transparent: true, opacity: 0.06 })
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const dist = Math.sqrt((projects[i].x - projects[j].x) ** 2 + (projects[i].z - projects[j].z) ** 2)
      if (dist < 12) {
        const points = [
          new THREE.Vector3(projects[i].x, Math.min(projects[i].height, projects[j].height) * 0.6, projects[i].z),
          new THREE.Vector3(projects[j].x, Math.min(projects[i].height, projects[j].height) * 0.6, projects[j].z),
        ]
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
        scene.add(new THREE.Line(lineGeo, lineMat))
      }
    }
  }

  // Floating particles
  const particleCount = 120
  const pGeo = new THREE.BufferGeometry()
  const pos = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 50
    pos[i * 3 + 1] = Math.random() * 25 + 2
    pos[i * 3 + 2] = (Math.random() - 0.5) * 50
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x4a9eff, size: 0.12, transparent: true, opacity: 0.4 })))

  // Animate
  let time = 0
  function animate() {
    time += 0.003
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

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
    if (controls) controls.dispose()
    if (animationId) cancelAnimationFrame(animationId)
    renderer.dispose()
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  })
}

onMounted(() => {
  setTimeout(init, 100)
})
</script>

<style scoped lang="scss">
.map-3d-scene {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: grab;
  &:active { cursor: grabbing; }
}

.map-canvas {
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  top: 10px;
  left: 12px;
  z-index: 5;
  pointer-events: none;
}

.map-title {
  font-size: 14px;
  font-weight: 700;
  color: $gray-100;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.map-legend {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: $gray-400;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
