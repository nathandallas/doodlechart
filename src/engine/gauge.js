export const YARN_PRESETS = {
  lace: { stitches: 33, rows: 40 },
  fingering: { stitches: 28, rows: 36 },
  sport: { stitches: 24, rows: 32 },
  dk: { stitches: 22, rows: 28 },
  worsted: { stitches: 20, rows: 26 },
  aran: { stitches: 18, rows: 24 },
  bulky: { stitches: 15, rows: 20 },
  super_bulky: { stitches: 10, rows: 14 },
}

export function stitchDimensionsForGauge(gauge, { baseHeight = 18, dipRatio = 15 / 18 } = {}) {
  const { stitches, rows, stitchSpan = 4, rowSpan = 4, square = false } =
    typeof gauge === 'string' ? YARN_PRESETS[gauge] : gauge
  if (!square && (!stitches || !rows)) {
    throw new Error(`Unknown gauge preset or invalid gauge object: ${gauge}`)
  }

  if (square) {
    const size = Math.round(baseHeight * (24 / 18))
    return { W: size, T: size, D: Math.round(size * dipRatio) }
  }

  const aspect = (stitchSpan * rows) / (rowSpan * stitches)
  const T = baseHeight
  const W = Math.round(T * aspect)
  const D = Math.round(T * dipRatio)
  return { W, T, D }
}