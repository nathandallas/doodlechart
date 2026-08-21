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

// Get stitch dimensions from gauge
const dims = computed(() => stitchDimensionsForGauge(props.gauge))
const stitchGeom = computed(() => ({
  WIDTH: dims.value.W,
  THICKNESS: dims.value.T,
  DEPTH: dims.value.D,
}))

const cellSize = computed(() => ({ width: dims.value.W, height: dims.value.T }))

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
  const cell = getCellFromEvent(e)
  if (cell) emit('paint', cell)
}

function handlePointerMove(e) {
  if (!isPainting.value) return
  const cell = getCellFromEvent(e)
  if (cell) emit('paint', cell)
}

function handlePointerUp() {
  isPainting.value = false
}
</script>

<template>
  <svg
    ref="svgEl"
    :width="viewSize.width"
    :height="viewSize.height"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
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
  </svg>
</template>
