<script setup>
import { ref, watch, onMounted } from 'vue'
import { isMacPlatform } from '@/composables/useKeyboardShortcuts'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const dialogEl = ref(null)
const mod = isMacPlatform ? '⌘' : 'Ctrl'

const groups = [
  {
    title: 'Tools',
    shortcuts: [
      { keys: ['B'], label: 'Paintbrush' },
      { keys: ['E'], label: 'Eraser' },
      { keys: ['G'], label: 'Fill (Paint Bucket)' },
    ],
  },
  {
    title: 'History',
    shortcuts: [
      { keys: [mod, 'Z'], label: 'Undo' },
      { keys: [mod, 'Shift', 'Z'], label: 'Redo' },
      { keys: [mod, 'Y'], label: 'Redo (alt)' },
    ],
  },
  {
    title: 'Zoom & Navigation',
    shortcuts: [
      { keys: [mod, '='], label: 'Zoom in' },
      { keys: [mod, '-'], label: 'Zoom out' },
      { keys: [mod, '0'], label: 'Reset zoom (100%)' },
      { keys: [mod, 'Scroll'], label: 'Zoom' },
      { keys: ['Space', 'Drag'], label: 'Pan canvas' },
    ],
  },
  {
    title: 'General',
    shortcuts: [{ keys: ['Shift', '?'], label: 'Toggle this shortcut list' }],
  },
]

function syncOpen(v) {
  if (!dialogEl.value) return
  if (v) dialogEl.value.showModal()
  else dialogEl.value.close()
}

onMounted(() => syncOpen(props.open))
watch(() => props.open, syncOpen)

function onBackdropClick(e) {
  if (e.target === dialogEl.value) emit('close')
}
</script>

<template>
  <dialog
    ref="dialogEl"
    class="shortcuts-modal"
    @cancel="emit('close')"
    @click="onBackdropClick"
  >
    <template v-if="open">
      <h2>Keyboard shortcuts</h2>
      <div class="groups">
        <section v-for="group in groups" :key="group.title" class="group">
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="shortcut in group.shortcuts" :key="shortcut.label" class="row">
              <span class="keys">
                <template v-for="(key, i) in shortcut.keys" :key="i">
                  <kbd>{{ key }}</kbd
                  ><span v-if="i < shortcut.keys.length - 1" class="plus">+</span>
                </template>
              </span>
              <span class="label">{{ shortcut.label }}</span>
            </li>
          </ul>
        </section>
      </div>
    </template>
  </dialog>
</template>

<style scoped>
.shortcuts-modal {
  margin: auto;
  border: none;
  border-radius: 16px;
  padding: 1.5rem;
  width: 400px;
  max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  background: var(--background);
  color: var(--text-primary);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.shortcuts-modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.shortcuts-modal h2 {
  margin-bottom: 1rem;
}

.groups {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.group h3 {
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  margin-bottom: 0.5rem;
}

.group ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.label {
  font-size: 0.9rem;
}

.keys {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.plus {
  font-size: 0.75rem;
  opacity: 0.6;
}

kbd {
  display: inline-block;
  min-width: 1.5rem;
  text-align: center;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  border: 1px solid var(--grid);
  background: var(--secondary60, var(--grid));
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1.2;
  box-shadow: 0 1px 0 var(--grid);
}

@media (max-width: 480px) {
  .shortcuts-modal {
    width: 100%;
    padding: 1.25rem;
  }

  .row {
    flex-wrap: wrap;
  }
}
</style>
