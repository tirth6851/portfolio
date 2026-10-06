import { CanvasTexture, LinearFilter, Sprite, SpriteMaterial, SRGBColorSpace } from 'three'

const font = '500 28px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

export function createLabel(text: string, color: string, dpr: number) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas labels are unavailable')
  const words = text.split(' ')
  const lines = ['']
  for (const word of words) {
    const last = lines.length - 1
    if (lines[last].length && `${lines[last]} ${word}`.length > 20) lines.push(word)
    else lines[last] += `${lines[last] ? ' ' : ''}${word}`
  }
  context.font = font
  const width = Math.ceil(Math.max(...lines.map(line => context.measureText(line).width))) + 16
  const height = lines.length * 36 + 8
  const ratio = Math.min(2, Math.max(1, dpr))
  canvas.width = Math.ceil(width * ratio)
  canvas.height = Math.ceil(height * ratio)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearFilter
  texture.generateMipmaps = false
  // The texture supplies the palette colour; the material's default white is a neutral multiplier.
  const material = new SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false })
  const sprite = new Sprite(material)
  sprite.scale.set(width * 0.0098, height * 0.0098, 1)
  sprite.position.y = -0.72 - (lines.length - 1) * 0.17
  sprite.renderOrder = 5
  let previousColor = ''
  function setColor(next: string) {
    if (next === previousColor) return
    previousColor = next
    context!.setTransform(ratio, 0, 0, ratio, 0, 0)
    context!.clearRect(0, 0, width, height)
    context!.font = font
    context!.textAlign = 'center'
    context!.textBaseline = 'middle'
    context!.fillStyle = next
    lines.forEach((line, index) => context!.fillText(line, width / 2, 22 + index * 36))
    texture.needsUpdate = true
  }
  setColor(color)
  return {
    sprite, material, setColor,
    dispose() { texture.dispose(); material.dispose() },
  }
}
