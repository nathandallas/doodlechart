<script setup>
import { ref } from 'vue'
import GaugeSettings from './SettingsOptions/GaugeSettings.vue'
import ChevronIcon from './icons/ChevronIcon.vue'
import ColorPickerPopover from './ColorPickerPopover.vue'
import { Square, Undo2, Redo2, Paintbrush, Eraser, Trash2 } from '@lucide/vue'

defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, required: true },
  tool: { type: String, required: true },
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update-mode',
  'resize',
  'update-grid-color',
  'update-grid-opacity',
  'update-gauge',
])

const tabs = [
  { id: 'editor', label: 'Editor' },
  { id: 'grid', label: 'Grid' },
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
        :class="{ active: activeTab === tab.id, 'tab-editor': tab.id === 'editor' }"
        :aria-selected="activeTab === tab.id"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tab-content">
      <div v-show="activeTab === 'editor'" class="options editor-options">
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
          class="icon-btn"
          :disabled="!canUndo"
          aria-label="Undo"
          @click="emit('undo')"
        >
          <Undo2 color="var(--text-inverse)" :stroke-width="1.8" />
        </button>
        <button
          type="button"
          class="icon-btn"
          :disabled="!canRedo"
          aria-label="Redo"
          @click="emit('redo')"
        >
          <Redo2 color="var(--text-inverse)" :stroke-width="1.8" />
        </button>
        <button type="button" class="icon-btn" aria-label="Clear canvas" @click="emit('clear')">
          <Trash2 color="var(--text-inverse)" :stroke-width="1.8" />
        </button>
      </div>

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

        <div class="divider" aria-hidden="true"></div>

        <label>Size</label>
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
        <!--
        <label>Thicker Lines Every X Squares</label>
        -->
      </div>

      <div v-show="activeTab === 'size'" class="options"></div>

      <div v-show="activeTab === 'gauge'" class="options">
        <GaugeSettings @update-gauge="emit('update-gauge', $event)" />
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

.tab.tab-editor {
  font-family: 'Rozha One', sans-serif;
  font-size: 1.5rem;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 400;
}

.tab-content {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--grid);
}

.tab-content .swatch {
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

.divider {
  align-self: stretch;
  width: 1px;
  background: var(--grid);
}
.swatch {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--text-primary);
  cursor: pointer;
  appearance: none;
  background: none;
  border-radius: none;
}

.icon-btn {
  width: 32px;
  height: 32px;
}

.icon-btn.active {
  background: var(--secondary);
}
.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.opacity-slider {
  width: 100px;
  padding: 0;
  border: none;
  box-shadow: none;
  background: none;
  accent-color: var(--primary);
}
</style>
