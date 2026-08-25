<script setup>
import { Square, RectangleHorizontal } from '@lucide/vue'
import ChevronIcon from '../icons/ChevronIcon.vue'
import ColorPickerPopover from '../ColorPickerPopover.vue'

defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, required: true },
})

const emit = defineEmits(['update-mode', 'resize', 'update-grid-color', 'update-grid-opacity'])

function applySize(cols, rows) {
  emit('resize', { cols: Number(cols), rows: Number(rows) })
}
</script>

<template>
  <div class="options">
    <label>Shape</label>
    <button
      type="button"
      class="icon-btn"
      :class="{ active: mode === 'grid' }"
      @click="emit('update-mode', 'grid')"
    >
      <RectangleHorizontal color="var(--text-inverse)" :stroke-width="1.8" />
    </button>
    <button
      type="button"
      class="icon-btn"
      :class="{ active: mode === 'chevron' }"
      @click="emit('update-mode', 'chevron')"
    >
      <ChevronIcon color="var(--text-inverse)" />
    </button>
    <button
      type="button"
      class="icon-btn"
      :class="{ active: mode === 'square-grid' }"
      @click="emit('update-mode', 'square-grid')"
    >
      <Square color="var(--text-inverse)" :stroke-width="1.8" />
    </button>

    <div class="divider" aria-hidden="true"></div>

    <label>Size</label>
    <label class="sub">
      Stitches
      <input
        type="number"
        min="1"
        max="300"
        :value="chart.cols"
        @change="applySize($event.target.value, chart.rows)"
      />
    </label>
    <label class="sub">
      Rows
      <input
        type="number"
        min="1"
        max="300"
        :value="chart.rows"
        @change="applySize(chart.cols, $event.target.value)"
      />
    </label>

    <div class="divider" aria-hidden="true"></div>

    <label>Color</label>
    <ColorPickerPopover
      :model-value="chart.gridColor"
      @update:model-value="emit('update-grid-color', $event)"
    >
      <template #default="{ toggle }">
        <button
          type="button"
          class="swatch"
          :style="{ background: chart.gridColor }"
          aria-label="Grid Color"
          @click="toggle"
        ></button>
      </template>
    </ColorPickerPopover>
    <label>Opacity</label>
    <input
      type="range"
      class="opacity-slider"
      min="0.11"
      max="1"
      step="0.01"
      :value="chart.gridOpacity"
      :aria-label="'Grid Opacity'"
      @input="emit('update-grid-opacity', Number($event.target.value))"
    />
  </div>
</template>

<style scoped>
.sub {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  font-size: 0.9rem;
}
.options {
  gap: 8px;
}

.swatch {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--text-primary);
  cursor: pointer;
  appearance: none;
  background: none;
  border-radius: 0;
  box-shadow: none;
}

.opacity-slider {
  width: 100px;
  padding: 0;
  border: none;
  box-shadow: none;
  background: none;
  accent-color: var(--primary);
}

input {
  width: 80px;
}
</style>
