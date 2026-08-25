<script setup>
import { ref } from 'vue'
import EditorSettings from './SettingsOptions/EditorSettings.vue'
import GridSettings from './SettingsOptions/GridSettings.vue'
import GaugeSettings from './SettingsOptions/GaugeSettings.vue'
import { LayoutGrid, RulerDimensionLine, SquarePen } from '@lucide/vue'

defineProps({
  chart: { type: Object, required: true },
  mode: { type: String, required: true },
  tool: { type: String, required: true },
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update-mode',
  'update-tool',
  'undo',
  'redo',
  'clear',
  'resize',
  'update-grid-color',
  'update-grid-opacity',
  'update-gauge',
])

const tabs = [
  { id: 'editor', label: 'Editor', icon: SquarePen },
  { id: 'grid', label: 'Grid', icon: LayoutGrid },
  { id: 'gauge', label: 'Gauge', icon: RulerDimensionLine },
]
const activeTab = ref(tabs[0].id)
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
        <component :is="tab.icon" :size="16" :stroke-width="1.8" />
        {{ tab.label }}
      </button>
    </div>
    <div class="tab-content">
      <div v-show="activeTab === 'editor'">
        <EditorSettings
          :tool="tool"
          :can-undo="canUndo"
          :can-redo="canRedo"
          @update-tool="emit('update-tool', $event)"
          @undo="emit('undo')"
          @redo="emit('redo')"
          @clear="emit('clear')"
        />
      </div>

      <div v-show="activeTab === 'grid'">
        <GridSettings
          :chart="chart"
          :mode="mode"
          @update-mode="emit('update-mode', $event)"
          @resize="emit('resize', $event)"
          @update-grid-color="emit('update-grid-color', $event)"
          @update-grid-opacity="emit('update-grid-opacity', $event)"
        />
      </div>

      <div v-show="activeTab === 'gauge'" class="options">
        <GaugeSettings @update-gauge="emit('update-gauge', $event)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  border-bottom: 1px solid var(--grid);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  position: relative;
  background: var(--grid);
  border: 1px solid var(--grid);
  border-bottom: none;
  margin-bottom: -1px;
  border-radius: 8px 8px 0 0;
  padding: 0.5rem 0.9rem;
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
  background: var(--grid);
}

.tab.active,
.tab.active:hover {
  opacity: 1;
  font-weight: 400;
  background: var(--background);
  border-color: var(--grid);
  z-index: 1;
}

.tab.tab-editor {
  font-family: 'Rozha One', sans-serif;
  font-size: 1.5rem;
  line-height: 1.4rem;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 400;
}

.tab-content {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--grid);
}
</style>
