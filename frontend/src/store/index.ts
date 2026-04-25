import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  generateCoreKPI,
  generateInsight,
  generateProjectMatrix,
  generateRiskDiagnosis,
  generateDealTrend,
  generateReturnTrend,
  generateWeeklyTrend,
} from '@/utils/mockData'
import { generateHotProperties, generatePredictions } from '@/utils/pageMockData'

export const useDashboardStore = defineStore('dashboard', () => {
  // 核心数据
  const coreKPI = ref(generateCoreKPI())
  const insight = ref(generateInsight())
  const projectMatrix = ref(generateProjectMatrix())
  const riskDiagnosis = ref(generateRiskDiagnosis())
  const dealTrend = ref(generateDealTrend())
  const returnTrend = ref(generateReturnTrend())
  const weeklyTrend = ref(generateWeeklyTrend())
  const hotProperties = ref(generateHotProperties())
  const predictions = ref(generatePredictions())

  const lastUpdateTime = ref(new Date())
  const isRefreshing = ref(false)

  function refreshAll() {
    isRefreshing.value = true
    coreKPI.value = generateCoreKPI()
    insight.value = generateInsight()
    projectMatrix.value = generateProjectMatrix()
    riskDiagnosis.value = generateRiskDiagnosis()
    dealTrend.value = generateDealTrend()
    returnTrend.value = generateReturnTrend()
    weeklyTrend.value = generateWeeklyTrend()
    hotProperties.value = generateHotProperties()
    predictions.value = generatePredictions()
    lastUpdateTime.value = new Date()
    setTimeout(() => { isRefreshing.value = false }, 600)
  }

  const formattedUpdateTime = computed(() => {
    const d = lastUpdateTime.value
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
  })

  // 统计汇总
  const summary = computed(() => {
    const p = projectMatrix.value
    const greenCount = p.filter(x => x.status === 'green').length
    const yellowCount = p.filter(x => x.status === 'yellow').length
    const redCount = p.filter(x => x.status === 'red').length
    return { greenCount, yellowCount, redCount, total: p.length }
  })

  return {
    coreKPI,
    insight,
    projectMatrix,
    riskDiagnosis,
    dealTrend,
    returnTrend,
    weeklyTrend,
    hotProperties,
    predictions,
    lastUpdateTime,
    isRefreshing,
    refreshAll,
    formattedUpdateTime,
    summary,
  }
})
