<script setup>
import { Square, RectangleHorizontal } from '@lucide/vue'
import ChevronIcon from '../icons/ChevronIcon.vue'
import ColorPickerPopover from '../ColorPickerPopover.vue'

defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, required: true },
  stacked: { type: Boolean, default: false },
})

const emit = defineEmits(['update-mode', 'resize', 'update-grid-color', 'update-grid-opacity'])

function applySize(cols, rows) {
  emit('resize', { cols: Number(cols), rows: Number(rows) })
}
</script>

<template>
  <div class="options" :class="{ stacked }">
    <label class="heading">Shape</label>
    <div class="shapes">
      <button
        type="button"
        class="icon-btn"
        :class="{ 'btn-active': mode === 'grid' }"
        @click="emit('update-mode', 'grid')"
      >
        <RectangleHorizontal color="var(--text-inverse)" :stroke-width="1.8" />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ 'btn-active': mode === 'chevron' }"
        @click="emit('update-mode', 'chevron')"
      >
        <ChevronIcon color="var(--text-inverse)" />
      </button>
      <button
        type="button"
        class="icon-btn"
        :class="{ 'btn-active': mode === 'square-grid' }"
        @click="emit('update-mode', 'square-grid')"
      >
        <Square color="var(--text-inverse)" :stroke-width="1.8" />
      </button>
    </div>

    <div class="divider" aria-hidden="true"></div>

    <label class="heading">Size</label>
    <label class="sub">
      <span>Stitches</span>
      <input
        type="number"
        min="1"
        max="600"
        :value="chart.cols"
        @change="applySize($event.target.value, chart.rows)"
      />
    </label>
    <label class="sub">
      <span>Rows</span>
      <input
        type="number"
        min="1"
        max="600"
        :value="chart.rows"
        @change="applySize(chart.cols, $event.target.value)"
      />
    </label>

    <div class="divider" aria-hidden="true"></div>

    <label v-if="stacked" class="heading">Grid Lines</label>
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

.shapes {
  display: flex;
  gap: 8px;
}

.swatch {
  width: 32px;
  height: 32px;
  appearance: none;
  background: none;
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

.stacked {
  display: grid;
  grid-template-columns: 5rem 1fr;
  align-items: center;
  margin-bottom: 0;
}

.stacked .heading,
.stacked .shapes,
.stacked .divider {
  grid-column: 1 / -1;
}

.stacked .heading {
  font-weight: 600;
}

.stacked .divider {
  width: auto;
  height: 1px;
  margin: 1rem 0;
}

.stacked .sub {
  display: contents;
  font-size: inherit;
}

.stacked .sub input {
  width: 8rem;
}

.stacked .opacity-slider {
  width: 100%;
}
</style>
