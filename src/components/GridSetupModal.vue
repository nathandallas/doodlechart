<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useChartSetupStore } from '@/stores/chartSetup'
import GridSettings from './SettingsOptions/GridSettings.vue'
import GaugeSettings from './SettingsOptions/GaugeSettings.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'confirm'])

const setup = useChartSetupStore()
const dialogEl = ref(null)
const draft = reactive({
  cols: setup.cols,
  rows: setup.rows,
  gridColor: setup.gridColor,
  gridOpacity: setup.gridOpacity,
})

const draftGauge = reactive({ ...setup.gauge })
const mode = ref('grid')

// Reseed from the store on open so Cancel discards whatever was typed last time
function syncOpen(v) {
  if (!dialogEl.value) return
  if (v) {
    Object.assign(draft, {
      cols: setup.cols,
      rows: setup.rows,
      gridColor: setup.gridColor,
      gridOpacity: setup.gridOpacity,
    })
    Object.assign(draftGauge, setup.gauge)
    dialogEl.value.showModal()
  } else {
    dialogEl.value.close()
  }
}

onMounted(() => syncOpen(props.open))
watch(() => props.open, syncOpen)

function confirm() {
  setup.$patch({ ...draft, gauge: draftGauge })
  emit('confirm')
}
</script>

<template>
  <dialog ref="dialogEl" class="setup-modal" @cancel="emit('close')">
    <h2>Customize your grid</h2>
    <template v-if="open">
      <GridSettings
        :chart="draft"
        :mode="mode"
        @update-mode="mode = $event"
        @resize="
          ({ cols, rows }) => {
            draft.cols = cols
            draft.rows = rows
          }
        "
        @update-grid-color="(c) => (draft.gridColor = c)"
        @update-grid-opacity="(o) => (draft.gridOpacity = o)"
      />
      <GaugeSettings :gauge="draftGauge" @update-gauge="(g) => Object.assign(draftGauge, g)" />
    </template>
    <div class="actions">
      <button @click="confirm">Create</button>
      <button @class="cancel" @click="emit('close')">Cancel</button>
    </div>
  </dialog>
</template>

<style scoped>
.setup-modal {
  margin: auto;
  border: none;
  border-radius: 16px;
  padding: 2rem;
  min-width: 660px;
  max-width: 90vw;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  background: var(--background);
  color: var(--text-primary);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.setup-modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
