import { ref } from 'vue'

// Module-level state: shared across all component instances
const active = ref(false)
const type = ref('')

export function usePageTransition() {
  function startTransition(t: string) {
    type.value = t
    active.value = true
  }

  function endTransition() {
    active.value = false
    type.value = ''
  }

  return {
    transitionActive: active,
    transitionType: type,
    startTransition,
    endTransition,
  }
}
