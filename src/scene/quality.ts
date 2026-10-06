import type { SceneQuality } from './types'

/** Two-stage degradation. A recovered frame rate after removing bloom keeps the high particle budget. */
export function createQuality(initial: SceneQuality) {
  let tier = initial
  let bloom = initial === 'high'
  let ema = 16.7
  let slow = 0
  return {
    get tier() { return tier },
    get bloom() { return bloom },
    get dpr() { return tier === 'high' ? 1.5 : 1 },
    sample(milliseconds: number) {
      if (tier === 'low') return false
      ema += (Math.min(milliseconds, 100) - ema) * 0.06
      slow = ema > 20 ? slow + Math.min(milliseconds, 100) : 0
      if (slow < 2000) return false
      slow = 0
      ema = 16.7
      if (bloom) bloom = false
      else tier = 'low'
      return true
    },
    resetTiming() { ema = 16.7; slow = 0 },
  }
}
