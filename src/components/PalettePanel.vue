<script setup>
import ColorPickerPopover from './ColorPickerPopover.vue'

const props = defineProps({
  palette: { type: Array, required: true },
  selected: { type: Number, required: true },
  vertical: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'update-color', 'add-color', 'remove-color'])

// Stops the picker from opening on first click, click again to change color
function handleSwatchClick(i, toggle) {
  const wasSelected = i === props.selected
  emit('select', i)
  if (wasSelected) toggle()
}
</script>

<template>
  <div class="palette" :class="{ vertical }">
    <span class="label">Yarn</span>
    <div v-for="(color, i) in palette" :key="i" class="swatch-wrap">
      <ColorPickerPopover
        :model-value="color"
        @update:model-value="(c) => emit('update-color', { index: i, color: c })"
      >
        <template #default="{ toggle }">
          <button
            type="button"
            class="swatch"
            :class="{ selected: i === selected }"
            :style="{ background: color }"
            :aria-label="'Yarn ' + (i + 1)"
            @click="handleSwatchClick(i, toggle)"
          ></button>
        </template>
      </ColorPickerPopover>
      <button
        v-if="i !== 0 && palette.length > 1"
        class="remove"
        :aria-label="'Remove yarn ' + (i + 1)"
        @click="emit('remove-color', i)"
      >
        ×
      </button>
      <span v-if="i === 0" class="bg-tag">base</span>
    </div>
    <button class="add" @click="emit('add-color')" aria-label="Add yarn">+</button>
  </div>
</template>

<style scoped>
.palette {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.palette.vertical {
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 1px;
}

.label {
  font-size: 1rem;
  text-align: center;
  width: 100%;
}

.swatch-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
}

.palette.vertical .swatch-wrap {
  margin: 0;
}

.swatch {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid var(--text-primary);
  border-radius: 0;
  cursor: pointer;
}
.swatch.selected {
  border: 2px solid var(--text-primary);
}
.remove {
  position: absolute;
  top: -2px;
  right: 0px;
  width: 20px;
  height: 20px;
  font-size: 1rem;
  line-height: 1;
  background: none;
  border: none;
}

.remove:hover {
  color: red;
}

.remove:active {
  transform: scale(0.7);
  color: var(--text-primary);
}

.bg-tag {
  font-size: 0.8rem;
  line-height: 1rem;
  white-space: nowrap;
}

.add {
  position: relative;
  top: 0;
  border: 1px solid var(--text-primary);
  color: var(--text-primary);
  background: none;
  margin: 0;
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
  line-height: 1rem;
  border-radius: 0;
}

.add:hover {
  background-color: var(--grid);
}

.add:active {
  transform: scale(0.9);
}

button {
  box-shadow: none;
}
</style>
