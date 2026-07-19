<script setup>
import { reactive, ref } from 'vue'
import { createChart, setCell, removeColor } from '../engine/chart.js'
import ChartCanvas from '../components/ChartCanvas.vue'
import PalettePanel from '@/components/PalettePanel.vue'
import NavBar from '@/components/NavBar.vue'

const chart = reactive(createChart(10, 8))
const currentColor = ref(2)
const canvasMode = ref('chevron')

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
  <NavBar />
  <div class="editor">
    <h2>Editor</h2>
    <PalettePanel
      class="palette-row"
      :palette="chart.palette"
      :selected="currentColor"
      @select="currentColor = $event"
      @update-color="updateColor"
      @add-color="addColor"
      @remove-color="onRemoveColor"
    />
    <div class="canvas-toolbar">
      <button
        type="button"
        :class="{ active: canvasMode === 'grid' }"
        @click="canvasMode = 'grid'"
      >
        Grid
      </button>
      <button
        type="button"
        :class="{ active: canvasMode === 'chevron' }"
        @click="canvasMode = 'chevron'"
      >
        Chevron
      </button>
    </div>
    <ChartCanvas :chart="chart" :mode="canvasMode" @paint="onPaint" />
  </div>
</template>

<style scoped>
.editor {
  max-width: 900px;
  margin: 0 auto;
  padding-left: 1rem;
}
.palette-row {
  padding: 1rem 0;
}
.canvas-toolbar {
  display: flex;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}
.canvas-toolbar button {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--text-primary);
  background: none;
  cursor: pointer;
}
.canvas-toolbar button.active {
  background: var(--accent);
}
</style>
