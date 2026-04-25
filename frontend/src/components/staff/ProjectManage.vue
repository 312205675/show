<template>
  <div class="project-manage">
    <!-- 搜索栏 -->
    <div class="toolbar">
      <div class="search-group">
        <input v-model="searchText" placeholder="搜索项目名称 / 区域..." class="search-input" />
        <select v-model="filterCity" class="filter-select">
          <option value="">全部区域</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="green">健康</option>
          <option value="yellow">关注</option>
          <option value="red">预警</option>
        </select>
      </div>
      <button class="btn primary" @click="showAddModal = true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
        新增项目
      </button>
    </div>

    <!-- 项目卡片网格 -->
    <div class="project-grid">
      <div
        class="project-card"
        v-for="proj in filteredProjects"
        :key="proj.id"
        :class="'border-' + proj.status"
        @click="editProject(proj)"
      >
        <div class="card-top">
          <div class="card-name">{{ proj.name }}</div>
          <span class="card-status" :class="proj.status">
            {{ proj.status === 'green' ? '健康' : proj.status === 'yellow' ? '关注' : '预警' }}
          </span>
        </div>
        <div class="card-meta">
          <span>{{ proj.city }} · {{ proj.district }}</span>
        </div>
        <div class="card-stats">
          <div class="card-stat">
            <span class="stat-label">均价</span>
            <span class="stat-val">{{ proj.avgPrice.toLocaleString() }}<small>元/㎡</small></span>
          </div>
          <div class="card-stat">
            <span class="stat-label">总套数</span>
            <span class="stat-val">{{ proj.totalUnits }}</span>
          </div>
          <div class="card-stat">
            <span class="stat-label">去化率</span>
            <span class="stat-val">{{ (proj.soldUnits / proj.totalUnits * 100).toFixed(1) }}%</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="card-contact">{{ proj.contact }} {{ proj.phone }}</span>
          <span class="card-date">开盘: {{ proj.openDate }}</span>
        </div>
      </div>
    </div>

    <!-- 编辑/新增弹窗 -->
    <div class="modal-overlay" v-if="showAddModal || editingProject" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingProject ? '编辑项目' : '新增项目' }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-item">
              <label>项目名称</label>
              <input v-model="form.name" placeholder="请输入项目名称" />
            </div>
            <div class="form-item">
              <label>所属区域</label>
              <select v-model="form.city">
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
            <div class="form-item">
              <label>所属板块</label>
              <input v-model="form.district" placeholder="请输入板块" />
            </div>
            <div class="form-item">
              <label>均价 (元/㎡)</label>
              <input v-model.number="form.avgPrice" type="number" />
            </div>
            <div class="form-item">
              <label>总套数</label>
              <input v-model.number="form.totalUnits" type="number" />
            </div>
            <div class="form-item">
              <label>已售套数</label>
              <input v-model.number="form.soldUnits" type="number" />
            </div>
            <div class="form-item">
              <label>开盘日期</label>
              <input v-model="form.openDate" type="date" />
            </div>
            <div class="form-item">
              <label>健康状态</label>
              <select v-model="form.status">
                <option value="green">健康</option>
                <option value="yellow">关注</option>
                <option value="red">预警</option>
              </select>
            </div>
            <div class="form-item">
              <label>联系人</label>
              <input v-model="form.contact" placeholder="联系人姓名" />
            </div>
            <div class="form-item">
              <label>联系电话</label>
              <input v-model="form.phone" placeholder="联系电话" />
            </div>
            <div class="form-item span-2">
              <label>项目地址</label>
              <input v-model="form.address" placeholder="详细地址" />
            </div>
            <div class="form-item span-2">
              <label>项目描述</label>
              <textarea v-model="form.description" placeholder="项目简介" rows="3"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn ghost" @click="closeModal">取消</button>
          <button class="btn primary" @click="saveProject">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStaffStore, type ProjectInfo } from '@/store/staffStore'

const store = useStaffStore()

const searchText = ref('')
const filterCity = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)
const editingProject = ref<ProjectInfo | null>(null)

const cities = computed(() => [...new Set(store.projects.map(p => p.city))])

const filteredProjects = computed(() => {
  return store.projects.filter(p => {
    if (searchText.value && !p.name.includes(searchText.value) && !p.city.includes(searchText.value)) return false
    if (filterCity.value && p.city !== filterCity.value) return false
    if (filterStatus.value && p.status !== filterStatus.value) return false
    return true
  })
})

const defaultForm = () => ({
  name: '', city: '裕华区', district: '', avgPrice: 15000,
  totalUnits: 500, soldUnits: 0, status: 'green' as const,
  openDate: new Date().toISOString().slice(0, 10),
  developer: '石家庄城发投集团',
  contact: '', phone: '', address: '', description: '',
})
const form = reactive(defaultForm())

function editProject(proj: ProjectInfo) {
  editingProject.value = proj
  Object.assign(form, { ...proj })
}

function closeModal() {
  showAddModal.value = false
  editingProject.value = null
  Object.assign(form, defaultForm())
}

function saveProject() {
  if (editingProject.value) {
    store.updateProject(editingProject.value.id, { ...form })
  }
  closeModal()
}
</script>

<style lang="scss" scoped>
.project-manage { max-width: 1400px; }

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.search-group {
  display: flex;
  gap: 8px;
}

.search-input {
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 8px 14px;
  color: #e2e8f0;
  font-size: 13px;
  width: 240px;
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: rgba(96,165,250,0.4); }
  &::placeholder { color: #475569; }
}

.filter-select {
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 8px 12px;
  color: #e2e8f0;
  font-size: 13px;
  outline: none;
  cursor: pointer;

  &:focus { border-color: rgba(96,165,250,0.4); }
  option { background: #161B22; }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &.primary {
    background: linear-gradient(135deg, #60a5fa, #4a8fe7);
    color: #fff;
    &:hover { opacity: 0.9; transform: translateY(-1px); }
  }
  &.ghost {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8;
    &:hover { background: rgba(255,255,255,0.05); }
  }
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.project-card {
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(96,165,250,0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  &.border-green { border-left: 3px solid #22C55E; }
  &.border-yellow { border-left: 3px solid #F59E0B; }
  &.border-red { border-left: 3px solid #EF4444; }
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-name { font-size: 15px; font-weight: 600; }

.card-status {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;

  &.green { background: rgba(34,197,94,0.12); color: #22C55E; }
  &.yellow { background: rgba(245,158,11,0.12); color: #F59E0B; }
  &.red { background: rgba(239,68,68,0.12); color: #EF4444; }
}

.card-meta {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 16px;
}

.card-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.card-stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 11px;
  color: #475569;
}

.stat-val {
  font-size: 16px;
  font-weight: 600;
  margin-top: 2px;

  small { font-size: 10px; color: #64748b; font-weight: 400; }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.04);
  font-size: 11px;
  color: #475569;
}

.card-contact { }

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  width: 640px;
  max-height: 80vh;
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  h3 { font-size: 16px; font-weight: 600; }
}

.modal-close {
  background: none;
  border: none;
  color: #64748b;
  font-size: 18px;
  cursor: pointer;
  &:hover { color: #e2e8f0; }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.span-2 { grid-column: span 2; }

  label {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
  }

  input, select, textarea {
    background: #0d1117;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 8px 12px;
    color: #e2e8f0;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;

    &:focus { border-color: rgba(96,165,250,0.4); }
    &::placeholder { color: #475569; }
  }

  textarea { resize: vertical; }
  select option { background: #0d1117; }
}

.modal-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
</style>
