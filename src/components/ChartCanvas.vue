<script setup>
import { ref, computed } from 'vue'
import { stitchPoints, stitchViewSize, stitchAtPoint } from '../engine/geometry.js'
import { stitchDimensionsForGauge } from '../engine/gauge.js'

const props = defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, default: 'grid' },
  gauge: { type: [String, Object], default: 'worsted' },
})

const isPainting = ref(false)
const emit = defineEmits(['paint', 'stroke-start', 'stroke-end'])
const hoveredCell = ref(null)

// Get stitch dimensions from gauge
const dims = computed(() => stitchDimensionsForGauge(props.gauge))
const stitchGeom = computed(() => ({
  WIDTH: dims.value.W,
  THICKNESS: dims.value.T,
  DEPTH: dims.value.D,
}))

const cellSize = computed(() => ({ width: dims.value.W, height: dims.value.T }))

// Grid numbers
const colNum = (c) => props.chart.cols - c
const rowNum = (r) => props.chart.rows - r

const colIndex = computed(() => Array.from({ length: props.chart.cols }, (_, i) => i))
const rowIndex = computed(() => Array.from({ length: props.chart.rows }, (_, i) => i))

const viewSize = computed(() =>
  props.mode === 'chevron'
    ? stitchViewSize(props.chart.cols, props.chart.rows, stitchGeom.value)
    : {
        width: props.chart.cols * cellSize.value.width,
        height: props.chart.rows * cellSize.value.height,
      },
)

function getCellFromEvent(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  if (props.mode === 'chevron') {
    return stitchAtPoint(x, y, props.chart.cols, props.chart.rows, stitchGeom.value)
  }
  return {
    row: Math.floor(y / cellSize.value.height),
    col: Math.floor(x / cellSize.value.width),
  }
}

function handlePointerDown(e) {
  isPainting.value = true
  e.currentTarget.setPointerCapture(e.pointerId)
  emit('stroke-start')
  const cell = getCellFromEvent(e)
  if (cell) emit('paint', cell)
}

function handlePointerMove(e) {
  const cell = getCellFromEvent(e)
  hoveredCell.value = cell
  if (!isPainting.value) return
  if (cell) emit('paint', cell)
}

function handlePointerLeave() {
  hoveredCell.value = null
}

function handlePointerUp() {
  isPainting.value = false
  emit('stroke-end')
}
</script>

<template>
  <div class="chart-grid-wrapper">
    <div class="chart-labels chart-labels-top" :style="{ width: viewSize.width + 'px' }">
      <span
        v-for="c in colIndex"
        :key="c"
        class="chart-label"
        :class="{ bold: hoveredCell?.col === c }"
        :style="{ left: c * cellSize.width + cellSize.width / 2 + 'px' }"
        >{{ colNum(c) }}</span
      >
    </div>

    <div class="chart-labels chart-labels-left" :style="{ height: viewSize.height + 'px' }">
      <template v-for="r in rowIndex" :key="r">
        <span
          v-if="rowNum(r) % 2 === 0"
          class="chart-label"
          :class="{ bold: hoveredCell?.row === r }"
          :style="{ top: r * cellSize.height + cellSize.height / 2 + 'px' }"
          >{{ rowNum(r) }}</span
        >
      </template>
    </div>
    <svg
      ref="svgEl"
      :width="viewSize.width"
      :height="viewSize.height"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointerleave="handlePointerLeave"
    >
      <template v-if="mode === 'chevron'">
        <template v-for="(row, r) in chart.cells" :key="r">
          <polygon
            v-for="(colorIndex, c) in row"
            :key="c"
            :points="stitchPoints(c, r, stitchGeom)"
            :fill="chart.palette[colorIndex]"
            :stroke="chart.gridColor"
            :stroke-opacity="chart.gridOpacity"
          />
        </template>
      </template>
      <template v-else>
        <template v-for="(row, r) in chart.cells" :key="r">
          <rect
            v-for="(colorIndex, c) in row"
            :key="c"
            :x="c * cellSize.width"
            :y="r * cellSize.height"
            :width="cellSize.width"
            :height="cellSize.height"
            :fill="chart.palette[colorIndex]"
            :stroke="chart.gridColor"
            :stroke-opacity="chart.gridOpacity"
          />
        </template>
      </template>

      <polygon
        v-if="mode === 'chevron' && hoveredCell"
        :points="stitchPoints(hoveredCell.col, hoveredCell.row, stitchGeom)"
        fill="none"
        :stroke="chart.gridColor"
        stroke-width="2"
        pointer-events="none"
      />
      <rect
        v-if="mode !== 'chevron' && hoveredCell"
        :x="hoveredCell.col * cellSize.width"
        :y="hoveredCell.row * cellSize.height"
        :width="cellSize.width"
        :height="cellSize.height"
        fill="none"
        :stroke="chart.gridColor"
        stroke-width="2"
        pointer-events="none"
      />
    </svg>

    <div class="chart-labels chart-labels-right" :style="{ height: viewSize.height + 'px' }">
      <template v-for="r in rowIndex" :key="r">
        <span
          v-if="rowNum(r) % 2 === 1"
          class="chart-label"
          :class="{ bold: hoveredCell?.row === r }"
          :style="{ top: r * cellSize.height + cellSize.height / 2 + 'px' }"
          >{{ rowNum(r) }}</span
        >
      </template>
    </div>

    <div class="chart-labels chart-labels-bottom" :style="{ width: viewSize.width + 'px' }">
      <span
        v-for="c in colIndex"
        :key="c"
        class="chart-label"
        :class="{ bold: hoveredCell?.col === c }"
        :style="{ left: c * cellSize.width + cellSize.width / 2 + 'px' }"
        >{{ colNum(c) }}</span
      >
    </div>
  </div>
</template>

<style scoped>
.chart-grid-wrapper {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    '.    top    .'
    'left svg    right'
    '.    bottom .';
  width: fit-content;
}

.chart-grid-wrapper > svg {
  grid-area: svg;
}

.chart-labels {
  position: relative;
}
.chart-labels-top {
  grid-area: top;
  height: 1.4em;
}
.chart-labels-bottom {
  grid-area: bottom;
  height: 1.4em;
}
.chart-labels-left {
  grid-area: left;
  width: 1.6em;
}
.chart-labels-right {
  grid-area: right;
  width: 1.6em;
}

.chart-label {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 0.85rem;
  color: var(--text-primary);
  white-space: nowrap;
}
.chart-labels-top .chart-label,
.chart-labels-bottom .chart-label {
  top: 50%;
}
.chart-labels-left .chart-label,
.chart-labels-right .chart-label {
  left: 50%;
}

.chart-label.bold {
  font-weight: 900;
  color: var(--text-header);
}
</style>
