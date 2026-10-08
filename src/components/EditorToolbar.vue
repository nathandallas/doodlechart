<script setup>
import { computed } from 'vue'
import { Paintbrush, PaintBucket, Eraser, Undo2, Redo2, Trash2, Plus, Minus } from '@lucide/vue'

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
  'reset-zoom',
])

const tools = [
  { id: 'paint', label: 'Paintbrush', icon: Paintbrush },
  { id: 'erase', label: 'Eraser', icon: Eraser },
  { id: 'fill', label: 'Fill', icon: PaintBucket },
]

const zoomDisplay = computed(() => Math.round(props.zoom * 100) + '%')

function onClear() {
  if (window.confirm('Clear the whole chart? You can undo this.')) emit('clear')
}
</script>

<template>
  <div class="toolbar" role="toolbar" aria-label="Editor tools">
    <div class="group">
      <button
        v-for="t in tools"
        :key="t.id"
        type="button"
        class="tool-btn"
        :class="{ 'btn-active': tool === t.id }"
        :title="t.label"
        :aria-label="t.label"
        :aria-pressed="tool === t.id"
        @click="emit('update-tool', t.id)"
      >
        <component :is="t.icon" :size="20" :stroke-width="1.8" />
      </button>
    </div>

    <div class="divider" aria-hidden="true"></div>

    <div class="group">
      <button
        type="button"
        class="tool-btn"
        title="Undo"
        aria-label="Undo"
        :disabled="!canUndo"
        @click="emit('undo')"
      >
        <Undo2 :size="20" :stroke-width="1.8" />
      </button>
      <button
        type="button"
        class="tool-btn"
        title="Redo"
        aria-label="Redo"
        :disabled="!canRedo"
        @click="emit('redo')"
      >
        <Redo2 :size="20" :stroke-width="1.8" />
      </button>
      <button
        type="button"
        class="tool-btn"
        title="Clear canvas"
        aria-label="Clear canvas"
        @click="onClear"
      >
        <Trash2 :size="20" :stroke-width="1.8" />
      </button>
    </div>

    <div class="divider" aria-hidden="true"></div>

    <div class="group zoom-group">
      <button
        type="button"
        class="tool-btn"
        title="Zoom out"
        aria-label="Zoom out"
        @click="emit('zoom-out')"
      >
        <Minus :size="18" :stroke-width="1.8" />
      </button>
      <button
        type="button"
        class="zoom-value"
        title="Reset zoom to 100%"
        :aria-label="'Zoom ' + zoomDisplay + ', reset to 100%'"
        @click="emit('reset-zoom')"
      >
        {{ zoomDisplay }}
      </button>
      <button
        type="button"
        class="tool-btn"
        title="Zoom in"
        aria-label="Zoom in"
        @click="emit('zoom-in')"
      >
        <Plus :size="18" :stroke-width="1.8" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  padding: 0.35rem 0.5rem;
  background: var(--background);
  border-bottom: 1px solid var(--grid);
}

.group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.tool-btn,
.zoom-value {
  height: 36px;
  padding: 0;
  box-shadow: none;
}

.tool-btn {
  width: 36px;
}

.tool-btn svg {
  color: inherit;
}

.tool-btn:not(.btn-active),
.tool-btn:not(.btn-active):hover,
.zoom-value,
.zoom-value:hover {
  background: none;
  color: var(--text-primary);
}

.tool-btn.btn-active:hover {
  background: var(--primary);
  color: var(--text-inverse);
}

.tool-btn:disabled {
  background: none;
  opacity: 0.35;
}

.zoom-value {
  min-width: 3rem;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

@media (min-width: 641px) {
  .toolbar {
    justify-content: center;
    gap: 1rem;
    padding: 0.5rem 1.5rem;
  }

  .group {
    gap: 4px;
  }
}

@media (min-width: 1025px) {
  .toolbar {
    gap: 1.5rem;
  }

  .tool-btn,
  .zoom-value {
    height: 42px;
  }

  .tool-btn {
    width: 42px;
  }

  .tool-btn svg {
    width: 24px;
    height: 24px;
  }

  .zoom-value {
    min-width: 3.5rem;
    font-size: 0.95rem;
  }
}
</style>
