<template>
  <div class="workbench">
    <!-- 顶部统计卡片 -->
    <div class="stat-grid">
      <div class="stat-card" v-for="stat in statCards" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.bg }">
          <span v-html="stat.icon"></span>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <div class="stat-trend" :class="stat.trendDir">
          <svg v-if="stat.trendDir === 'up'" width="12" height="12" viewBox="0 0 12 12"><path d="M6 2L10 7H2L6 2Z" fill="currentColor"/></svg>
          <svg v-else width="12" height="12" viewBox="0 0 12 12"><path d="M6 10L2 5H10L6 10Z" fill="currentColor"/></svg>
          {{ stat.trend }}
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- 今日待办 -->
      <div class="panel">
        <div class="panel-header">
          <h3>今日待办</h3>
          <span class="badge warn">{{ todoItems.filter(t => !t.done).length }}</span>
        </div>
        <div class="panel-body">
          <div
            class="todo-item"
            v-for="item in todoItems"
            :key="item.id"
            :class="{ done: item.done }"
            @click="item.done = !item.done"
          >
            <span class="todo-check">{{ item.done ? '✓' : '○' }}</span>
            <span class="todo-text">{{ item.text }}</span>
            <span class="todo-tag" :class="item.priority">{{ item.priority === 'high' ? '紧急' : item.priority === 'medium' ? '一般' : '低' }}</span>
          </div>
        </div>
      </div>

      <!-- 最近成交 -->
      <div class="panel">
        <div class="panel-header">
          <h3>最近成交</h3>
          <router-link to="/staff/deals" class="link-more">查看全部 →</router-link>
        </div>
        <div class="panel-body no-pad">
          <table class="mini-table">
            <thead>
              <tr><th>项目</th><th>房号</th><th>金额</th><th>日期</th></tr>
            </thead>
            <tbody>
              <tr v-for="deal in recentDeals" :key="deal.id">
                <td class="text-primary">{{ deal.projectName }}</td>
                <td>{{ deal.unitNo }}</td>
                <td class="text-money">{{ deal.totalAmount }}万</td>
                <td class="text-muted">{{ deal.dealDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 客户跟进提醒 -->
      <div class="panel">
        <div class="panel-header">
          <h3>跟进提醒</h3>
          <router-link to="/staff/leads" class="link-more">全部线索 →</router-link>
        </div>
        <div class="panel-body">
          <div class="follow-item" v-for="lead in followLeads" :key="lead.id">
            <div class="follow-avatar">{{ lead.customerName[0] }}</div>
            <div class="follow-info">
              <span class="follow-name">{{ lead.customerName }}</span>
              <span class="follow-project">{{ lead.projectName }}</span>
            </div>
            <div class="follow-meta">
              <span class="follow-status" :class="statusClass(lead.status)">{{ lead.status }}</span>
              <span class="follow-date">{{ lead.nextFollowDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目状态概览 -->
      <div class="panel span-2">
        <div class="panel-header">
          <h3>项目状态概览</h3>
          <router-link to="/staff/projects" class="link-more">管理项目 →</router-link>
        </div>
        <div class="panel-body no-pad">
          <table class="mini-table">
            <thead>
              <tr><th>项目名称</th><th>区域</th><th>均价</th><th>去化率</th><th>状态</th><th>联系人</th></tr>
            </thead>
            <tbody>
              <tr v-for="proj in store.projects.slice(0, 10)" :key="proj.id">
                <td class="text-primary">{{ proj.name }}</td>
                <td>{{ proj.city }}</td>
                <td>{{ proj.avgPrice.toLocaleString() }}元/㎡</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (proj.soldUnits / proj.totalUnits * 100) + '%', background: proj.status === 'green' ? '#22C55E' : proj.status === 'yellow' ? '#F59E0B' : '#EF4444' }"></div>
                  </div>
                  <span class="progress-text">{{ (proj.soldUnits / proj.totalUnits * 100).toFixed(1) }}%</span>
                </td>
                <td><span class="status-dot" :class="proj.status"></span></td>
                <td>{{ proj.contact }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStaffStore } from '@/store/staffStore'

const store = useStaffStore()

const statCards = computed(() => [
  {
    label: '今日成交',
    value: store.todayDealCount + ' 套',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>',
    bg: 'rgba(96,165,250,0.12)',
    trend: '+12%',
    trendDir: 'up' as const,
  },
  {
    label: '本月成交',
    value: store.monthDealCount + ' 套',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    bg: 'rgba(34,197,94,0.12)',
    trend: '+8.2%',
    trendDir: 'up' as const,
  },
  {
    label: '今日回款',
    value: store.todayReturnAmount.toFixed(1) + ' 万',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    bg: 'rgba(245,158,11,0.12)',
    trend: '+5.1%',
    trendDir: 'up' as const,
  },
  {
    label: '活跃线索',
    value: store.activeLeadCount + ' 条',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/></svg>',
    bg: 'rgba(167,139,250,0.12)',
    trend: '+3.8%',
    trendDir: 'up' as const,
  },
  {
    label: '可售房源',
    value: store.salableUnits + ' 套',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
    bg: 'rgba(6,182,212,0.12)',
    trend: '-2.3%',
    trendDir: 'down' as const,
  },
  {
    label: '本月回款',
    value: store.monthReturnAmount.toFixed(1) + ' 万',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    bg: 'rgba(244,114,182,0.12)',
    trend: '+6.7%',
    trendDir: 'up' as const,
  },
])

const recentDeals = computed(() => store.deals.slice(0, 6))
const followLeads = computed(() =>
  store.leads
    .filter(l => !['已成交', '已流失'].includes(l.status))
    .slice(0, 5)
)

const todoItems = ref([
  { id: 1, text: '城发投·翡翠城 3号楼签约跟进', done: false, priority: 'high' },
  { id: 2, text: '提交本周回款报表', done: false, priority: 'high' },
  { id: 3, text: '城发投·天颂 客户王先生回访', done: true, priority: 'medium' },
  { id: 4, text: '更新安居客渠道投放数据', done: false, priority: 'medium' },
  { id: 5, text: '正定新区项目定价调整建议', done: false, priority: 'low' },
  { id: 6, text: '栾城壹号院滞销房源分析', done: false, priority: 'low' },
])

function statusClass(status: string) {
  const map: Record<string, string> = {
    '新线索': 'new', '已到访': 'visited', '有意向': 'intent',
    '已认购': 'subscribed', '已成交': 'closed', '已流失': 'lost',
  }
  return map[status] || ''
}
</script>

<style lang="scss" scoped>
.workbench {
  max-width: 1400px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(96,165,250,0.2);
    transform: translateY(-1px);
  }
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.stat-trend {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;

  &.up { color: #22C55E; }
  &.down { color: #EF4444; }
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.panel {
  background: #161B22;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  overflow: hidden;

  &.span-2 { grid-column: span 2; }
}

.panel-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.04);

  h3 {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  padding: 0 6px;

  &.warn { background: rgba(245,158,11,0.15); color: #F59E0B; }
}

.link-more {
  font-size: 12px;
  color: #60a5fa;
  text-decoration: none;

  &:hover { text-decoration: underline; }
}

.panel-body {
  padding: 12px 16px;

  &.no-pad { padding: 0; }
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  cursor: pointer;
  transition: opacity 0.2s;

  &.done { opacity: 0.5; }
  &.done .todo-text { text-decoration: line-through; }
}

.todo-check {
  font-size: 14px;
  color: #60a5fa;
  width: 18px;
  text-align: center;
}

.todo-text {
  flex: 1;
  font-size: 13px;
}

.todo-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;

  &.high { background: rgba(239,68,68,0.15); color: #EF4444; }
  &.medium { background: rgba(245,158,11,0.15); color: #F59E0B; }
  &.low { background: rgba(96,165,250,0.12); color: #60a5fa; }
}

.mini-table {
  width: 100%;
  border-collapse: collapse;

  th {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    text-align: left;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    font-size: 13px;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.02);
  }

  tr:hover td { background: rgba(255,255,255,0.02); }
}

.text-primary { color: #60a5fa; font-weight: 500; }
.text-money { color: #22C55E; font-weight: 600; }
.text-muted { color: #64748b; font-size: 12px; }

.follow-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}

.follow-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  flex-shrink: 0;
}

.follow-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.follow-name { font-size: 13px; font-weight: 500; }
.follow-project { font-size: 11px; color: #64748b; }

.follow-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.follow-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;

  &.new { background: rgba(96,165,250,0.12); color: #60a5fa; }
  &.visited { background: rgba(6,182,212,0.12); color: #06b6d4; }
  &.intent { background: rgba(245,158,11,0.12); color: #F59E0B; }
  &.subscribed { background: rgba(167,139,250,0.12); color: #a78bfa; }
  &.closed { background: rgba(34,197,94,0.12); color: #22C55E; }
  &.lost { background: rgba(239,68,68,0.12); color: #EF4444; }
}

.follow-date {
  font-size: 11px;
  color: #475569;
}

.progress-bar {
  width: 80px;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #94a3b8;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.green { background: #22C55E; }
  &.yellow { background: #F59E0B; }
  &.red { background: #EF4444; }
}
</style>
