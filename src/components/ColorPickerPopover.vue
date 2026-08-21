<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { SketchPicker } from 'vue-color'

defineProps({
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const rootEl = ref(null)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

// Close when clicking anywhere outside the color picker
function handleOutsideClick(e) {
  if (open.value && rootEl.value && !rootEl.value.contains(e.target)) {
    close()
  }
}

onMounted(() => document.addEventListener('pointerdown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutsideClick))
</script>

<template>
  <div ref="rootEl" class="picker-wrap">
    <slot :open="open" :toggle="toggle" :close="close" />
    <div v-if="open" class="picker-popover">
      <SketchPicker
        :model-value="modelValue"
        disable-alpha
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.picker-wrap {
  position: relative;
  display: inline-flex;
}

.picker-popover {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
}
</style>
