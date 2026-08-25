<script setup>
import { Paintbrush, Eraser, Undo2, Redo2, Trash2 } from '@lucide/vue'

defineProps({
  tool: { type: String, required: true },
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false },
})

const emit = defineEmits(['update-tool', 'undo', 'redo', 'clear'])
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
    <button type="button" class="icon-btn history-btn" aria-label="Clear canvas" @click="emit('clear')">
      <Trash2 color="var(--text-inverse)" :stroke-width="1.8" />
    </button>
  </div>
</template>

<style scoped>
.icon-btn.history-btn:not(:disabled) {
  opacity: 1;
}
</style>
