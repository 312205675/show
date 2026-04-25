import { ref, onMounted, onUnmounted } from 'vue'

export function useAutoRefresh(intervalMs = 30000) {
  const store = ref<any>(null)
  let timer: ReturnType<typeof setInterval> | null = null

  function start(callback: () => void) {
    stop()
    timer = setInterval(callback, intervalMs)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onUnmounted(() => stop())

  return { start, stop }
}
