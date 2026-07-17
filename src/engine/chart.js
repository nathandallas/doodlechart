export function createChart(cols, rows) {
  return {
    cols,
    rows,
    palette: ['#F7F4EE', '#bc5953', '#c47fa0', '#7b75da', '#3984a3', '#7a9e5e'],
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