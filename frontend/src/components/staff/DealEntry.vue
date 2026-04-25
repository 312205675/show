<template>
  <div class="deal-entry">
    <div class="toolbar">
      <div class="search-group">
        <input v-model="searchText" placeholder="搜索项目 / 客户 / 房号..." class="search-input" />
        <select v-model="filterProject" class="filter-select">
          <option value="">全部项目</option>
          <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        <select v-model="filterChannel" class="filter-select">
          <option value="">全部渠道</option>
          <option v-for="ch in channelList" :key="ch" :value="ch">{{ ch }}</option>
        </select>
      </div>
      <button class="btn primary" @click="openAddModal">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
        录入成交
      </button>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>成交日期</th>
            <th>项目</th>
            <th>房号</th>
            <th>户型</th>
            <th>面积</th>
            <th>单价</th>
            <th>总价</th>
            <th>客户</th>
            <th>渠道</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="deal in filteredDeals" :key="deal.id">
            <td class="text-muted">{{ deal.dealDate }}</td>
            <td class="text-primary">{{ deal.projectName }}</td>
            <td>{{ deal.unitNo }}</td>
            <td>{{ deal.unitType }}</td>
            <td>{{ deal.area }}㎡</td>
            <td>{{ deal.unitPrice.toLocaleString() }}</td>
            <td class="text-money">{{ deal.totalAmount }}万</td>
            <td>{{ deal.customerName }}</td>
            <td><span class="channel-tag">{{ deal.channel }}</span></td>
            <td><button class="btn-link" @click="viewDetail(deal)">详情</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 录入弹窗 -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>录入成交信息</h3>
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
              <label>成交日期 *</label>
              <input v-model="form.dealDate" type="date" />
            </div>
            <div class="form-item">
              <label>房号 *</label>
              <input v-model="form.unitNo" placeholder="如: 3栋2单元1501" />
            </div>
            <div class="form-item">
              <label>户型</label>
              <select v-model="form.unitType">
                <option v-for="t in unitTypes" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>面积 (㎡) *</label>
              <input v-model.number="form.area" type="number" />
            </div>
            <div class="form-item">
              <label>单价 (元/㎡) *</label>
              <input v-model.number="form.unitPrice" type="number" />
            </div>
            <div class="form-item">
              <label>客户姓名 *</label>
              <input v-model="form.customerName" placeholder="客户姓名" />
            </div>
            <div class="form-item">
              <label>客户电话</label>
              <input v-model="form.customerPhone" placeholder="手机号" />
            </div>
            <div class="form-item">
              <label>成交渠道</label>
              <select v-model="form.channel">
                <option v-for="ch in channelList" :key="ch" :value="ch">{{ ch }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>总价 (万)</label>
              <input :value="totalAmount" readonly class="computed-field" />
            </div>
            <div class="form-item span-2">
              <label>备注</label>
              <textarea v-model="form.remark" placeholder="补充说明" rows="2"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn ghost" @click="showModal = false">取消</button>
          <button class="btn primary" @click="submitDeal">确认录入</button>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div class="modal-overlay" v-if="detailDeal" @click.self="detailDeal = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>成交详情</h3>
          <button class="modal-close" @click="detailDeal = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <template v-for="(label, key) in detailLabels" :key="key">
              <span class="detail-label">{{ label }}</span>
              <span class="detail-value">{{ detailDeal[key as keyof DealRecord] }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStaffStore, type DealRecord } from '@/store/staffStore'

const store = useStaffStore()

const searchText = ref('')
const filterProject = ref('')
const filterChannel = ref('')
const showModal = ref(false)
const detailDeal = ref<DealRecord | null>(null)

const channelList = ['自渠(售楼处)', '贝壳链家', '安居客', '抖音直播', '微信小程序', '房天下', '中介分销', '老带新']
const unitTypes = ['1室1厅', '2室1厅', '2室2厅', '3室1厅', '3室2厅', '4室2厅']

const filteredDeals = computed(() => {
  return store.deals.filter(d => {
    if (filterProject.value && d.projectId !== filterProject.value) return false
    if (filterChannel.value && d.channel !== filterChannel.value) return false
    if (searchText.value) {
      const s = searchText.value.toLowerCase()
      return d.projectName.toLowerCase().includes(s) || d.customerName.includes(s) || d.unitNo.includes(s)
    }
    return true
  }).slice(0, 30)
})

const form = reactive({
  projectId: '',
  projectName: '',
  dealDate: new Date().toISOString().slice(0, 10),
  unitNo: '',
  unitType: '3室2厅',
  area: 100,
  unitPrice: 15000,
  customerName: '',
  customerPhone: '',
  channel: '自渠(售楼处)',
  remark: '',
})

const totalAmount = computed(() => Math.round(form.area * form.unitPrice / 10000))

function onProjectChange() {
  const proj = store.projects.find(p => p.id === form.projectId)
  if (proj) {
    form.projectName = proj.name
    form.unitPrice = proj.avgPrice
  }
}

function openAddModal() {
  Object.assign(form, {
    projectId: '', projectName: '', dealDate: new Date().toISOString().slice(0, 10),
    unitNo: '', unitType: '3室2厅', area: 100, unitPrice: 15000,
    customerName: '', customerPhone: '', channel: '自渠(售楼处)', remark: '',
  })
  showModal.value = true
}

function submitDeal() {
  if (!form.projectId || !form.unitNo || !form.customerName) return
  store.addDeal({
    projectId: form.projectId,
    projectName: form.projectName,
    dealDate: form.dealDate,
    unitNo: form.unitNo,
    unitType: form.unitType,
    area: form.area,
    unitPrice: form.unitPrice,
    totalAmount: totalAmount.value,
    customerName: form.customerName,
    customerPhone: form.customerPhone,
    channel: form.channel,
    remark: form.remark,
  })
  showModal.value = false
}

const detailLabels: Record<string, string> = {
  dealDate: '成交日期', projectName: '项目', unitNo: '房号', unitType: '户型',
  area: '面积(㎡)', unitPrice: '单价(元/㎡)', totalAmount: '总价(万)',
  customerName: '客户', customerPhone: '电话', channel: '渠道', remark: '备注',
}

function viewDetail(deal: DealRecord) { detailDeal.value = deal }
</script>

<style lang="scss" scoped>
.deal-entry { max-width: 1400px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.search-group { display: flex; gap: 8px; }
.search-input { background: var(--staff-card-bg); border: 1px solid var(--staff-border-input); border-radius: 8px; padding: 8px 14px; color: var(--staff-text); font-size: 13px; width: 220px; outline: none; transition: border-color 0.2s; &:focus { border-color: var(--staff-border-focus); } &::placeholder { color: var(--staff-text-4); } }
.filter-select { background: var(--staff-card-bg); border: 1px solid var(--staff-border-input); border-radius: 8px; padding: 8px 12px; color: var(--staff-text); font-size: 13px; outline: none; cursor: pointer; option { background: var(--staff-card-bg); } }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s;
  &.primary { background: var(--staff-primary-grad); color: #fff; &:hover { opacity: 0.9; } }
  &.ghost { background: transparent; border: 1px solid var(--staff-border); color: var(--staff-text-2); &:hover { background: var(--staff-hover-2); } }
}
.btn-link { background: none; border: none; color: var(--staff-primary); cursor: pointer; font-size: 12px; &:hover { text-decoration: underline; } }

.table-wrap { background: var(--staff-card-bg); border: 1px solid var(--staff-border); border-radius: 12px; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse;
  th { font-size: 11px; color: var(--staff-text-3); font-weight: 500; text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--staff-border); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  td { font-size: 13px; padding: 10px 16px; border-bottom: 1px solid var(--staff-hover); white-space: nowrap; }
  tr:hover td { background: var(--staff-hover); }
}
.text-primary { color: var(--staff-primary); font-weight: 500; }
.text-money { color: var(--staff-success); font-weight: 600; }
.text-muted { color: var(--staff-text-3); }
.channel-tag { font-size: 11px; padding: 2px 8px; border-radius: 4px; background: var(--staff-primary-bg); color: var(--staff-primary); }
.computed-field { background: rgba(var(--staff-primary-rgb), 0.08) !important; border-color: rgba(var(--staff-primary-rgb), 0.2) !important; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--staff-overlay); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal { width: 640px; max-height: 80vh; background: var(--staff-card-bg); border: 1px solid var(--staff-border); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; &.modal-sm { width: 480px; } }
.modal-header { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--staff-border); h3 { font-size: 16px; font-weight: 600; } }
.modal-close { background: none; border: none; color: var(--staff-text-3); font-size: 18px; cursor: pointer; &:hover { color: var(--staff-text); } }
.modal-body { padding: 24px; overflow-y: auto; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.form-item { display: flex; flex-direction: column; gap: 6px; &.span-2 { grid-column: span 2; }
  label { font-size: 12px; color: var(--staff-text-2); font-weight: 500; }
  input, select, textarea { background: var(--staff-input-bg); border: 1px solid var(--staff-border-input); border-radius: 8px; padding: 8px 12px; color: var(--staff-text); font-size: 13px; outline: none; transition: border-color 0.2s; font-family: inherit; &:focus { border-color: var(--staff-border-focus); } &::placeholder { color: var(--staff-text-4); } }
  textarea { resize: vertical; }
  select option { background: var(--staff-input-bg); }
}
.modal-footer { padding: 16px 24px; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid var(--staff-border); }

.detail-grid { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; }
.detail-label { font-size: 12px; color: var(--staff-text-3); text-align: right; }
.detail-value { font-size: 13px; }
</style>
