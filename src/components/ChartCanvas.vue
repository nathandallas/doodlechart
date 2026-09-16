<script setup>
import { ref, computed, watch, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { traceStitchPath, stitchViewSize, stitchAtPoint } from '../engine/geometry.js'
import { stitchDimensionsForGauge } from '../engine/gauge.js'

const props = defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, default: 'grid' },
  gauge: { type: [String, Object], default: 'worsted' },
  zoom: { type: Number, default: 1 },
  panMode: { type: Boolean, default: false },
})

const emit = defineEmits(['paint', 'stroke-start', 'stroke-end', 'zoom'])

const isPainting = ref(false)
const isPanDragging = ref(false)
const hoveredCell = ref(null)
const viewportEl = ref(null)
const canvasEl = ref(null)
const scrollX = ref(0)
const scrollY = ref(0)
const viewW = ref(0)
const viewH = ref(0)

const dims = computed(() => {
  const options = { baseHeight: 18 * props.zoom }
  return props.mode === 'square-grid'
    ? stitchDimensionsForGauge({ square: true }, options)
    : stitchDimensionsForGauge(props.gauge, options)
})
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

// --- virtualization ---
const visibleRange = computed(() => {
  const { width: cw, height: ch } = cellSize.value
  if (!cw || !ch) return { c0: 0, c1: -1, r0: 0, r1: -1 }
  return {
    c0: Math.max(0, Math.floor(scrollX.value / cw) - 1),
    c1: Math.min(props.chart.cols - 1, Math.ceil((scrollX.value + viewW.value) / cw)),
    r0: Math.max(0, Math.floor(scrollY.value / ch) - 1),
    r1: Math.min(props.chart.rows - 1, Math.ceil((scrollY.value + viewH.value) / ch)),
  }
})

const visibleCols = computed(() => {
  const { c0, c1 } = visibleRange.value
  const out = []
  for (let c = c0; c <= c1; c++) out.push(c)
  return out
})

const visibleRows = computed(() => {
  const { r0, r1 } = visibleRange.value
  const out = []
  for (let r = r0; r <= r1; r++) out.push(r)
  return out
})

// Grid numbers
const colNum = (c) => props.chart.cols - c
const rowNum = (r) => props.chart.rows - r

// --- drawing ---
function draw() {
  const canvas = canvasEl.value
  const vw = viewW.value
  const vh = viewH.value
  if (!canvas || vw <= 0 || vh <= 0) return

  const dpr = window.devicePixelRatio || 1
  const bw = Math.round(vw * dpr)
  const bh = Math.round(vh * dpr)
  if (canvas.width !== bw) canvas.width = bw
  if (canvas.height !== bh) canvas.height = bh

  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, vw, vh)

  const chart = props.chart
  const cells = chart.cells
  const palette = chart.palette
  if (!cells || !cells.length) return

  const { width: cw, height: ch } = cellSize.value
  const { c0, c1, r0, r1 } = visibleRange.value
  const geom = stitchGeom.value
  const chevron = props.mode === 'chevron'
  const showLines = chart.gridOpacity > 0 && cw >= 4 && ch >= 4

  ctx.save()
  ctx.translate(-scrollX.value, -scrollY.value)

  let lastFill = null
  if (chevron) {
    for (let r = r0; r <= r1; r++) {
      const row = cells[r]
      if (!row) continue
      for (let c = c0; c <= c1; c++) {
        const fill = palette[row[c]] ?? palette[0]
        if (fill !== lastFill) {
          ctx.fillStyle = fill
          lastFill = fill
        }
        ctx.beginPath()
        traceStitchPath(ctx, c, r, geom)
        ctx.fill()
      }
    }
  } else {
    for (let r = r0; r <= r1; r++) {
      const row = cells[r]
      if (!row) continue
      const y = r * ch
      for (let c = c0; c <= c1; c++) {
        const fill = palette[row[c]] ?? palette[0]
        if (fill !== lastFill) {
          ctx.fillStyle = fill
          lastFill = fill
        }
        ctx.fillRect(c * cw, y, cw, ch)
      }
    }
  }

  if (showLines) {
    ctx.beginPath()
    if (chevron) {
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) traceStitchPath(ctx, c, r, geom)
      }
    } else {
      for (let c = c0; c <= c1 + 1; c++) {
        const x = c * cw
        ctx.moveTo(x, r0 * ch)
        ctx.lineTo(x, (r1 + 1) * ch)
      }
      for (let r = r0; r <= r1 + 1; r++) {
        const y = r * ch
        ctx.moveTo(c0 * cw, y)
        ctx.lineTo((c1 + 1) * cw, y)
      }
    }
    ctx.lineWidth = 1
    ctx.strokeStyle = chart.gridColor
    ctx.globalAlpha = chart.gridOpacity
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  const hovered = hoveredCell.value
  if (hovered) {
    ctx.lineWidth = 2
    ctx.strokeStyle = chart.gridColor
    if (chevron) {
      ctx.beginPath()
      traceStitchPath(ctx, hovered.col, hovered.row, geom)
      ctx.stroke()
    } else {
      ctx.strokeRect(hovered.col * cw, hovered.row * ch, cw, ch)
    }
  }

  ctx.restore()
}

watchEffect(draw, { flush: 'post' })

// --- pointer handling ---
const activePointers = new Map()
let drawPointerId = null
let lastCell = null
let panState = null

function cellAt(clientX, clientY, rect) {
  const x = clientX - rect.left + scrollX.value
  const y = clientY - rect.top + scrollY.value
  if (props.mode === 'chevron') {
    return stitchAtPoint(x, y, props.chart.cols, props.chart.rows, stitchGeom.value)
  }
  const col = Math.floor(x / cellSize.value.width)
  const row = Math.floor(y / cellSize.value.height)
  if (row < 0 || row >= props.chart.rows || col < 0 || col >= props.chart.cols) return null
  return { row, col }
}

function paintTo(cell) {
  if (!lastCell) {
    emit('paint', cell)
    lastCell = cell
    return
  }
  let x = lastCell.col
  let y = lastCell.row
  const dx = Math.abs(cell.col - x)
  const dy = -Math.abs(cell.row - y)
  const sx = x < cell.col ? 1 : -1
  const sy = y < cell.row ? 1 : -1
  let err = dx + dy
  for (;;) {
    emit('paint', { row: y, col: x })
    if (x === cell.col && y === cell.row) break
    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      x += sx
    }
    if (e2 <= dx) {
      err += dx
      y += sy
    }
  }
  lastCell = cell
}

function endStroke() {
  if (!isPainting.value) return
  isPainting.value = false
  if (drawPointerId !== null && canvasEl.value?.hasPointerCapture(drawPointerId)) {
    canvasEl.value.releasePointerCapture(drawPointerId)
  }
  drawPointerId = null
  lastCell = null
  emit('stroke-end')
}

function handlePointerDown(e) {
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

  // two fingers pan instead of draw
  if (e.pointerType === 'touch' && activePointers.size === 2) {
    endStroke()
    const [a, b] = [...activePointers.values()]
    panState = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    return
  }

  //  space + drag (mouse/pen) pans instead of painting
  if (props.panMode && e.pointerType !== 'touch') {
    if (panState) return
    panState = { x: e.clientX, y: e.clientY, pointerId: e.pointerId }
    isPanDragging.value = true
    canvasEl.value.setPointerCapture(e.pointerId)
    return
  }

  if (panState || drawPointerId !== null) return

  drawPointerId = e.pointerId
  isPainting.value = true
  canvasEl.value.setPointerCapture(e.pointerId)
  emit('stroke-start')
  const cell = cellAt(e.clientX, e.clientY, canvasEl.value.getBoundingClientRect())
  if (cell) paintTo(cell)
}

function handlePointerMove(e) {
  if (activePointers.has(e.pointerId)) {
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }

  if (panState) {
    let cx, cy
    if (panState.pointerId !== undefined) {
      // mouse pan
      if (e.pointerId !== panState.pointerId) return
      cx = e.clientX
      cy = e.clientY
    } else {
      // touch pan
      const pts = [...activePointers.values()]
      if (pts.length < 2) return
      cx = (pts[0].x + pts[1].x) / 2
      cy = (pts[0].y + pts[1].y) / 2
    }
    viewportEl.value?.scrollBy(panState.x - cx, panState.y - cy)
    panState.x = cx
    panState.y = cy
    return
  }

  const rect = canvasEl.value.getBoundingClientRect()
  if (e.pointerType !== 'touch') {
    hoveredCell.value = cellAt(e.clientX, e.clientY, rect)
  }

  if (!isPainting.value || e.pointerId !== drawPointerId) return

  
  const points = e.getCoalescedEvents?.() ?? []
  for (const p of points.length ? points : [e]) {
    const cell = cellAt(p.clientX, p.clientY, rect)
    if (cell) paintTo(cell)
  }
}

function handlePointerLeave() {
  hoveredCell.value = null
}

function releasePanPointer(pointerId) {
  if (canvasEl.value?.hasPointerCapture(pointerId)) {
    canvasEl.value.releasePointerCapture(pointerId)
  }
  panState = null
  isPanDragging.value = false
}

function handlePointerUp(e) {
  activePointers.delete(e.pointerId)
  if (panState) {
    if (panState.pointerId === e.pointerId) releasePanPointer(e.pointerId)
    else if (activePointers.size < 2) panState = null
  }
  if (e.pointerId === drawPointerId) endStroke()
  if (e.pointerType === 'touch') hoveredCell.value = null
}

watch(
  () => props.panMode,
  (active) => {
    if (!active && panState?.pointerId !== undefined) releasePanPointer(panState.pointerId)
  },
)

function handleScroll(e) {
  scrollX.value = e.target.scrollLeft
  scrollY.value = e.target.scrollTop
}

function handleWheel(e) {
  if (!(e.ctrlKey || e.metaKey)) return
  e.preventDefault()
  emit('zoom', e.deltaY < 0 ? 1 : -1)
}

function measure() {
  const el = viewportEl.value
  if (!el) return
  viewW.value = el.clientWidth
  viewH.value = el.clientHeight
}

let resizeObserver
onMounted(() => {
  measure()
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(viewportEl.value)
  viewportEl.value?.addEventListener('wheel', handleWheel, { passive: false })
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  viewportEl.value?.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <div class="chart-grid-wrapper" :style="{ '--zoom': zoom }">
    <div class="chart-labels chart-labels-top" :style="{ width: viewW + 'px' }">
      <div class="label-track" :style="{ transform: `translateX(${-scrollX}px)` }">
        <span
          v-for="c in visibleCols"
          :key="c"
          class="chart-label"
          :class="{ bold: hoveredCell?.col === c }"
          :style="{ left: c * cellSize.width + cellSize.width / 2 + 'px' }"
          >{{ colNum(c) }}</span
        >
      </div>
    </div>

    <div class="chart-labels chart-labels-left" :style="{ height: viewH + 'px' }">
      <div class="label-track" :style="{ transform: `translateY(${-scrollY}px)` }">
        <template v-for="r in visibleRows" :key="r">
          <span
            v-if="rowNum(r) % 2 === 0"
            class="chart-label"
            :class="{ bold: hoveredCell?.row === r }"
            :style="{ top: r * cellSize.height + cellSize.height / 2 + 'px' }"
            >{{ rowNum(r) }}</span
          >
        </template>
      </div>
    </div>

    <div
      ref="viewportEl"
      class="chart-viewport"
      :style="{ width: viewSize.width + 'px', height: viewSize.height + 'px' }"
      @scroll="handleScroll"
    >
      <div
        class="chart-spacer"
        :style="{ width: viewSize.width + 'px', height: viewSize.height + 'px' }"
      >
        <canvas
          ref="canvasEl"
          class="chart-canvas"
          :class="{ 'pan-grab': panMode && !isPanDragging, 'pan-grabbing': isPanDragging }"
          :style="{ width: viewW + 'px', height: viewH + 'px' }"
          @pointerdown="handlePointerDown"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerUp"
          @pointercancel="handlePointerUp"
          @pointerleave="handlePointerLeave"
        ></canvas>
      </div>
    </div>

    <div class="chart-labels chart-labels-right" :style="{ height: viewH + 'px' }">
      <div class="label-track" :style="{ transform: `translateY(${-scrollY}px)` }">
        <template v-for="r in visibleRows" :key="r">
          <span
            v-if="rowNum(r) % 2 === 1"
            class="chart-label"
            :class="{ bold: hoveredCell?.row === r }"
            :style="{ top: r * cellSize.height + cellSize.height / 2 + 'px' }"
            >{{ rowNum(r) }}</span
          >
        </template>
      </div>
    </div>

    <div class="chart-labels chart-labels-bottom" :style="{ width: viewW + 'px' }">
      <div class="label-track" :style="{ transform: `translateX(${-scrollX}px)` }">
        <span
          v-for="c in visibleCols"
          :key="c"
          class="chart-label"
          :class="{ bold: hoveredCell?.col === c }"
          :style="{ left: c * cellSize.width + cellSize.width / 2 + 'px' }"
          >{{ colNum(c) }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-grid-wrapper {
  display: grid;
  grid-template-columns: auto minmax(0, auto) auto;
  grid-template-rows: auto minmax(0, auto) auto;
  grid-template-areas:
    '.    top    .'
    'left svg    right'
    '.    bottom .';
  width: fit-content;
  max-width: 100%;
}

.chart-viewport {
  grid-area: svg;
  overflow: auto;
  max-width: 100%;
  max-height: 70vh;
}

.chart-canvas {
  position: sticky;
  top: 0;
  left: 0;
  display: block;
  touch-action: none;
}

.chart-canvas.pan-grab {
  cursor: grab;
}

.chart-canvas.pan-grabbing {
  cursor: grabbing;
}

.chart-labels {
  position: relative;
  overflow: hidden;
}

.label-track {
  position: absolute;
  inset: 0;
}

.chart-labels-top {
  grid-area: top;
  height: calc(1.4em * var(--zoom, 1));
}
.chart-labels-bottom {
  grid-area: bottom;
  height: calc(1.4em * var(--zoom, 1));
}
.chart-labels-left {
  grid-area: left;
  width: calc(1.6em * var(--zoom, 1));
}
.chart-labels-right {
  grid-area: right;
  width: calc(1.6em * var(--zoom, 1));
}

.chart-label {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: calc(0.85rem * var(--zoom, 1));
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
