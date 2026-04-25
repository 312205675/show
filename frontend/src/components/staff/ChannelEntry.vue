<template>
  <div class="channel-entry">
    <!-- 渠道效果概览 -->
    <div class="channel-overview">
      <div class="overview-card" v-for="card in overviewCards" :key="card.label">
        <div class="overview-icon" :style="{ background: card.bg }">
          <span v-html="card.icon"></span>
        </div>
        <div class="overview-info">
          <span class="overview-value">{{ card.value }}</span>
          <span class="overview-label">{{ card.label }}</span>
        </div>
      </div>
    </div>

    <!-- 渠道对比 -->
    <div class="channel-compare">
      <div class="compare-card" v-for="ch in channelSummary" :key="ch.name">
        <div class="compare-header">
          <span class="compare-name">{{ ch.name }}</span>
          <span class="compare-type">{{ ch.type }}</span>
        </div>
        <div class="compare-stats">
          <div class="compare-stat">
            <span class="cs-label">线索</span>
            <span class="cs-value">{{ ch.totalLeads }}</span>
          </div>
          <div class="compare-stat">
            <span class="cs-label">到访</span>
            <span class="cs-value">{{ ch.totalVisits }}</span>
          </div>
          <div class="compare-stat">
            <span class="cs-label">成交</span>
            <span class="cs-value text-money">{{ ch.totalDeals }}</span>
          </div>
          <div class="compare-stat">
            <span class="cs-label">销售额</span>
            <span class="cs-value text-money">{{ ch.totalSales.toFixed(1) }}万</span>
          </div>
        </div>
        <div class="compare-bar">
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: ch.convRate + '%', background: barColor(ch.convRate) }"></div>
          </div>
          <span class="bar-label">转化率 {{ ch.convRate }}%</span>
        </div>
        <div class="compare-roi">
          <span>ROI: <strong :class="ch.roi > 5 ? 'text-money' : ch.roi > 2 ? 'text-primary' : 'text-warn'">{{ ch.roi }}</strong></span>
          <span>费效: <strong>{{ ch.costPerDeal.toFixed(0) }}元/单</strong></span>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-group">
        <input v-model="searchText" placeholder="搜索渠道 / 项目..." class="search-input" />
        <select v-model="filterProject" class="filter-select">
          <option value="">全部项目</option>
          <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        <select v-model="filterChannel" class="filter-select">
          <option value="">全部渠道</option>
          <option v-for="ch in channelNames" :key="ch" :value="ch">{{ ch }}</option>
        </select>
      </div>
      <button class="btn primary" @click="openAddModal">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
        录入数据
      </button>
    </div>

    <!-- 明细表格 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>渠道</th>
            <th>类型</th>
            <th>项目</th>
            <th>线索数</th>
            <th>到访数</th>
            <th>成交数</th>
            <th>销售额</th>
            <th>花费</th>
            <th>转化率</th>
            <th>ROI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in filteredRecords" :key="rec.id">
            <td class="text-muted">{{ rec.date }}</td>
            <td><span class="channel-name">{{ rec.channelName }}</span></td>
            <td><span class="type-tag" :class="typeClass(rec.channelType)">{{ rec.channelType }}</span></td>
            <td class="text-primary">{{ rec.projectName }}</td>
            <td>{{ rec.leadCount }}</td>
            <td>{{ rec.visitCount }}</td>
            <td class="text-money">{{ rec.dealCount }}</td>
            <td class="text-money">{{ rec.salesAmount.toFixed(1) }}万</td>
            <td>{{ rec.cost.toLocaleString() }}元</td>
            <td>
              <span class="rate-tag" :class="rateClass(rec.conversionRate)">{{ rec.conversionRate }}%</span>
            </td>
            <td :class="roiClass(rec.roi)">{{ rec.roi }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 录入弹窗 -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>录入渠道数据</h3>
          <button class="modal-close" @click="showModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>日期 *</label>
              <input v-model="form.date" type="date" />
            </div>
            <div class="form-item">
              <label>渠道名称 *</label>
              <select v-model="form.channelName" @change="onChannelChange">
                <option v-for="ch in channelNames" :key="ch" :value="ch">{{ ch }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>所属项目 *</label>
              <select v-model="form.projectId" @change="onProjectChange">
                <option value="">请选择项目</option>
                <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>线索数</label>
              <input v-model.number="form.leadCount" type="number" />
            </div>
            <div class="form-item">
              <label>到访数</label>
              <input v-model.number="form.visitCount" type="number" />
            </div>
            <div class="form-item">
              <label>成交数</label>
              <input v-model.number="form.dealCount" type="number" />
            </div>
            <div class="form-item">
              <label>销售额 (万)</label>
              <input v-model.number="form.salesAmount" type="number" step="0.1" />
            </div>
            <div class="form-item">
              <label>花费 (元)</label>
              <input v-model.number="form.cost" type="number" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn ghost" @click="showModal = false">取消</button>
          <button class="btn primary" @click="submitRecord">确认录入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStaffStore, type ChannelRecord } from '@/store/staffStore'

const store = useStaffStore()

const searchText = ref('')
const filterProject = ref('')
const filterChannel = ref('')
const showModal = ref(false)

const channelNames = ['自渠(售楼处)', '贝壳链家', '安居客', '抖音直播', '微信小程序', '房天下', '中介分销', '老带新']
const channelTypeMap: Record<string, string> = {
  '自渠(售楼处)': '自建', '贝壳链家': '中介', '安居客': '平台',
  '抖音直播': '线上', '微信小程序': '线上', '房天下': '平台',
  '中介分销': '中介', '老带新': '自建',
}

// 概览卡片
const overviewCards = computed(() => {
  const all = store.channelRecords
  const totalLeads = all.reduce((s, r) => s + r.leadCount, 0)
  const totalVisits = all.reduce((s, r) => s + r.visitCount, 0)
  const totalDeals = all.reduce((s, r) => s + r.dealCount, 0)
  const totalSales = all.reduce((s, r) => s + r.salesAmount, 0)
  const totalCost = all.reduce((s, r) => s + r.cost, 0)
  return [
    { label: '总线索', value: totalLeads.toLocaleString(), bg: 'rgba(96,165,250,0.12)', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
    { label: '总到访', value: totalVisits.toLocaleString(), bg: 'rgba(6,182,212,0.12)', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>' },
    { label: '总成交', value: totalDeals.toLocaleString(), bg: 'rgba(34,197,94,0.12)', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' },
    { label: '总销售额', value: totalSales.toFixed(1) + '万', bg: 'rgba(245,158,11,0.12)', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
    { label: '总花费', value: (totalCost / 10000).toFixed(1) + '万', bg: 'rgba(239,68,68,0.12)', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
  ]
})

// 渠道汇总
interface ChannelSummary {
  name: string
  type: string
  totalLeads: number
  totalVisits: number
  totalDeals: number
  totalSales: number
  totalCost: number
  convRate: number
  roi: number
  costPerDeal: number
}

const channelSummary = computed<ChannelSummary[]>(() => {
  return channelNames.map(name => {
    const recs = store.channelRecords.filter(r => r.channelName === name)
    const totalLeads = recs.reduce((s, r) => s + r.leadCount, 0)
    const totalVisits = recs.reduce((s, r) => s + r.visitCount, 0)
    const totalDeals = recs.reduce((s, r) => s + r.dealCount, 0)
    const totalSales = recs.reduce((s, r) => s + r.salesAmount, 0)
    const totalCost = recs.reduce((s, r) => s + r.cost, 0)
    return {
      name,
      type: channelTypeMap[name],
      totalLeads,
      totalVisits,
      totalDeals,
      totalSales,
      totalCost,
      convRate: totalLeads ? Number((totalDeals / totalLeads * 100).toFixed(1)) : 0,
      roi: totalCost ? Number((totalSales / (totalCost / 10000)).toFixed(2)) : 0,
      costPerDeal: totalDeals ? totalCost / totalDeals : 0,
    }
  }).sort((a, b) => b.totalSales - a.totalSales)
})

const filteredRecords = computed(() => {
  return store.channelRecords.filter(r => {
    if (filterProject.value && r.projectId !== filterProject.value) return false
    if (filterChannel.value && r.channelName !== filterChannel.value) return false
    if (searchText.value) {
      const s = searchText.value.toLowerCase()
      return r.channelName.toLowerCase().includes(s) || r.projectName.toLowerCase().includes(s)
    }
    return true
  }).slice(0, 50)
})

function barColor(rate: number) {
  if (rate > 20) return '#22C55E'
  if (rate > 10) return '#F59E0B'
  return '#EF4444'
}

function typeClass(type: string) {
  const map: Record<string, string> = { '自建': 'self', '中介': 'agent', '平台': 'platform', '线上': 'online' }
  return map[type] || ''
}

function rateClass(rate: number) {
  if (rate > 20) return 'rate-good'
  if (rate > 10) return 'rate-mid'
  return 'rate-low'
}

function roiClass(roi: number) {
  if (roi > 5) return 'text-money'
  if (roi > 2) return 'text-primary'
  return 'text-warn'
}

const form = reactive({
  date: new Date().toISOString().slice(0, 10),
  channelName: '自渠(售楼处)',
  channelType: '自建',
  projectId: '',
  projectName: '',
  leadCount: 0,
  visitCount: 0,
  dealCount: 0,
  salesAmount: 0,
  cost: 0,
  conversionRate: 0,
  roi: 0,
})

function onChannelChange() {
  form.channelType = channelTypeMap[form.channelName] || '自建'
}

function onProjectChange() {
  const proj = store.projects.find(p => p.id === form.projectId)
  if (proj) form.projectName = proj.name
}

function openAddModal() {
  Object.assign(form, {
    date: new Date().toISOString().slice(0, 10), channelName: '自渠(售楼处)',
    channelType: '自建', projectId: '', projectName: '',
    leadCount: 0, visitCount: 0, dealCount: 0, salesAmount: 0, cost: 0,
  })
  showModal.value = true
}

function submitRecord() {
  if (!form.projectId || !form.date) return
  const conversionRate = form.leadCount ? Number((form.dealCount / form.leadCount * 100).toFixed(1)) : 0
  const roi = form.cost ? Number((form.salesAmount / (form.cost / 10000)).toFixed(2)) : 0
  store.addChannelRecord({ ...form, conversionRate, roi })
  showModal.value = false
}
</script>

<style lang="scss" scoped>
.channel-entry { max-width: 1400px; }

.channel-overview {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.overview-card {
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.overview-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.overview-info {
  display: flex;
  flex-direction: column;
}

.overview-value { font-size: 18px; font-weight: 700; }
.overview-label { font-size: 11px; color: #64748b; margin-top: 2px; }

.channel-compare {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.compare-card {
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s;
  &:hover { border-color: rgba(96,165,250,0.2); transform: translateY(-1px); }
}

.compare-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.compare-name { font-size: 14px; font-weight: 600; }
.compare-type { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(96,165,250,0.1); color: #60a5fa; }

.compare-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.compare-stat {
  display: flex;
  flex-direction: column;
}

.cs-label { font-size: 10px; color: #475569; }
.cs-value { font-size: 15px; font-weight: 600; margin-top: 1px; }

.compare-bar { margin-bottom: 10px; }
.bar-track { width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
.bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.bar-label { font-size: 10px; color: #64748b; }

.compare-roi {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.search-group { display: flex; gap: 8px; }
.search-input { background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; color: #e2e8f0; font-size: 13px; width: 200px; outline: none; &:focus { border-color: rgba(96,165,250,0.4); } &::placeholder { color: #475569; } }
.filter-select { background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; color: #e2e8f0; font-size: 13px; outline: none; cursor: pointer; option { background: #161B22; } }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s;
  &.primary { background: linear-gradient(135deg, #60a5fa, #4a8fe7); color: #fff; &:hover { opacity: 0.9; } }
  &.ghost { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; &:hover { background: rgba(255,255,255,0.05); } }
}

.table-wrap { background: #161B22; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse;
  th { font-size: 11px; color: #64748b; font-weight: 500; text-align: left; padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  td { font-size: 13px; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.02); white-space: nowrap; }
  tr:hover td { background: rgba(255,255,255,0.02); }
}
.text-primary { color: #60a5fa; font-weight: 500; }
.text-money { color: #22C55E; font-weight: 600; }
.text-muted { color: #64748b; }
.text-warn { color: #F59E0B; font-weight: 500; }

.channel-name { font-weight: 500; }

.type-tag {
  font-size: 11px; padding: 2px 6px; border-radius: 4px;
  &.self { background: rgba(96,165,250,0.12); color: #60a5fa; }
  &.agent { background: rgba(245,158,11,0.12); color: #F59E0B; }
  &.platform { background: rgba(167,139,250,0.12); color: #a78bfa; }
  &.online { background: rgba(6,182,212,0.12); color: #06b6d4; }
}

.rate-tag {
  font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 500;
  &.rate-good { background: rgba(34,197,94,0.12); color: #22C55E; }
  &.rate-mid { background: rgba(245,158,11,0.12); color: #F59E0B; }
  &.rate-low { background: rgba(239,68,68,0.12); color: #EF4444; }
}

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal { width: 640px; max-height: 80vh; background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; }
.modal-header { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); h3 { font-size: 16px; font-weight: 600; } }
.modal-close { background: none; border: none; color: #64748b; font-size: 18px; cursor: pointer; &:hover { color: #e2e8f0; } }
.modal-body { padding: 24px; overflow-y: auto; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.form-item { display: flex; flex-direction: column; gap: 6px;
  label { font-size: 12px; color: #94a3b8; font-weight: 500; }
  input, select, textarea { background: #0d1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; color: #e2e8f0; font-size: 13px; outline: none; transition: border-color 0.2s; font-family: inherit; &:focus { border-color: rgba(96,165,250,0.4); } &::placeholder { color: #475569; } }
  select option { background: #0d1117; }
}
.modal-footer { padding: 16px 24px; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid rgba(255,255,255,0.06); }
</style>
