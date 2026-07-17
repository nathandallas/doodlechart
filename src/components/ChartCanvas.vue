<script setup>
import { ref } from 'vue'

defineProps({
  chart: { type: Object, required: true },
})

const CELL_SIZE = 24
const isPainting = ref(false)
const emit = defineEmits(['paint', 'stroke-start', 'stroke-end'])

function getCellFromEvent(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const col = Math.floor(x / CELL_SIZE)
  const row = Math.floor(y / CELL_SIZE)
  return { row, col }
}

function handlePointerDown(e) {
  isPainting.value = true
  e.currentTarget.setPointerCapture(e.pointerId)
  const cell = getCellFromEvent(e)
  emit('paint', cell)
}

function handlePointerMove(e) {
  if (!isPainting.value) return
  const cell = getCellFromEvent(e)
  emit('paint', cell)
}

function handlePointerUp() {
  isPainting.value = false
}
</script>

<template>
  <svg
    :width="chart.cols * CELL_SIZE"
    :height="chart.rows * CELL_SIZE"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
  >
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
  </svg>
</template>
