// --- CHEVRON STITCH GEOMETRY ---

export const STITCH = {
  WIDTH: 26,
  THICKNESS: 18, // THICKNESS and row spacing
  DEPTH: 15,
}

// SVG points for chevron stitch
export function stitchPoints(col, row, { WIDTH, THICKNESS, DEPTH } = STITCH) {
  const x = col * WIDTH
  const y = row * THICKNESS
  const mx = x + WIDTH / 2
  // Upper V edge: A -> B -> C. Lower V edge: F -> E -> D (reversed).
  const pts = [
    [x, y], // A outer top-left
    [mx, y + DEPTH], // B upper dip
    [x + WIDTH, y], // C outer top-right
    [x + WIDTH, y + THICKNESS], // D lower right
    [mx, y + DEPTH + THICKNESS], // E lower dip
    [x, y + THICKNESS], // F lower left
  ]
  return pts.map(([px, py]) => `${px},${py}`).join(' ')
}

export function stitchViewSize(cols, rows, { WIDTH, THICKNESS, DEPTH } = STITCH) {
  return { width: cols * WIDTH, height: rows * THICKNESS + DEPTH }
}

// Hit test to account for chevron dip
export function stitchAtPoint(px, py, cols, rows, { WIDTH, THICKNESS, DEPTH } = STITCH) {
  const col = Math.floor(px / WIDTH)
  if (col < 0 || col >= cols) return null
  const xInCell = px - col * WIDTH
  const dip = DEPTH * (1 - Math.abs(xInCell - WIDTH / 2) / (WIDTH / 2))
  const row = Math.floor((py - dip) / THICKNESS)
  if (row < 0 || row >= rows) return null
  return { row, col }
}
