<template>
  <div class="inventory-manage">
    <!-- 统计行 -->
    <div class="stat-row">
      <div class="mini-stat" v-for="stat in invStats" :key="stat.label">
        <span class="mini-stat-label">{{ stat.label }}</span>
        <span class="mini-stat-value" :class="stat.cls">{{ stat.value }}</span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-group">
        <input v-model="searchText" placeholder="搜索项目 / 楼栋 / 房号..." class="search-input" />
        <select v-model="filterProject" class="filter-select">
          <option value="">全部项目</option>
          <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option v-for="s in statusList" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="filterDecoration" class="filter-select">
          <option value="">全部装修</option>
          <option v-for="d in decorationList" :key="d" :value="d">{{ d }}</option>
        </select>
        <select v-model="filterUnitType" class="filter-select">
          <option value="">全部户型</option>
          <option v-for="t in unitTypeList" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <button class="btn primary" @click="openAddModal">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
        新增房源
      </button>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>项目</th>
            <th>楼栋</th>
            <th>房号</th>
            <th>楼层</th>
            <th>户型</th>
            <th>面积</th>
            <th>单价</th>
            <th>总价</th>
            <th>朝向</th>
            <th>装修</th>
            <th>挂牌天数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="unit in filteredInventory" :key="unit.id">
            <td class="text-primary">{{ unit.projectName }}</td>
            <td>{{ unit.buildingNo }}</td>
            <td>{{ unit.unitNo }}</td>
            <td>{{ unit.floor }}/{{ unit.totalFloors }}</td>
            <td>{{ unit.unitType }}</td>
            <td>{{ unit.area }}㎡</td>
            <td>{{ unit.price.toLocaleString() }}</td>
            <td class="text-money">{{ unit.totalPrice }}万</td>
            <td>{{ unit.orientation }}</td>
            <td><span class="deco-tag" :class="decoClass(unit.decoration)">{{ unit.decoration }}</span></td>
            <td :class="{ 'text-warn': unit.daysOnMarket > 180 }">{{ unit.daysOnMarket }}天</td>
            <td>
              <span class="inv-status" :class="invStatusClass(unit.status)">{{ unit.status }}</span>
            </td>
            <td class="action-cell">
              <button class="btn-link" @click="viewDetail(unit)">详情</button>
              <button class="btn-link" @click="changeStatus(unit)" v-if="unit.status !== '已售'">改状态</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增弹窗 -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>新增房源</h3>
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
              <label>楼栋 *</label>
              <input v-model="form.buildingNo" placeholder="如: 5栋" />
            </div>
            <div class="form-item">
              <label>房号 *</label>
              <input v-model="form.unitNo" placeholder="如: 2单元1501" />
            </div>
            <div class="form-item">
              <label>楼层</label>
              <input v-model.number="form.floor" type="number" />
            </div>
            <div class="form-item">
              <label>总楼层</label>
              <input v-model.number="form.totalFloors" type="number" />
            </div>
            <div class="form-item">
              <label>户型</label>
              <select v-model="form.unitType">
                <option v-for="t in unitTypeList" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>面积 (㎡) *</label>
              <input v-model.number="form.area" type="number" />
            </div>
            <div class="form-item">
              <label>单价 (元/㎡) *</label>
              <input v-model.number="form.price" type="number" />
            </div>
            <div class="form-item">
              <label>朝向</label>
              <select v-model="form.orientation">
                <option v-for="o in orientations" :key="o" :value="o">{{ o }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>装修</label>
              <select v-model="form.decoration">
                <option v-for="d in decorationList" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div class="form-item span-2">
              <label>总价 (万)</label>
              <input :value="totalPriceComputed" readonly class="computed-field" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn ghost" @click="showModal = false">取消</button>
          <button class="btn primary" @click="submitInventory">确认录入</button>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div class="modal-overlay" v-if="detailUnit" @click.self="detailUnit = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>房源详情</h3>
          <button class="modal-close" @click="detailUnit = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <template v-for="(label, key) in detailLabels" :key="key">
              <span class="detail-label">{{ label }}</span>
              <span class="detail-value">{{ (detailUnit as any)[key] }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 改状态弹窗 -->
    <div class="modal-overlay" v-if="changingUnit" @click.self="changingUnit = null">
      <div class="modal modal-xs">
        <div class="modal-header">
          <h3>修改状态</h3>
          <button class="modal-close" @click="changingUnit = null">✕</button>
        </div>
        <div class="modal-body">
          <p class="change-info">房号: {{ changingUnit.buildingNo }} {{ changingUnit.unitNo }}</p>
          <div class="status-options">
            <button
              v-for="s in statusList"
              :key="s"
              class="status-option"
              :class="{ active: newStatus === s, [invStatusClass(s)]: true }"
              @click="newStatus = s"
            >{{ s }}</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn ghost" @click="changingUnit = null">取消</button>
          <button class="btn primary" @click="confirmChangeStatus">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStaffStore, type InventoryUnit } from '@/store/staffStore'

const store = useStaffStore()

const searchText = ref('')
const filterProject = ref('')
const filterStatus = ref('')
const filterDecoration = ref('')
const filterUnitType = ref('')
const showModal = ref(false)
const detailUnit = ref<InventoryUnit | null>(null)
const changingUnit = ref<InventoryUnit | null>(null)
const newStatus = ref<InventoryUnit['status']>('可售')

const statusList: InventoryUnit['status'][] = ['可售', '已售', '预留', '签约中']
const decorationList: InventoryUnit['decoration'][] = ['毛坯', '简装', '精装']
const unitTypeList = ['1室1厅', '2室1厅', '2室2厅', '3室1厅', '3室2厅', '4室2厅']
const orientations = ['南北通透', '朝南', '朝东', '朝西', '东南', '西南']

// 统计
const invStats = computed(() => {
  const all = store.inventoryUnits
  return [
    { label: '总房源', value: all.length + ' 套', cls: '' },
    { label: '可售', value: all.filter(u => u.status === '可售').length + ' 套', cls: 'text-money' },
    { label: '签约中', value: all.filter(u => u.status === '签约中').length + ' 套', cls: 'text-primary' },
    { label: '已售', value: all.filter(u => u.status === '已售').length + ' 套', cls: '' },
    { label: '预留', value: all.filter(u => u.status === '预留').length + ' 套', cls: 'text-warn' },
    { label: '去化率', value: ((all.filter(u => u.status === '已售').length / (all.length || 1)) * 100).toFixed(1) + '%', cls: 'text-primary' },
  ]
})

const filteredInventory = computed(() => {
  return store.inventoryUnits.filter(u => {
    if (filterProject.value && u.projectId !== filterProject.value) return false
    if (filterStatus.value && u.status !== filterStatus.value) return false
    if (filterDecoration.value && u.decoration !== filterDecoration.value) return false
    if (filterUnitType.value && u.unitType !== filterUnitType.value) return false
    if (searchText.value) {
      const s = searchText.value.toLowerCase()
      return u.projectName.toLowerCase().includes(s) || u.buildingNo.includes(s) || u.unitNo.includes(s)
    }
    return true
  }).slice(0, 50)
})

const form = reactive({
  projectId: '',
  projectName: '',
  buildingNo: '',
  unitNo: '',
  floor: 10,
  totalFloors: 33,
  unitType: '3室2厅',
  area: 100,
  price: 15000,
  totalPrice: 150,
  orientation: '南北通透',
  decoration: '毛坯' as InventoryUnit['decoration'],
  status: '可售' as InventoryUnit['status'],
  daysOnMarket: 0,
})

const totalPriceComputed = computed(() => Math.round(form.area * form.price / 10000))

function onProjectChange() {
  const proj = store.projects.find(p => p.id === form.projectId)
  if (proj) {
    form.projectName = proj.name
    form.price = proj.avgPrice
  }
}

function openAddModal() {
  Object.assign(form, {
    projectId: '', projectName: '', buildingNo: '', unitNo: '',
    floor: 10, totalFloors: 33, unitType: '3室2厅', area: 100,
    price: 15000, totalPrice: 150, orientation: '南北通透',
    decoration: '毛坯', status: '可售', daysOnMarket: 0,
  })
  showModal.value = true
}

function submitInventory() {
  if (!form.projectId || !form.buildingNo || !form.unitNo) return
  store.addInventoryUnit({
    ...form,
    totalPrice: totalPriceComputed.value,
  })
  showModal.value = false
}

function decoClass(d: string) {
  const map: Record<string, string> = { '精装': 'fine', '简装': 'simple', '毛坯': 'rough' }
  return map[d] || ''
}

function invStatusClass(s: string) {
  const map: Record<string, string> = { '可售': 'sale', '已售': 'sold', '预留': 'reserved', '签约中': 'signing' }
  return map[s] || ''
}

function viewDetail(unit: InventoryUnit) { detailUnit.value = unit }

function changeStatus(unit: InventoryUnit) {
  changingUnit.value = unit
  newStatus.value = unit.status
}

function confirmChangeStatus() {
  if (changingUnit.value) {
    store.updateInventoryStatus(changingUnit.value.id, newStatus.value)
    changingUnit.value = null
  }
}

const detailLabels: Record<string, string> = {
  projectName: '项目', buildingNo: '楼栋', unitNo: '房号',
  floor: '楼层', totalFloors: '总楼层', unitType: '户型',
  area: '面积(㎡)', price: '单价(元/㎡)', totalPrice: '总价(万)',
  orientation: '朝向', decoration: '装修', status: '状态',
  daysOnMarket: '挂牌天数',
}
</script>

<style lang="scss" scoped>
.inventory-manage { max-width: 1400px; }

.stat-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.mini-stat {
  background: var(--staff-card-bg);
  border: 1px solid var(--staff-border);
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background 0.3s, border-color 0.3s;
}

.mini-stat-label { font-size: 11px; color: var(--staff-text-3); }
.mini-stat-value { font-size: 18px; font-weight: 700; }

.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
.search-group { display: flex; gap: 8px; flex-wrap: wrap; }
.search-input { background: var(--staff-card-bg); border: 1px solid var(--staff-border-input); border-radius: 8px; padding: 8px 14px; color: var(--staff-text); font-size: 13px; width: 200px; outline: none; &:focus { border-color: var(--staff-border-focus); } &::placeholder { color: var(--staff-text-4); } }
.filter-select { background: var(--staff-card-bg); border: 1px solid var(--staff-border-input); border-radius: 8px; padding: 8px 12px; color: var(--staff-text); font-size: 13px; outline: none; cursor: pointer; option { background: var(--staff-card-bg); } }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s;
  &.primary { background: var(--staff-primary-grad); color: #fff; &:hover { opacity: 0.9; } }
  &.ghost { background: transparent; border: 1px solid var(--staff-border); color: var(--staff-text-2); &:hover { background: var(--staff-hover-2); } }
}
.btn-link { background: none; border: none; color: var(--staff-primary); cursor: pointer; font-size: 12px; &:hover { text-decoration: underline; } }

.table-wrap { background: var(--staff-card-bg); border: 1px solid var(--staff-border); border-radius: 12px; overflow: hidden; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse;
  th { font-size: 11px; color: var(--staff-text-3); font-weight: 500; text-align: left; padding: 12px 12px; border-bottom: 1px solid var(--staff-border); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  td { font-size: 13px; padding: 10px 12px; border-bottom: 1px solid var(--staff-hover); white-space: nowrap; }
  tr:hover td { background: var(--staff-hover); }
}
.text-primary { color: var(--staff-primary); font-weight: 500; }
.text-money { color: var(--staff-success); font-weight: 600; }
.text-muted { color: var(--staff-text-3); }
.text-warn { color: var(--staff-warning); font-weight: 500; }

.deco-tag {
  font-size: 11px; padding: 2px 6px; border-radius: 4px;
  &.fine { background: var(--staff-success-bg); color: var(--staff-success); }
  &.simple { background: var(--staff-primary-bg); color: var(--staff-primary); }
  &.rough { background: var(--staff-hover-3); color: var(--staff-text-2); }
}

.inv-status {
  font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 500;
  &.sale { background: var(--staff-success-bg); color: var(--staff-success); }
  &.sold { background: var(--staff-hover-3); color: var(--staff-text-2); }
  &.reserved { background: var(--staff-warning-bg); color: var(--staff-warning); }
  &.signing { background: var(--staff-purple-bg); color: var(--staff-purple); }
}

.action-cell { display: flex; gap: 8px; }
.computed-field { background: rgba(var(--staff-primary-rgb), 0.08) !important; border-color: rgba(var(--staff-primary-rgb), 0.2) !important; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--staff-overlay); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal { width: 640px; max-height: 80vh; background: var(--staff-card-bg); border: 1px solid var(--staff-border); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; &.modal-sm { width: 480px; } &.modal-xs { width: 360px; } }
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

.change-info { font-size: 13px; color: var(--staff-text-2); margin-bottom: 16px; }

.status-options { display: flex; gap: 10px; flex-wrap: wrap; }
.status-option {
  padding: 8px 16px; border-radius: 8px; font-size: 13px; cursor: pointer;
  border: 1px solid var(--staff-border-input); background: var(--staff-hover-4);
  color: var(--staff-text); transition: all 0.2s;
  &.active { border-width: 2px; }
  &.sale { border-color: rgba(var(--staff-success-rgb), 0.3); &.active { border-color: var(--staff-success); background: var(--staff-success-bg); color: var(--staff-success); } }
  &.sold { border-color: var(--staff-border); &.active { border-color: var(--staff-text-2); background: var(--staff-hover-3); color: var(--staff-text-2); } }
  &.reserved { border-color: rgba(var(--staff-warning-rgb), 0.3); &.active { border-color: var(--staff-warning); background: var(--staff-warning-bg); color: var(--staff-warning); } }
  &.signing { border-color: rgba(var(--staff-purple-rgb), 0.3); &.active { border-color: var(--staff-purple); background: var(--staff-purple-bg); color: var(--staff-purple); } }
}
</style>
