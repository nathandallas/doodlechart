<script setup>
import { reactive, ref } from 'vue'
import { createChart, setCell, floodFill, removeColor, clearChart } from '../engine/chart.js'

import ChartCanvas from '@/components/ChartCanvas.vue'
import EditorTopBar from '@/components/EditorTopBar.vue'
import EditorToolbar from '@/components/EditorToolbar.vue'
import PaletteBar from '@/components/PaletteBar.vue'
import KeyboardShortcutsOverlay from '@/components/KeyboardShortcutsOverlay.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useChartSetupStore } from '@/stores/chartSetup'
const setup = useChartSetupStore()

// Consumed by the menu and settings overlays
const showMenu = ref(false)
const showSettings = ref(false)

const chart = reactive(createChart(setup.cols, setup.rows))
chart.palette = [...setup.palette]
chart.gridColor = setup.gridColor
chart.gridOpacity = setup.gridOpacity
const gauge = ref({ ...setup.gauge })

const currentColor = ref(2)
const canvasMode = ref('grid')
const tool = ref('paint')
const history = ref([])
const redoStack = ref([])

// --- zoom ---
const ZOOM_MIN = 0.25
const ZOOM_MAX = 3
const ZOOM_STEP = 0.1
const zoom = ref(1)

function setZoom(value) {
  const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value))
  zoom.value = Math.round(clamped * 100) / 100
}

function zoomIn() {
  setZoom(zoom.value + ZOOM_STEP)
}

function zoomOut() {
  setZoom(zoom.value - ZOOM_STEP)
}

function resetZoom() {
  setZoom(1)
}

function onWheelZoom(direction) {
  setZoom(zoom.value + direction * ZOOM_STEP)
}

let hasFilledThisStroke = false

function onPaint({ row, col }) {
  if (tool.value === 'fill') {
    if (hasFilledThisStroke) return
    hasFilledThisStroke = true
    floodFill(chart, row, col, currentColor.value)
    return
  }
  const colorIndex = tool.value === 'erase' ? 0 : currentColor.value
  setCell(chart, row, col, colorIndex)
}

// --- palette ---
function updateColor({ index, color }) {
  chart.palette[index] = color
}

// Picking a color while erasing means the user wants to paint again
function selectColor(index) {
  currentColor.value = index
  if (tool.value === 'erase') tool.value = 'paint'
}

function addColor() {
  chart.palette.push('#d85a30')
  selectColor(chart.palette.length - 1)
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
  hasFilledThisStroke = false
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

// --- keyboard shortcuts ---
const isSpacePanning = ref(false)
const showShortcuts = ref(false)

useKeyboardShortcuts({
  setTool: (t) => (tool.value = t),
  undo,
  redo,
  clear: onClear,
  zoomIn,
  zoomOut,
  resetZoom,
  isPanning: isSpacePanning,
  toggleShortcuts: () => (showShortcuts.value = !showShortcuts.value),
})
</script>

<template>
  <div class="editor-layout">
    <EditorTopBar
      @open-menu="showMenu = !showMenu"
      @open-settings="showSettings = !showSettings"
      @toggle-shortcuts="showShortcuts = !showShortcuts"
    />
    <EditorToolbar
      :tool="tool"
      :can-undo="history.length > 0"
      :can-redo="redoStack.length > 0"
      :zoom="zoom"
      @update-tool="tool = $event"
      @undo="undo"
      @redo="redo"
      @clear="onClear"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @reset-zoom="resetZoom"
    />
    <div class="editor-canvas">
      <ChartCanvas
        fill
        :chart="chart"
        :mode="canvasMode"
        :gauge="gauge"
        :zoom="zoom"
        :pan-mode="isSpacePanning"
        @paint="onPaint"
        @stroke-start="pushHistory"
        @zoom="onWheelZoom"
      />
    </div>
    <PaletteBar
      :palette="chart.palette"
      :selected="currentColor"
      @select="selectColor"
      @update-color="updateColor"
      @add-color="addColor"
      @remove-color="onRemoveColor"
    />
    <KeyboardShortcutsOverlay :open="showShortcuts" @close="showShortcuts = false" />
  </div>
</template>

<style scoped>
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.editor-canvas {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 0.5rem 0.25rem;
}

@media (min-width: 641px) {
  .editor-canvas {
    padding: 1rem 1.5rem;
  }
}

@media (min-width: 1025px) {
  .editor-canvas {
    padding: 1.5rem 2.5rem;
  }
}
</style>
