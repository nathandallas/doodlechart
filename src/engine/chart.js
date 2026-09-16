export function createChart(cols, rows) {
  return {
    cols,
    rows,
    palette: ['#F7F4EE', '#bc5953', '#c47fa0', '#7b75da', '#3984a3', '#7a9e5e'],
    gridColor: '#666',
    gridOpacity: 1,
    cells: Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0)),
  }
}

export function setCell(chart, row, col, colorIndex) {
  if (row < 0 || row >= chart.rows || col < 0 || col >= chart.cols) {
    return false
  }
  if (chart.cells[row][col] === colorIndex) {
    return false
  }
  chart.cells[row][col] = colorIndex
  return true
}

export function floodFill(chart, row, col, colorIndex) {
  if (row < 0 || row >= chart.rows || col < 0 || col >= chart.cols) return false
  const { cells, rows, cols } = chart
  const target = cells[row][col]
  if (target === colorIndex) return false

  const stack = [[row, col]]
  while (stack.length) {
    const [r, c] = stack.pop()
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue
    if (cells[r][c] !== target) continue
    cells[r][c] = colorIndex
    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1])
  }
  return true
}

export function resizeChart(chart, cols, rows) {
  cols = Math.max(1, Math.floor(cols))
  rows = Math.max(1, Math.floor(rows))
  chart.cells = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => chart.cells[r]?.[c] ?? 0),
  )
  chart.cols = cols
  chart.rows = rows
}

export function clearChart(chart) {
  chart.cells = Array.from({ length: chart.rows }, () =>
    Array.from({ length: chart.cols }, () => 0),
  )
}

// Removes color from chart and updates cells with that color to bg color
export function removeColor(chart, index) {
  if (chart.palette.length <= 1 || index === 0) return
  chart.palette.splice(index, 1)
  for (const row of chart.cells) {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === index) row[c] = 0
      else if (row[c] > index) row[c] -= 1
    }
  }
}
