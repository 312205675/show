<template>
  <div ref="mapRef" class="china-map" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { MapChart, ScatterChart, EffectScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent, VisualMapComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([MapChart, ScatterChart, EffectScatterChart, GeoComponent, TooltipComponent, VisualMapComponent, LegendComponent, CanvasRenderer])

interface MapPoint {
  name: string
  value: number[]
  itemStyle?: Record<string, any>
  extra?: Record<string, any>
}

const props = withDefaults(defineProps<{
  points?: MapPoint[]
  regions?: { name: string; value: number; level: string }[]
  showPropertyDetail?: boolean
}>(), {
  showPropertyDetail: true,
})

const mapRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const defaultPoints: MapPoint[] = [
  { name: '城发投·翡翠城', value: [114.53, 38.02, 86], itemStyle: { color: '#22C55E' }, extra: { city: '裕华区', price: '16500', deals: 42, type: '高层/洋房' } },
  { name: '城发投·锦绣学府', value: [114.56, 38.05, 62], itemStyle: { color: '#F59E0B' }, extra: { city: '长安区', price: '14200', deals: 35, type: '高层' } },
  { name: '城发投·天颂', value: [114.46, 38.03, 55], itemStyle: { color: '#F59E0B' }, extra: { city: '桥西区', price: '18800', deals: 18, type: '洋房/别墅' } },
  { name: '城发投·熙湖', value: [114.44, 38.07, 71], itemStyle: { color: '#22C55E' }, extra: { city: '新华区', price: '13500', deals: 28, type: '高层/洋房' } },
  { name: '城发投·荣盛华府', value: [114.54, 38.01, 78], itemStyle: { color: '#22C55E' }, extra: { city: '裕华区', price: '21000', deals: 22, type: '别墅/大平层' } },
  { name: '城发投·中央云锦', value: [114.58, 38.06, 58], itemStyle: { color: '#F59E0B' }, extra: { city: '长安区', price: '19500', deals: 15, type: '高层/洋房' } },
  { name: '城发投·尚宾城', value: [114.44, 38.02, 48], itemStyle: { color: '#EF4444' }, extra: { city: '桥西区', price: '15800', deals: 12, type: '高层' } },
  { name: '城发投·御河上院', value: [114.57, 38.13, 35], itemStyle: { color: '#EF4444' }, extra: { city: '正定新区', price: '12000', deals: 8, type: '高层/洋房' } },
  { name: '城发投·和府', value: [114.59, 38.04, 65], itemStyle: { color: '#F59E0B' }, extra: { city: '长安区', price: '17200', deals: 30, type: '洋房' } },
  { name: '城发投·云和赋', value: [114.52, 38.00, 72], itemStyle: { color: '#22C55E' }, extra: { city: '裕华区', price: '20500', deals: 25, type: '大平层' } },
  { name: '城发投·裕华城', value: [114.51, 37.98, 68], itemStyle: { color: '#22C55E' }, extra: { city: '裕华区', price: '14800', deals: 38, type: '高层' } },
  { name: '城发投·海棠苑', value: [114.45, 38.08, 52], itemStyle: { color: '#EF4444' }, extra: { city: '新华区', price: '12800', deals: 10, type: '高层' } },
  { name: '城发投·瑞城', value: [114.57, 38.07, 60], itemStyle: { color: '#F59E0B' }, extra: { city: '长安区', price: '15600', deals: 26, type: '高层/洋房' } },
  { name: '城发投·长安国风', value: [114.55, 38.06, 56], itemStyle: { color: '#F59E0B' }, extra: { city: '长安区', price: '18500', deals: 14, type: '洋房' } },
  { name: '城发投·栾城壹号院', value: [114.65, 37.90, 28], itemStyle: { color: '#EF4444' }, extra: { city: '栾城区', price: '9800', deals: 5, type: '高层' } },
  { name: '城发投·正定新区', value: [114.58, 38.14, 32], itemStyle: { color: '#EF4444' }, extra: { city: '正定新区', price: '11500', deals: 6, type: '高层/洋房' } },
]

const defaultRegions = [
  { name: '北京市', value: 0, level: 'neutral' },
  { name: '天津市', value: 0, level: 'neutral' },
  { name: '河北省', value: 86, level: 'active' },
  { name: '山东省', value: 0, level: 'neutral' },
  { name: '河南省', value: 0, level: 'neutral' },
  { name: '山西省', value: 0, level: 'neutral' },
]

async function initMap() {
  if (!mapRef.value) return
  chart = echarts.init(mapRef.value, 'dark')

  try {
    const resp = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const chinaJson = await resp.json()
    echarts.registerMap('china', chinaJson)
  } catch {
    echarts.registerMap('china', { type: 'FeatureCollection', features: [] })
  }

  updateChart()
}

function updateChart() {
  if (!chart) return
  const pts = props.points?.length ? props.points : defaultPoints
  const rgs = props.regions?.length ? props.regions : defaultRegions

  const option: Record<string, any> = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 18, 23, 0.95)',
      borderColor: 'rgba(96, 165, 250, 0.15)',
      textStyle: { color: '#e2e8f0', fontSize: 11 },
      formatter: (params: any) => {
        if (params.seriesType === 'effectScatter') {
          const ex = params.data?.extra
          const val = params.value[2]
          const color = val >= 65 ? '#22C55E' : val >= 50 ? '#F59E0B' : '#EF4444'
          let html = `<div style="font-weight:700;font-size:13px;margin-bottom:6px;color:#e2e8f0">${params.name}</div>`
          html += `<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">去化率: <span style="color:${color};font-weight:700;font-size:14px">${val}%</span></div>`
          if (ex && props.showPropertyDetail) {
            html += `<div style="border-top:1px solid rgba(255,255,255,0.06);margin:4px 0;padding-top:4px">`
            html += `<div style="color:#94a3b8;font-size:10px">区域: ${ex.city || '-'}</div>`
            html += `<div style="color:#94a3b8;font-size:10px">均价: <span style="color:#e2e8f0;font-weight:600">¥${ex.price || '-'}</span>/㎡</div>`
            html += `<div style="color:#94a3b8;font-size:10px">成交: <span style="color:#e2e8f0;font-weight:600">${ex.deals || '-'}</span>套</div>`
            html += `<div style="color:#94a3b8;font-size:10px">产品: ${ex.type || '-'}</div>`
            html += `</div>`
          }
          return html
        }
        if (params.seriesType === 'map') {
          return params.value ? `<b>${params.name}</b><br/>指数: ${params.value}` : params.name
        }
        return params.name
      },
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 5,
      center: [114.5, 38.0],
      scaleLimit: { min: 2, max: 20 },
      label: {
        show: true,
        color: 'rgba(255,255,255,0.25)',
        fontSize: 9,
      },
      emphasis: {
        label: { color: '#e2e8f0', fontSize: 11, fontWeight: 'bold' },
        itemStyle: { areaColor: 'rgba(99, 102, 241, 0.15)' },
      },
      itemStyle: {
        areaColor: 'rgba(30, 34, 42, 0.8)',
        borderColor: 'rgba(96, 165, 250, 0.12)',
        borderWidth: 1,
      },
    },
    series: [
      {
        type: 'map',
        map: 'china',
        geoIndex: 0,
        data: rgs.map(r => ({
          name: r.name,
          value: r.value,
          itemStyle: {
            areaColor: r.level === 'active'
              ? 'rgba(99, 102, 241, 0.2)'
              : 'rgba(30, 34, 42, 0.8)',
          },
          emphasis: {
            itemStyle: { areaColor: 'rgba(99, 102, 241, 0.3)' },
          },
        })),
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: pts.map(p => ({
          name: p.name,
          value: p.value,
          itemStyle: p.itemStyle || { color: '#60a5fa' },
          extra: p.extra,
        })),
        symbolSize: (val: number[]) => Math.max(8, val[2] / 4),
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 4,
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: '#e2e8f0',
          fontSize: 9,
          fontWeight: 600,
          textBorderColor: 'rgba(0,0,0,0.6)',
          textBorderWidth: 2,
        },
      },
    ],
  }

  chart.setOption(option, true)
}

function handleResize() { chart?.resize() }

watch(() => [props.points, props.regions], () => updateChart(), { deep: true })

onMounted(() => {
  initMap()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.china-map { width: 100%; height: 100%; min-height: 300px; }
</style>
