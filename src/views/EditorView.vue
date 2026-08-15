<script setup>
import { reactive, ref } from 'vue'
import { createChart, setCell, removeColor, resizeChart } from '../engine/chart.js'
import ChartCanvas from '../components/ChartCanvas.vue'
import PalettePanel from '@/components/PalettePanel.vue'
import NavBar from '@/components/NavBar.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'

const chart = reactive(createChart(10, 8))
const currentColor = ref(2)
const canvasMode = ref('grid')

function onPaint({ row, col }) {
  setCell(chart, row, col, currentColor.value)
}

// --- grid ---
function onResize({ cols, rows }) {
  resizeChart(chart, cols, rows)
}

function updateGridColor(color) {
  chart.gridColor = color
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
  <NavBar />
  <div class="editor">
    <h2>Editor</h2>
    <SettingsPanel
      :chart="chart"
      :mode="canvasMode"
      @update-mode="canvasMode = $event"
      @resize="onResize"
      @update-grid-color="updateGridColor"
    />
    <div class="canvas-row">
      <PalettePanel
        class="palette-sidebar"
        vertical
        :palette="chart.palette"
        :selected="currentColor"
        @select="currentColor = $event"
        @update-color="updateColor"
        @add-color="addColor"
        @remove-color="onRemoveColor"
      />
      <ChartCanvas :chart="chart" :mode="canvasMode" @paint="onPaint" />
    </div>
  </div>
</template>

<style scoped>
.editor {
  max-width: 1100px;
  margin: 0 auto;
  padding-left: 1rem;
}

.canvas-row {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.palette-sidebar {
  flex-shrink: 0;
  padding: 0;
}
</style>
