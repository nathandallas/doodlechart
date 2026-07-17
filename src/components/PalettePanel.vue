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
      <span class="swatch-fill" :class="{ selected: i === selected }" :style="{ background: color }"></span>
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
  gap: 10px;
  flex-wrap: wrap;
}
.label {
  font-size: 13px;
  margin-right: 2px;
}
.swatch-wrap {
  position: relative;
  margin: 0;
  padding: 4px;
}

.swatch-fill {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  pointer-events: none;
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.swatch-fill.selected {
  outline-color: black;
}
.swatch {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  appearance: none;
  background: none;
  opacity: 0;
}
.remove {
  position: absolute;
  top: -7px;
  right: -7px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  border-radius: 50%;
}
.bg-tag {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
}
.add {
  padding: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  line-height: 1rem;
}
</style>
