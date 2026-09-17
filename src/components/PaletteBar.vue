<script setup>
import { computed } from 'vue'
import { Plus } from '@lucide/vue'
import ColorPickerPopover from './ColorPickerPopover.vue'

const props = defineProps({
  palette: { type: Array, required: true },
  selected: { type: Number, required: true },
})

const emit = defineEmits(['select', 'update-color', 'add-color', 'remove-color'])

const selectedColor = computed(() => props.palette[props.selected] ?? props.palette[0])

function handleSwatchTap(i, toggle) {
  if (i === props.selected) toggle()
  emit('select', i)
}

function handleRemove(i, close) {
  if (i === props.selected) close()
  emit('remove-color', i)
}
</script>

<template>
  <ColorPickerPopover
    class="palette-bar"
    placement="top"
    :model-value="selectedColor"
    @update:model-value="(c) => emit('update-color', { index: selected, color: c })"
  >
    <template #default="{ toggle, close }">
      <div class="bar-inner">
        <div class="swatch-scroll" role="listbox" aria-label="Yarn colors">
          <template v-for="(color, i) in palette" :key="i">
            <div class="swatch-wrap">
              <button
                type="button"
                class="swatch"
                role="option"
                :class="{ selected: i === selected }"
                :style="{ background: color }"
                :aria-selected="i === selected"
                :title="i === selected ? 'Edit color' : 'Yarn ' + (i + 1)"
                :aria-label="i === 0 ? 'Base yarn' : 'Yarn ' + (i + 1)"
                @click="handleSwatchTap(i, toggle)"
              ></button>
              <span v-if="i === 0" class="base-tag" aria-hidden="true">base</span>
              <button
                v-if="i !== 0 && palette.length > 1"
                type="button"
                class="remove-badge"
                :title="'Remove yarn ' + (i + 1)"
                :aria-label="'Remove yarn ' + (i + 1)"
                @click="handleRemove(i, close)"
              >
                ×
              </button>
            </div>
            <div v-if="i === 0 && palette.length > 1" class="divider" aria-hidden="true"></div>
          </template>
        </div>
        <button
          type="button"
          class="add-btn"
          title="Add yarn"
          aria-label="Add yarn"
          @click="emit('add-color')"
        >
          <Plus :size="20" :stroke-width="1.8" />
        </button>
      </div>
    </template>
  </ColorPickerPopover>
</template>

<style scoped>
.palette-bar {
  position: relative;
  z-index: 20;
  display: flex;
  width: 100%;
  background: var(--background);
  border-top: 1px solid var(--grid);
}

.bar-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom));
}

.swatch-scroll {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 6px;
  scrollbar-width: none;
}

.swatch-scroll::-webkit-scrollbar {
  display: none;
}

.swatch-wrap {
  position: relative;
  flex: none;
  width: 40px;
  height: 40px;
}

.swatch-scroll .divider {
  flex: none;
}

.swatch {
  display: block;
  width: 100%;
  height: 100%;
  box-shadow: none;
}

.swatch:hover {
  color: inherit;
}

.swatch.selected {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}

.base-tag {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  font-size: 0.65rem;
  line-height: 1;
  padding: 1px 3px;
  color: var(--text-primary);
  background: var(--background);
  border-radius: 3px;
}

.remove-badge {
  position: absolute;
  top: -2px;
  right: 0;
  width: 20px;
  height: 20px;
  min-height: 0;
  padding: 0;
  line-height: 1;
  background: none;
  border: none;
  box-shadow: none;
}

.remove-badge:active {
  transform: scale(0.7);
  color: var(--text-primary);
}

.add-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  border: 1px solid var(--text-primary);
  box-shadow: none;
}

.add-btn svg {
  color: var(--text-primary);
}

.add-btn:hover {
  background: var(--grid);
}

@media (min-width: 641px) {
  .bar-inner {
    max-width: 960px;
    margin: 0 auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1025px) {
  .swatch-wrap,
  .add-btn {
    width: 48px;
    height: 48px;
  }

  .swatch-scroll {
    gap: 12px;
  }
}
</style>
