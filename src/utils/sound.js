let audioContext = null

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext

  if (!AudioContextClass) {
    return null
  }

  if (!audioContext) {
    audioContext = new AudioContextClass()
  }

  return audioContext
}

async function ensureAudioContext() {
  const context = getAudioContext()

  if (!context) {
    return null
  }

  if (context.state === 'suspended') {
    await context.resume()
  }

  return context
}

function scheduleTone(context, frequency, durationMs, volume, startAt) {
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  const normalizedVolume = Math.max(0, Math.min(1, volume / 100))
  const attackEnd = startAt + 0.01
  const releaseStart = startAt + durationMs / 1000

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, startAt)

  gainNode.gain.setValueAtTime(0.0001, startAt)
  gainNode.gain.linearRampToValueAtTime(normalizedVolume, attackEnd)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, releaseStart)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  oscillator.start(startAt)
  oscillator.stop(releaseStart + 0.02)
}

export async function playNotification(volume) {
  const context = await ensureAudioContext()

  if (!context) {
    return
  }

  const startAt = context.currentTime

  scheduleTone(context, 880, 150, volume, startAt)
  scheduleTone(context, 1108, 150, volume, startAt + 0.2)
}

export async function playTick(volume) {
  const context = await ensureAudioContext()

  if (!context) {
    return
  }

  const startAt = context.currentTime

  scheduleTone(context, 440, 30, volume * 0.2, startAt)
}
