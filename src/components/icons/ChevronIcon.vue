<script setup>
defineProps({
  color: { type: String, default: 'currentColor' },
})
</script>

<template>
  <svg viewBox="-3 -3 32 39" width="24" height="24" role="img" aria-label="Knit Stitch">
    <path
      d="M 0,0 L 13,15 L 26,0 L 26,18 L 13,33 L 0,18 Z"
      fill="none"
      :stroke="color"
      stroke-width="2.4"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
    <path d="M 13,15 L 13,33" fill="none" :stroke="color" stroke-width="2.4" stroke-linecap="round" />
  </svg>
</template>
