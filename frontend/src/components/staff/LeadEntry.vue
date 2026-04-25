<template>
  <div class="lead-entry">
    <!-- 统计行 -->
    <div class="stat-row">
      <div class="mini-stat" v-for="stat in leadStats" :key="stat.label">
        <span class="mini-stat-label">{{ stat.label }}</span>
        <span class="mini-stat-value" :class="stat.cls">{{ stat.value }}</span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-group">
        <input v-model="searchText" placeholder="搜索客户 / 项目 / 跟进人..." class="search-input" />
        <select v-model="filterProject" class="filter-select">
          <option value="">全部项目</option>
          <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option v-for="s in statusList" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="filterSource" class="filter-select">
          <option value="">全部来源</option>
          <option v-for="ch in sourceList" :key="ch" :value="ch">{{ ch }}</option>
        </select>
      </div>
      <button class="btn primary" @click="openAddModal">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
        新增线索
      </button>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>客户</th>
            <th>性别</th>
            <th>年龄</th>
            <th>电话</th>
            <th>项目</th>
            <th>客群</th>
            <th>预算</th>
            <th>来源</th>
            <th>状态</th>
            <th>跟进人</th>
            <th>下次跟进</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in filteredLeads" :key="lead.id">
            <td>
              <div class="customer-cell">
                <div class="customer-avatar">{{ lead.customerName[0] }}</div>
                <span>{{ lead.customerName }}</span>
              </div>
            </td>
            <td>{{ lead.gender }}</td>
            <td>{{ lead.age }}</td>
            <td class="text-muted mono">{{ lead.phone }}</td>
            <td class="text-primary">{{ lead.projectName }}</td>
            <td><span class="segment-tag">{{ lead.segment }}</span></td>
            <td>{{ lead.budget }}万</td>
            <td><span class="source-tag">{{ lead.source }}</span></td>
            <td>
              <span class="status-tag" :class="statusClass(lead.status)">{{ lead.status }}</span>
            </td>
            <td>{{ lead.followUpPerson }}</td>
            <td :class="{ 'text-warn': isOverdue(lead.nextFollowDate) }">{{ lead.nextFollowDate }}</td>
            <td class="action-cell">
              <button class="btn-link" @click="viewDetail(lead)">详情</button>
              <button class="btn-link" @click="changeStatus(lead)" v-if="canAdvance(lead.status)">推进</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增弹窗 -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>新增客户线索</h3>
          <button class="modal-close" @click="showModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>客户姓名 *</label>
              <input v-model="form.customerName" placeholder="客户姓名" />
            </div>
            <div class="form-item">
              <label>性别</label>
              <select v-model="form.gender">
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-item">
              <label>年龄</label>
              <input v-model.number="form.age" type="number" />
            </div>
            <div class="form-item">
              <label>电话 *</label>
              <input v-model="form.phone" placeholder="手机号" />
            </div>
            <div class="form-item">
              <label>关注项目 *</label>
              <select v-model="form.projectId" @change="onProjectChange">
                <option value="">请选择项目</option>
                <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>客群分类</label>
              <select v-model="form.segment">
                <option v-for="seg in segments" :key="seg" :value="seg">{{ seg }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>预算 (万)</label>
              <input v-model.number="form.budget" type="number" />
            </div>
            <div class="form-item">
              <label>意向户型</label>
              <select v-model="form.preferredType">
                <option v-for="t in unitTypes" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>意向区域</label>
              <input v-model="form.preferredArea" placeholder="意向区域" />
            </div>
            <div class="form-item">
              <label>来源渠道</label>
              <select v-model="form.source">
                <option v-for="ch in sourceList" :key="ch" :value="ch">{{ ch }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>跟进人</label>
              <input v-model="form.followUpPerson" placeholder="如: 销售5号" />
            </div>
            <div class="form-item">
              <label>下次跟进日期</label>
              <input v-model="form.nextFollowDate" type="date" />
            </div>
            <div class="form-item span-2">
              <label>备注</label>
              <textarea v-model="form.remark" placeholder="补充说明" rows="2"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn ghost" @click="showModal = false">取消</button>
          <button class="btn primary" @click="submitLead">确认录入</button>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div class="modal-overlay" v-if="detailLead" @click.self="detailLead = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>线索详情</h3>
          <button class="modal-close" @click="detailLead = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <template v-for="(label, key) in detailLabels" :key="key">
              <span class="detail-label">{{ label }}</span>
              <span class="detail-value">{{ (detailLead as any)[key] }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStaffStore, type LeadRecord } from '@/store/staffStore'

const store = useStaffStore()

const searchText = ref('')
const filterProject = ref('')
const filterStatus = ref('')
const filterSource = ref('')
const showModal = ref(false)
const detailLead = ref<LeadRecord | null>(null)

const statusList: LeadRecord['status'][] = ['新线索', '已到访', '有意向', '已认购', '已成交', '已流失']
const sourceList = ['自渠(售楼处)', '贝壳链家', '安居客', '抖音直播', '微信小程序', '房天下', '中介分销', '老带新']
const segments = ['刚需首置', '改善置换', '投资理财', '学区需求', '养老康养', '高端改善']
const unitTypes = ['1室1厅', '2室1厅', '2室2厅', '3室1厅', '3室2厅', '4室2厅']

// 统计
const leadStats = computed(() => [
  { label: '总线索数', value: store.leads.length + ' 条', cls: '' },
  { label: '活跃线索', value: store.activeLeadCount + ' 条', cls: 'text-primary' },
  { label: '新线索', value: store.leads.filter(l => l.status === '新线索').length + ' 条', cls: 'text-money' },
  { label: '已成交', value: store.leads.filter(l => l.status === '已成交').length + ' 条', cls: 'text-money' },
  { label: '已流失', value: store.leads.filter(l => l.status === '已流失').length + ' 条', cls: 'text-warn' },
  { label: '转化率', value: ((store.leads.filter(l => l.status === '已成交').length / (store.leads.length || 1)) * 100).toFixed(1) + '%', cls: 'text-primary' },
])

const filteredLeads = computed(() => {
  return store.leads.filter(l => {
    if (filterProject.value && l.projectId !== filterProject.value) return false
    if (filterStatus.value && l.status !== filterStatus.value) return false
    if (filterSource.value && l.source !== filterSource.value) return false
    if (searchText.value) {
      const s = searchText.value.toLowerCase()
      return l.customerName.includes(s) || l.projectName.toLowerCase().includes(s) || l.followUpPerson.includes(s)
    }
    return true
  }).slice(0, 50)
})

function isOverdue(dateStr: string) {
  return dateStr < new Date().toISOString().slice(0, 10)
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    '新线索': 'new', '已到访': 'visited', '有意向': 'intent',
    '已认购': 'subscribed', '已成交': 'closed', '已流失': 'lost',
  }
  return map[status] || ''
}

function canAdvance(status: LeadRecord['status']) {
  const flow: LeadRecord['status'][] = ['新线索', '已到访', '有意向', '已认购']
  return flow.includes(status)
}

function changeStatus(lead: LeadRecord) {
  const flow: LeadRecord['status'][] = ['新线索', '已到访', '有意向', '已认购', '已成交']
  const idx = flow.indexOf(lead.status)
  if (idx >= 0 && idx < flow.length - 1) {
    store.updateLeadStatus(lead.id, flow[idx + 1])
  }
}

const form = reactive({
  customerName: '',
  gender: '男' as LeadRecord['gender'],
  age: 30,
  phone: '',
  projectId: '',
  projectName: '',
  segment: '刚需首置',
  budget: 150,
  preferredType: '3室2厅',
  preferredArea: '裕华区',
  source: '自渠(售楼处)',
  status: '新线索' as LeadRecord['status'],
  followUpPerson: '',
  lastFollowDate: new Date().toISOString().slice(0, 10),
  nextFollowDate: '',
  remark: '',
})

function onProjectChange() {
  const proj = store.projects.find(p => p.id === form.projectId)
  if (proj) {
    form.projectName = proj.name
    form.preferredArea = proj.city
  }
}

function openAddModal() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  Object.assign(form, {
    customerName: '', gender: '男', age: 30, phone: '',
    projectId: '', projectName: '', segment: '刚需首置',
    budget: 150, preferredType: '3室2厅', preferredArea: '裕华区',
    source: '自渠(售楼处)', status: '新线索', followUpPerson: '',
    lastFollowDate: new Date().toISOString().slice(0, 10),
    nextFollowDate: tomorrow.toISOString().slice(0, 10), remark: '',
  })
  showModal.value = true
}

function submitLead() {
  if (!form.customerName || !form.phone || !form.projectId) return
  store.addLead({ ...form })
  showModal.value = false
}

const detailLabels: Record<string, string> = {
  customerName: '客户', gender: '性别', age: '年龄', phone: '电话',
  projectName: '项目', segment: '客群', budget: '预算(万)',
  preferredType: '意向户型', preferredArea: '意向区域', source: '来源',
  status: '状态', followUpPerson: '跟进人', lastFollowDate: '上次跟进',
  nextFollowDate: '下次跟进', remark: '备注',
}

function viewDetail(lead: LeadRecord) { detailLead.value = lead }
</script>

<style lang="scss" scoped>
.lead-entry { max-width: 1400px; }

.stat-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.mini-stat {
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-stat-label { font-size: 11px; color: #64748b; }
.mini-stat-value { font-size: 18px; font-weight: 700; }

.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.search-group { display: flex; gap: 8px; flex-wrap: wrap; }
.search-input { background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; color: #e2e8f0; font-size: 13px; width: 200px; outline: none; &:focus { border-color: rgba(96,165,250,0.4); } &::placeholder { color: #475569; } }
.filter-select { background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; color: #e2e8f0; font-size: 13px; outline: none; cursor: pointer; option { background: #161B22; } }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s;
  &.primary { background: linear-gradient(135deg, #60a5fa, #4a8fe7); color: #fff; &:hover { opacity: 0.9; } }
  &.ghost { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; &:hover { background: rgba(255,255,255,0.05); } }
}
.btn-link { background: none; border: none; color: #60a5fa; cursor: pointer; font-size: 12px; &:hover { text-decoration: underline; } }

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
.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

.customer-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-avatar {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.segment-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(167,139,250,0.1);
  color: #a78bfa;
}

.source-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(96,165,250,0.1);
  color: #60a5fa;
}

.status-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  &.new { background: rgba(96,165,250,0.12); color: #60a5fa; }
  &.visited { background: rgba(6,182,212,0.12); color: #06b6d4; }
  &.intent { background: rgba(245,158,11,0.12); color: #F59E0B; }
  &.subscribed { background: rgba(167,139,250,0.12); color: #a78bfa; }
  &.closed { background: rgba(34,197,94,0.12); color: #22C55E; }
  &.lost { background: rgba(239,68,68,0.12); color: #EF4444; }
}

.action-cell {
  display: flex;
  gap: 8px;
}

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal { width: 640px; max-height: 80vh; background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; &.modal-sm { width: 480px; } }
.modal-header { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); h3 { font-size: 16px; font-weight: 600; } }
.modal-close { background: none; border: none; color: #64748b; font-size: 18px; cursor: pointer; &:hover { color: #e2e8f0; } }
.modal-body { padding: 24px; overflow-y: auto; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.form-item { display: flex; flex-direction: column; gap: 6px; &.span-2 { grid-column: span 2; }
  label { font-size: 12px; color: #94a3b8; font-weight: 500; }
  input, select, textarea { background: #0d1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; color: #e2e8f0; font-size: 13px; outline: none; transition: border-color 0.2s; font-family: inherit; &:focus { border-color: rgba(96,165,250,0.4); } &::placeholder { color: #475569; } }
  textarea { resize: vertical; }
  select option { background: #0d1117; }
}
.modal-footer { padding: 16px 24px; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid rgba(255,255,255,0.06); }

.detail-grid { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; }
.detail-label { font-size: 12px; color: #64748b; text-align: right; }
.detail-value { font-size: 13px; }
</style>
