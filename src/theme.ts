import type { ScenePalette } from '@/scene/types'

/** Colors shared by canvas/SVG code that cannot read CSS variables directly. */
export const COLORS = {
  bg: '#05070a',
  ink: '#eef3ef',
  soft: '#a3b0aa',
  accent: '#4de0a0',
  glow: '#6ea8ff',
  violet: '#a78bfa',
  amber: '#f5c04a',
  coral: '#ff8a5c',
} as const

export const scenePalette: ScenePalette = {
  background: '#05080b',
  ink: COLORS.ink,
  muted: '#7d8a84',
  accent: COLORS.accent,
  glow: COLORS.glow,
  packet: COLORS.amber,
  fallback: COLORS.coral,
}
