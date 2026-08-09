<script setup>
const props = defineProps({
  palette: { type: Array, required: true },
  selected: { type: Number, required: true },
})

const emit = defineEmits(['select', 'update-color', 'add-color', 'remove-color'])

// Stops color panel from opening on first click, double click to change color
function handleSwatchClick(e, i) {
  emit('select', i)
  if (i !== props.selected) e.preventDefault()
}
</script>

<template>
  <div class="palette">
    <span class="label">Yarns</span>
    <div v-for="(color, i) in palette" :key="i" class="swatch-wrap">
      <span
        class="swatch-fill"
        :class="{ selected: i === selected }"
        :style="{ background: color }"
      ></span>
      <input
        type="color"
        class="swatch"
        :value="color"
        :aria-label="'Yarn ' + (i + 1)"
        @click="handleSwatchClick($event, i)"
        @input="emit('update-color', { index: i, color: $event.target.value })"
      />
      <button
        v-if="i !== 0 && palette.length > 1"
        class="remove"
        :aria-label="'Remove yarn ' + (i + 1)"
        @click="emit('remove-color', i)"
      >
        ×
      </button>
      <span v-if="i === 0" class="bg-tag">background</span>
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
.label {
  font-size: 13px;
  margin-right: 2px;
}
.swatch-wrap {
  position: relative;
  margin: 5px 0 0 0;
}

.swatch-fill {
  position: absolute;
  width: 32px;
  height: 32px;
  pointer-events: none;
  border: 1px solid var(--text-primary);
}
.swatch-fill.selected {
  border: 2px solid var(--text-primary);
}
.swatch {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  cursor: pointer;
  appearance: none;
  background: none;
  opacity: 0;
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
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
}
.add {
  position: relative;
  top: 0;
  border: 1px solid var(--text-primary);
  background: none;
  margin: 0;
  padding: 0;
  width: 32px;
  height: 32px;
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
</style>
