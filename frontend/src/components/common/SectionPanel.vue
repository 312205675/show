<template>
  <div class="section-panel panel" :class="{ 'animated-border': animated }">
    <div v-if="title" class="panel-title">
      {{ title }}
    </div>
    <div class="panel-content" :style="{ padding: noPadding ? '0' : undefined }">
      <slot />
    </div>
    <div v-if="$slots.footer" class="panel-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  animated?: boolean
  noPadding?: boolean
}>()
</script>

<style scoped lang="scss">
.section-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-content {
  flex: 1;
  padding: 8px 12px 12px;
  overflow: hidden;
  min-height: 0;
}

.panel-footer {
  padding: 8px 16px;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}
</style>
