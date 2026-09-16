<script setup>
import { reactive, ref } from 'vue'
import {
  createChart,
  setCell,
  floodFill,
  removeColor,
  resizeChart,
  clearChart,
} from '../engine/chart.js'

import ChartCanvas from '../components/ChartCanvas.vue'
import PalettePanel from '@/components/PalettePanel.vue'
import NavBar from '@/components/NavBar.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import KeyboardShortcutsOverlay from '@/components/KeyboardShortcutsOverlay.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useChartSetupStore } from '@/stores/chartSetup'
const setup = useChartSetupStore()
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
  <NavBar />
  <div class="editor">
    <SettingsPanel
      :chart="chart"
      :mode="canvasMode"
      :tool="tool"
      :can-undo="history.length > 0"
      :can-redo="redoStack.length > 0"
      :zoom="zoom"
      :gauge="gauge"
      @update-mode="canvasMode = $event"
      @update-tool="tool = $event"
      @undo="undo"
      @redo="redo"
      @clear="onClear"
      @resize="onResize"
      @update-grid-color="updateGridColor"
      @update-grid-opacity="updateGridOpacity"
      @update-gauge="updateGauge"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @update-zoom="setZoom"
      @toggle-shortcuts="showShortcuts = !showShortcuts"
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
      <div class="canvas-scroll">
        <ChartCanvas
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
    </div>
    <KeyboardShortcutsOverlay :open="showShortcuts" @close="showShortcuts = false" />
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

.canvas-scroll {
  min-width: 0;
  padding: 1rem 1.5rem 1.5rem 0;
}
</style>
