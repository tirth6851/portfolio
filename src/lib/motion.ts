import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

/** Page-wide "pause animation" switch: CSS animations pause via a data attribute, JS visuals read the hook. */
export function setMotionPaused(paused: boolean) {
  if (paused) document.documentElement.dataset.motion = 'paused'
  else delete document.documentElement.dataset.motion
  listeners.forEach((l) => l())
}

const read = () => document.documentElement.dataset.motion === 'paused'

export function useMotionPaused(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    read,
    () => false,
  )
}
