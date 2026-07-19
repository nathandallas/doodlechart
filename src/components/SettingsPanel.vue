<script setup>
defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, required: true },
})

const emit = defineEmits(['update-mode', 'resize'])

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
  </div>
</template>

<style>
.canvas-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
</style>
