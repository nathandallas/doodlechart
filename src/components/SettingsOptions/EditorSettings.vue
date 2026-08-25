<script setup>
import { computed } from 'vue'
import { Paintbrush, Eraser, Undo2, Redo2, Trash2, Plus, Minus } from '@lucide/vue'

const props = defineProps({
  tool: { type: String, required: true },
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false },
  zoom: { type: Number, default: 1 },
})

const emit = defineEmits([
  'update-tool',
  'undo',
  'redo',
  'clear',
  'zoom-in',
  'zoom-out',
  'update-zoom',
])

const zoomDisplay = computed(() => Math.round(props.zoom * 100) + '%')

function onZoomInputChange(e) {
  const parsed = parseFloat(e.target.value)
  if (Number.isNaN(parsed)) {
    e.target.value = zoomDisplay.value
    return
  }
  emit('update-zoom', parsed / 100)
}
</script>

<template>
  <div class="options">
    <label>Tool</label>
    <button
      type="button"
      class="icon-btn"
      :class="{ active: tool === 'paint' }"
      aria-label="Paintbrush"
      @click="emit('update-tool', 'paint')"
    >
      <Paintbrush color="var(--text-inverse)" :stroke-width="1.8" />
    </button>
    <button
      type="button"
      class="icon-btn"
      :class="{ active: tool === 'erase' }"
      aria-label="Erase"
      @click="emit('update-tool', 'erase')"
    >
      <Eraser color="var(--text-inverse)" :stroke-width="1.8" />
    </button>

    <div class="divider" aria-hidden="true"></div>

    <label>History</label>
    <button
      type="button"
      class="icon-btn history-btn"
      :disabled="!canUndo"
      aria-label="Undo"
      @click="emit('undo')"
    >
      <Undo2 color="var(--text-inverse)" :stroke-width="1.8" />
    </button>
    <button
      type="button"
      class="icon-btn history-btn"
      :disabled="!canRedo"
      aria-label="Redo"
      @click="emit('redo')"
    >
      <Redo2 color="var(--text-inverse)" :stroke-width="1.8" />
    </button>
    <button
      type="button"
      class="icon-btn history-btn"
      aria-label="Clear canvas"
      @click="emit('clear')"
    >
      <Trash2 color="var(--text-inverse)" :stroke-width="1.8" />
    </button>

    <div class="divider" aria-hidden="true"></div>

    <label>Zoom</label>
    <div class="zoom-group">
      <button
        type="button"
        class="icon-btn zoom-btn"
        aria-label="Zoom out"
        @click="emit('zoom-out')"
      >
        <Minus color="var(--text-primary)" :stroke-width="1.8" />
      </button>
      <input
        type="text"
        class="zoom-input"
        :value="zoomDisplay"
        aria-label="Zoom level"
        @change="onZoomInputChange"
      />
      <button
        type="button"
        class="icon-btn zoom-btn"
        aria-label="Zoom in"
        @click="emit('zoom-in')"
      >
        <Plus color="var(--text-primary)" :stroke-width="1.8" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.icon-btn.history-btn:not(:disabled) {
  opacity: 1;
}

.zoom-group {
  display: flex;
  align-items: center;
}

.zoom-btn {
  background-color: var(--grid);
  opacity: 1;
  margin: 0;
  padding: 0;
}

.zoom-input {
  width: 3rem;
  height: 32px;
  border: none;
  text-align: center;
  font-size: 1rem;
  padding: 0;
  cursor: text;
  user-select: text;
  margin: 0;
}

</style>
