<script setup>
import { ref } from 'vue'
import GaugeSettings from './SettingsOptions/GaugeSettings.vue'
import ChevronIcon from './icons/ChevronIcon.vue'
import { Square } from '@lucide/vue'

defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, required: true },
})

const emit = defineEmits(['update-mode', 'resize', 'update-grid-color'])

const tabs = [
  { id: 'grid', label: 'Grid' },
  { id: 'size', label: 'Size' },
  { id: 'gauge', label: 'Gauge' },
]
const activeTab = ref(tabs[0].id)

function applySize(cols, rows) {
  emit('resize', { cols: Number(cols), rows: Number(rows) })
}
</script>

<template>
  <div class="settings-panel">
    <div class="tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        :aria-selected="activeTab === tab.id"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <div v-show="activeTab === 'grid'" class="options grid-options">
        <label>Shape</label>
        <button
          type="button"
          class="icon-btn"
          :class="{ active: mode === 'grid' }"
          @click="emit('update-mode', 'grid')"
        >
          <Square color="var(--text-inverse)" :stroke-width="1.8" />
        </button>
        <button
          type="button"
          class="icon-btn"
          :class="{ active: mode === 'chevron' }"
          @click="emit('update-mode', 'chevron')"
        >
          <ChevronIcon color="var(--text-inverse)" />
        </button>
        <label>Color</label>
        <input
          type="color"
          class="swatch"
          :value="chart.gridColor"
          :aria-label="'Grid Color'"
          @input="emit('update-grid-color', $event.target.value)"
        />
      </div>

      <div v-show="activeTab === 'size'" class="options">
        <label>
          Stitches
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

      <div v-show="activeTab === 'gauge'" class="options">
        <GaugeSettings />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  margin-bottom: 0;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--grid);
}

.tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  border-radius: 0;
  padding: 0.5rem 0.75rem;
  font-weight: 200;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary);
  opacity: 0.6;
  cursor: pointer;
  box-shadow: none;
}

.tab:hover {
  opacity: 0.85;
}

.tab.active {
  opacity: 1;
  font-weight: 400;
  border-bottom-color: var(--primary);
}

.tab-content {
  padding-top: 1rem;
}

.tab-content input.swatch {
  border-radius: 0;
  box-shadow: none;
}

.options {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 8px;
}
.grid-options {
  gap: 8px;
}
.swatch {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  cursor: pointer;
  appearance: none;
  background: none;
  border-radius: none;
}

.icon-btn {
  width: 32px;
  height: 32px;
}
</style>
