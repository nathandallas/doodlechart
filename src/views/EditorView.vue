<script setup>
import { reactive, ref } from 'vue'
import { createChart, setCell, removeColor } from '../engine/chart.js'
import ChartCanvas from '../components/ChartCanvas.vue'
import PalettePanel from '@/components/PalettePanel.vue'

const chart = reactive(createChart(10, 8))
const currentColor = ref(2)

function onPaint({ row, col }) {
  setCell(chart, row, col, currentColor.value)
}

// --- palette ---
function updateColor({ index, color }) {
  chart.palette[index] = color
}

function addColor() {
  chart.palette.push('#d85a30')
  currentColor.value = chart.palette.length - 1
}

// When color is removed or updated they are replaced with either bg or new color
function onRemoveColor(index) {
  removeColor(chart, index)
  if (currentColor.value >= chart.palette.length) {
    currentColor.value = chart.palette.length - 1
  }
}
</script>

<template>
  <h1>Editor</h1>
  <PalettePanel
    class="palette-row"
    :palette="chart.palette"
    :selected="currentColor"
    @select="currentColor = $event"
    @update-color="updateColor"
    @add-color="addColor"
    @remove-color="onRemoveColor"
  />
  <ChartCanvas :chart="chart" @paint="onPaint" />
</template>
