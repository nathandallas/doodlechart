export function createChart(cols, rows) {
  return {
    cols,
    rows,
    palette: ['#bc5953', '#c47fa0', '#7b75da', '#3984a3', '#7a9e5e'],
    cells: Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0)),
  }
}

export function setCell(chart, row, col, colorIndex) {
    if (row < 0 || row >= chart.rows || col < 0 || col >= chart.cols) {
        return false;
    }
    if (chart.cells[row][col] === colorIndex) {
        return false;
    }
    chart.cells[row][col] = colorIndex;
    return true;
}
