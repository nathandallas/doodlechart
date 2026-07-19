<script setup>
import { ref, computed } from 'vue'
import { stitchPoints, stitchViewSize, stitchAtPoint } from '../engine/geometry.js'

const props = defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, default: 'grid' },
})

const CELL_SIZE = 24
const isPainting = ref(false)
const emit = defineEmits(['paint', 'stroke-start', 'stroke-end'])

const viewSize = computed(() =>
  props.mode === 'chevron'
    ? stitchViewSize(props.chart.cols, props.chart.rows)
    : { width: props.chart.cols * CELL_SIZE, height: props.chart.rows * CELL_SIZE },
)

function getCellFromEvent(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  if (props.mode === 'chevron') {
    return stitchAtPoint(x, y, props.chart.cols, props.chart.rows)
  }
  return { row: Math.floor(y / CELL_SIZE), col: Math.floor(x / CELL_SIZE) }
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
          :points="stitchPoints(c, r)"
          :fill="chart.palette[colorIndex]"
          stroke="rgba(0,0,0,0.15)"
        />
      </template>
    </template>
    <template v-else>
      <template v-for="(row, r) in chart.cells" :key="r">
        <rect
          v-for="(colorIndex, c) in row"
          :key="c"
          :x="c * CELL_SIZE"
          :y="r * CELL_SIZE"
          :width="CELL_SIZE"
          :height="CELL_SIZE"
          :fill="chart.palette[colorIndex]"
          stroke="rgba(0,0,0,0.15)"
        />
      </template>
    </template>
  </svg>
</template>
