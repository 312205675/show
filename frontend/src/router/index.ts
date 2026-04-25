import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
    },
    {
      path: '/staff',
      name: 'StaffLayout',
      component: () => import('@/views/StaffLayout.vue'),
      redirect: '/staff/workbench',
      children: [
        {
          path: 'workbench',
          name: 'StaffWorkbench',
          component: () => import('@/components/staff/StaffWorkbench.vue'),
          meta: { title: '工作台', icon: 'workbench' },
        },
        {
          path: 'projects',
          name: 'ProjectManage',
          component: () => import('@/components/staff/ProjectManage.vue'),
          meta: { title: '项目管理', icon: 'projects' },
        },
        {
          path: 'deals',
          name: 'DealEntry',
          component: () => import('@/components/staff/DealEntry.vue'),
          meta: { title: '成交录入', icon: 'deals' },
        },
        {
          path: 'returns',
          name: 'ReturnEntry',
          component: () => import('@/components/staff/ReturnEntry.vue'),
          meta: { title: '回款管理', icon: 'returns' },
        },
        {
          path: 'leads',
          name: 'LeadEntry',
          component: () => import('@/components/staff/LeadEntry.vue'),
          meta: { title: '客户线索', icon: 'leads' },
        },
        {
          path: 'inventory',
          name: 'InventoryManage',
          component: () => import('@/components/staff/InventoryManage.vue'),
          meta: { title: '房源库存', icon: 'inventory' },
        },
        {
          path: 'channel',
          name: 'ChannelEntry',
          component: () => import('@/components/staff/ChannelEntry.vue'),
          meta: { title: '渠道数据', icon: 'channel' },
        },
      ],
    },
  ],
})

export default router
