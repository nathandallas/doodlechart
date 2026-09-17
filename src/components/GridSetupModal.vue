<script setup>
import { reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
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

function reseedDraft() {
  Object.assign(draft, {
    cols: setup.cols,
    rows: setup.rows,
    gridColor: setup.gridColor,
    gridOpacity: setup.gridOpacity,
  })
  Object.assign(draftGauge, setup.gauge)
}

// Reseed from the store on open so Cancel discards whatever was typed last time
function syncOpen(v) {
  if (!dialogEl.value) return
  if (v) {
    reseedDraft()
    dialogEl.value.showModal()
  } else {
    dialogEl.value.close()
  }
}

onMounted(() => syncOpen(props.open))
watch(() => props.open, syncOpen)

onBeforeUnmount(() => {
  reseedDraft()
  dialogEl.value?.close()
})

// Ignore drags that start inside the content and end on the backdrop
let pressedBackdrop = false
function onPointerDown(e) {
  pressedBackdrop = e.target === dialogEl.value
}
function onBackdropClick(e) {
  if (pressedBackdrop && e.target === dialogEl.value) emit('close')
  pressedBackdrop = false
}

function confirm() {
  setup.$patch({ ...draft, gauge: draftGauge })
  emit('confirm')
}
</script>

<template>
  <dialog
    ref="dialogEl"
    class="setup-modal"
    @cancel="emit('close')"
    @pointerdown="onPointerDown"
    @click="onBackdropClick"
  >
    <div class="setup-body">
      <h2>Customize your grid</h2>
      <template v-if="open">
        <GridSettings
          stacked
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
        <hr />
        <GaugeSettings
          stacked
          :gauge="draftGauge"
          @update-gauge="(g) => Object.assign(draftGauge, g)"
        />
      </template>
      <div class="actions">
        <button class="cancel" @click="emit('close')">Cancel</button>
        <button @click="confirm">Create</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.setup-modal {
  --pad-x: 3rem;
  padding: 0;
  width: min(95vw, 520px);
  max-height: 90vh;
}

@media (max-width: 640px) {
  .setup-modal {
    --pad-x: 3rem;
  }
}

.setup-body {
  padding: 1.25rem var(--pad-x) 0;
}

h2 {
  margin-top: 0;
}

hr {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid var(--grid);
}

.actions {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem calc(-1 * var(--pad-x)) 0;
  padding: 1rem;
  background: var(--background);
  border-top: 1px solid var(--grid);
}
</style>
