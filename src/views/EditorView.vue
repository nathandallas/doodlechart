<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { createChart, setCell, removeColor, resizeChart, clearChart } from '../engine/chart.js'
import { YARN_PRESETS } from '../engine/gauge.js'
import ChartCanvas from '../components/ChartCanvas.vue'
import PalettePanel from '@/components/PalettePanel.vue'
import NavBar from '@/components/NavBar.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'

const chart = reactive(createChart(20, 22))
const currentColor = ref(2)
const canvasMode = ref('grid')
const gauge = ref({ ...YARN_PRESETS.aran, stitchSpan: 4, rowSpan: 4 })
const tool = ref('paint')
const history = ref([])
const redoStack = ref([])

function onPaint({ row, col }) {
  const colorIndex = tool.value === 'erase' ? 0 : currentColor.value
  setCell(chart, row, col, colorIndex)
}

// --- gauge ---
function updateGauge(g) {
  gauge.value = g
}

// --- grid ---
function onResize({ cols, rows }) {
  resizeChart(chart, cols, rows)
}

function updateGridColor(color) {
  chart.gridColor = color
}

function updateGridOpacity(opacity) {
  chart.gridOpacity = opacity
}

// --- palette ---
function updateColor({ index, color }) {
  chart.palette[index] = color
}

function addColor() {
  chart.palette.push('#d85a30')
  currentColor.value = chart.palette.length - 1
}

// When color is removed or updated cells are replaced with bg color
function onRemoveColor(index) {
  removeColor(chart, index)
  if (currentColor.value >= chart.palette.length) {
    currentColor.value = chart.palette.length - 1
  }
}

// --- undo / redo / clear ---
function snapshot() {
  return chart.cells.map((row) => [...row])
}

function pushHistory() {
  history.value.push(snapshot())
  redoStack.value = []
}

function undo() {
  if (history.value.length === 0) return
  redoStack.value.push(snapshot())
  chart.cells = history.value.pop()
}

function redo() {
  if (redoStack.value.length === 0) return
  history.value.push(snapshot())
  chart.cells = redoStack.value.pop()
}

function onClear() {
  pushHistory()
  clearChart(chart)
}

function onKeydown(e) {
  const mod = e.ctrlKey || e.metaKey
  if (!mod) return
  const key = e.key.toLowerCase()

  if (key === 'z' && !e.shiftKey) {
    e.preventDefault()
    undo()
  } else if ((key === 'y' && !e.metaKey) || (key === 'z' && e.shiftKey)) {
    e.preventDefault()
    redo()
  }
}


onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <NavBar />
  <div class="editor">
    <SettingsPanel
      :chart="chart"
      :mode="canvasMode"
      :tool="tool"
      :can-undo="history.length > 0"
      :can-redo="redoStack.length > 0"
      @update-mode="canvasMode = $event"
      @update-tool="tool = $event"
      @undo="undo"
      @redo="redo"
      @clear="onClear"
      @resize="onResize"
      @update-grid-color="updateGridColor"
      @update-grid-opacity="updateGridOpacity"
      @update-gauge="updateGauge"
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
      <ChartCanvas
        :chart="chart"
        :mode="canvasMode"
        :gauge="gauge"
        @paint="onPaint"
        @stroke-start="pushHistory"
      />
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
