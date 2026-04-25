<template>
  <div class="return-entry">
    <!-- 统计卡片 -->
    <div class="stat-row">
      <div class="mini-stat">
        <span class="mini-stat-label">今日回款</span>
        <span class="mini-stat-value text-money">{{ todayTotal.toFixed(1) }}万</span>
      </div>
      <div class="mini-stat">
        <span class="mini-stat-label">本月回款</span>
        <span class="mini-stat-value text-money">{{ monthTotal.toFixed(1) }}万</span>
      </div>
      <div class="mini-stat">
        <span class="mini-stat-label">回款笔数</span>
        <span class="mini-stat-value">{{ filteredReturns.length }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-stat-label">全款占比</span>
        <span class="mini-stat-value text-primary">{{ fullPayRatio }}%</span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-group">
        <input v-model="searchText" placeholder="搜索项目 / 付款人 / 合同号..." class="search-input" />
        <select v-model="filterProject" class="filter-select">
          <option value="">全部项目</option>
          <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        <select v-model="filterPaymentType" class="filter-select">
          <option value="">全部类型</option>
          <option v-for="pt in paymentTypes" :key="pt" :value="pt">{{ pt }}</option>
        </select>
      </div>
      <button class="btn primary" @click="openAddModal">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
        录入回款
      </button>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>回款日期</th>
            <th>项目</th>
            <th>回款金额</th>
            <th>付款方式</th>
            <th>付款人</th>
            <th>银行</th>
            <th>合同号</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ret in filteredReturns" :key="ret.id">
            <td class="text-muted">{{ ret.returnDate }}</td>
            <td class="text-primary">{{ ret.projectName }}</td>
            <td class="text-money">{{ ret.amount.toFixed(1) }}万</td>
            <td><span class="pay-tag" :class="payTagClass(ret.paymentType)">{{ ret.paymentType }}</span></td>
            <td>{{ ret.payerName }}</td>
            <td>{{ ret.bankName }}</td>
            <td class="text-muted mono">{{ ret.contractNo }}</td>
            <td><button class="btn-link" @click="viewDetail(ret)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 录入弹窗 -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>录入回款信息</h3>
          <button class="modal-close" @click="showModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>所属项目 *</label>
              <select v-model="form.projectId" @change="onProjectChange">
                <option value="">请选择项目</option>
                <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>回款日期 *</label>
              <input v-model="form.returnDate" type="date" />
            </div>
            <div class="form-item">
              <label>回款金额 (万) *</label>
              <input v-model.number="form.amount" type="number" step="0.1" />
            </div>
            <div class="form-item">
              <label>付款方式 *</label>
              <select v-model="form.paymentType">
                <option v-for="pt in paymentTypes" :key="pt" :value="pt">{{ pt }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>付款人姓名 *</label>
              <input v-model="form.payerName" placeholder="付款人姓名" />
            </div>
            <div class="form-item">
              <label>付款人电话</label>
              <input v-model="form.payerPhone" placeholder="手机号" />
            </div>
            <div class="form-item">
              <label>贷款银行</label>
              <select v-model="form.bankName">
                <option v-for="b in bankList" :key="b" :value="b">{{ b }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>合同编号</label>
              <input v-model="form.contractNo" placeholder="如: HT20260101001" />
            </div>
            <div class="form-item span-2">
              <label>备注</label>
              <textarea v-model="form.remark" placeholder="补充说明" rows="2"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn ghost" @click="showModal = false">取消</button>
          <button class="btn primary" @click="submitReturn">确认录入</button>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div class="modal-overlay" v-if="detailRecord" @click.self="detailRecord = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>回款详情</h3>
          <button class="modal-close" @click="detailRecord = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <template v-for="(label, key) in detailLabels" :key="key">
              <span class="detail-label">{{ label }}</span>
              <span class="detail-value" :class="{ 'text-money': key === 'amount' }">
                {{ key === 'amount' ? (detailRecord as any)[key].toFixed(1) + '万' : (detailRecord as any)[key] }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStaffStore, type ReturnRecord } from '@/store/staffStore'

const store = useStaffStore()

const searchText = ref('')
const filterProject = ref('')
const filterPaymentType = ref('')
const showModal = ref(false)
const detailRecord = ref<ReturnRecord | null>(null)

const paymentTypes: ReturnRecord['paymentType'][] = ['首付', '按揭', '全款', '分期']
const bankList = ['工商银行', '建设银行', '农业银行', '中国银行', '交通银行', '招商银行', '邮政储蓄', '民生银行']

// 统计
const todayTotal = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return store.returns.filter(r => r.returnDate === today).reduce((s, r) => s + r.amount, 0)
})
const monthTotal = computed(() => store.monthReturnAmount)
const fullPayRatio = computed(() => {
  const total = store.returns.length || 1
  return ((store.returns.filter(r => r.paymentType === '全款').length / total) * 100).toFixed(1)
})

const filteredReturns = computed(() => {
  return store.returns.filter(r => {
    if (filterProject.value && r.projectId !== filterProject.value) return false
    if (filterPaymentType.value && r.paymentType !== filterPaymentType.value) return false
    if (searchText.value) {
      const s = searchText.value.toLowerCase()
      return r.projectName.toLowerCase().includes(s) || r.payerName.includes(s) || r.contractNo.includes(s)
    }
    return true
  }).slice(0, 40)
})

const form = reactive({
  projectId: '',
  projectName: '',
  returnDate: new Date().toISOString().slice(0, 10),
  amount: 80,
  payerName: '',
  payerPhone: '',
  paymentType: '首付' as ReturnRecord['paymentType'],
  bankName: '建设银行',
  contractNo: '',
  remark: '',
})

function onProjectChange() {
  const proj = store.projects.find(p => p.id === form.projectId)
  if (proj) form.projectName = proj.name
}

function openAddModal() {
  Object.assign(form, {
    projectId: '', projectName: '', returnDate: new Date().toISOString().slice(0, 10),
    amount: 80, payerName: '', payerPhone: '', paymentType: '首付',
    bankName: '建设银行', contractNo: '', remark: '',
  })
  showModal.value = true
}

function submitReturn() {
  if (!form.projectId || !form.amount || !form.payerName) return
  store.addReturn({ ...form })
  showModal.value = false
}

function payTagClass(type: string) {
  const map: Record<string, string> = { '全款': 'full', '首付': 'down', '按揭': 'mortgage', '分期': 'installment' }
  return map[type] || ''
}

const detailLabels: Record<string, string> = {
  returnDate: '回款日期', projectName: '项目', amount: '回款金额',
  paymentType: '付款方式', payerName: '付款人', payerPhone: '电话',
  bankName: '银行', contractNo: '合同号', remark: '备注',
}

function viewDetail(record: ReturnRecord) { detailRecord.value = record }
</script>

<style lang="scss" scoped>
.return-entry { max-width: 1400px; }

.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
.mini-stat-value { font-size: 20px; font-weight: 700; }

.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.search-group { display: flex; gap: 8px; }
.search-input { background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; color: #e2e8f0; font-size: 13px; width: 220px; outline: none; &:focus { border-color: rgba(96,165,250,0.4); } &::placeholder { color: #475569; } }
.filter-select { background: #161B22; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; color: #e2e8f0; font-size: 13px; outline: none; cursor: pointer; option { background: #161B22; } }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s;
  &.primary { background: linear-gradient(135deg, #60a5fa, #4a8fe7); color: #fff; &:hover { opacity: 0.9; } }
  &.ghost { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; &:hover { background: rgba(255,255,255,0.05); } }
}
.btn-link { background: none; border: none; color: #60a5fa; cursor: pointer; font-size: 12px; &:hover { text-decoration: underline; } }

.table-wrap { background: #161B22; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse;
  th { font-size: 11px; color: #64748b; font-weight: 500; text-align: left; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  td { font-size: 13px; padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.02); white-space: nowrap; }
  tr:hover td { background: rgba(255,255,255,0.02); }
}
.text-primary { color: #60a5fa; font-weight: 500; }
.text-money { color: #22C55E; font-weight: 600; }
.text-muted { color: #64748b; }
.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

.pay-tag {
  font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 500;
  &.full { background: rgba(34,197,94,0.12); color: #22C55E; }
  &.down { background: rgba(96,165,250,0.12); color: #60a5fa; }
  &.mortgage { background: rgba(245,158,11,0.12); color: #F59E0B; }
  &.installment { background: rgba(167,139,250,0.12); color: #a78bfa; }
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
