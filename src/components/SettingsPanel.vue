<script setup>
import GaugeSettings from './SettingsOptions/GaugeSettings.vue'

defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, required: true },
})

const emit = defineEmits(['update-mode', 'resize', 'update-grid-color'])

function applySize(cols, rows) {
  emit('resize', { cols: Number(cols), rows: Number(rows) })
}
</script>

<template>
  <div class="canvas-toolbar">
    <div class="group">
      <h3>GRID</h3>
      <div class="options">
        <button
          type="button"
          :class="{ active: mode === 'grid' }"
          @click="emit('update-mode', 'grid')"
        >
          Grid
        </button>
        <button
          type="button"
          :class="{ active: mode === 'chevron' }"
          @click="emit('update-mode', 'chevron')"
        >
          Chevron
        </button>
        <input
          type="color"
          class="swatch"
          :value="chart.gridColor"
          :aria-label="'Grid Color'"
          @input="emit('update-grid-color', $event.target.value)"
        />
      </div>
    </div>

    <div class="group">
      <h3>SIZE</h3>
      <div class="options">
        <label>
          Sts
          <input
            type="number"
            min="1"
            max="200"
            :value="chart.cols"
            @change="applySize($event.target.value, chart.rows)"
          />
        </label>
        <label>
          Rows
          <input
            type="number"
            min="1"
            max="300"
            :value="chart.rows"
            @change="applySize(chart.cols, $event.target.value)"
          />
        </label>
      </div>
    </div>

    <div class="group">
      <h3>GAUGE</h3>
      <GaugeSettings />
    </div>
  </div>
</template>

<style>
.canvas-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.options {
  position: relative;
}
.swatch {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  cursor: pointer;
  appearance: none;
  background: none;
}
</style>
