import { ref } from 'vue'

// Web Audio API based sound engine — no external files needed
const isMuted = ref(false)
let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playTone(freq: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  if (isMuted.value) return
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Silently fail if audio isn't available
  }
}

function playChord(freqs: number[], duration: number, volume: number) {
  freqs.forEach(f => playTone(f, duration, volume))
}

// ===== Predefined sound effects =====

export function playClickSound() {
  playTone(800, 0.06, 0.04, 'square')
}

export function playTabSwitchSound() {
  playTone(600, 0.08, 0.03, 'sine')
  setTimeout(() => playTone(900, 0.08, 0.03, 'sine'), 60)
}

export function playNotificationSound() {
  // Pleasant chime — two quick ascending tones
  playTone(523, 0.15, 0.05, 'sine')    // C5
  setTimeout(() => playTone(659, 0.15, 0.05, 'sine'), 100)  // E5
  setTimeout(() => playTone(784, 0.2, 0.04, 'sine'), 200)   // G5
}

export function playExpandSound() {
  // Whoosh-like expand
  playTone(300, 0.15, 0.03, 'sawtooth')
  setTimeout(() => playTone(500, 0.12, 0.02, 'sawtooth'), 50)
}

export function playHoverSound() {
  playTone(1200, 0.04, 0.01, 'sine')
}

export function playSuccessSound() {
  playChord([523, 659, 784], 0.2, 0.04)
}

export function playAlertSound() {
  playTone(440, 0.1, 0.04, 'triangle')
  setTimeout(() => playTone(440, 0.1, 0.04, 'triangle'), 150)
}

export function playRobotTipSound() {
  // Cute robot bleep
  playTone(880, 0.06, 0.03, 'square')
  setTimeout(() => playTone(1100, 0.08, 0.03, 'square'), 80)
}

export function toggleMute() {
  isMuted.value = !isMuted.value
}

export function setMuted(muted: boolean) {
  isMuted.value = muted
}

export function useSound() {
  return {
    isMuted,
    toggleMute,
    setMuted,
    playClickSound,
    playTabSwitchSound,
    playNotificationSound,
    playExpandSound,
    playHoverSound,
    playSuccessSound,
    playAlertSound,
    playRobotTipSound,
  }
}
