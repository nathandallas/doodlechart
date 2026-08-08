<script setup>
import { ref, watch, nextTick } from 'vue'
const YARN_PRESETS = {
  lace: { stitches: 33, rows: 40 },
  fingering: { stitches: 28, rows: 36 },
  sport: { stitches: 24, rows: 32 },
  dk: { stitches: 22, rows: 28 },
  worsted: { stitches: 20, rows: 26 },
  aran: { stitches: 18, rows: 24 },
  bulky: { stitches: 15, rows: 20 },
  super_bulky: { stitches: 10, rows: 14 },
}

const preset = ref('aran')
const gaugeStitches = ref(18)
const gaugeRows = ref(24)
const gaugeStitchSpan = ref(4)
const gaugeRowSpan = ref(4)
const useCm = ref(false)

let applyingPreset = false
let convertingUnits = false

watch(preset, (key) => {
  if (key === 'custom') return

  const p = YARN_PRESETS[key]
  if (!p) return

  applyingPreset = true
  gaugeStitches.value = p.stitches
  gaugeStitchSpan.value = 4
  gaugeRows.value = p.rows
  gaugeRowSpan.value = 4

  nextTick(() => {
    applyingPreset = false
  })
})

// Handle manual input
function markCustomIfManualInput() {
  if (applyingPreset) return
  if (preset.value !== 'custom') preset.value = 'custom'
}

watch(gaugeStitches, markCustomIfManualInput)
watch(gaugeRows, markCustomIfManualInput)

// When user updates span input, scale # of stitches accordingly
function scaleStitchCountToSpan(countRef, newSpan, oldSpan) {
  if (!oldSpan) return
  countRef.value = Math.round(countRef.value * (newSpan / oldSpan) * 10) / 10
}

watch(gaugeStitchSpan, (newSpan, oldSpan) => {
  if (convertingUnits) return
  scaleStitchCountToSpan(gaugeStitches, newSpan, oldSpan)
})
watch(gaugeRowSpan, (newSpan, oldSpan) => {
  if (convertingUnits) return
  scaleStitchCountToSpan(gaugeRows, newSpan, oldSpan)
})

// Toggles and converts inches to cm and back

function toggleUnits() {
  convertingUnits = true
  const factor = useCm.value ? 1 / 2.54 : 2.54
  gaugeStitchSpan.value = Math.round(gaugeStitchSpan.value * factor * 10) / 10
  gaugeRowSpan.value = Math.round(gaugeRowSpan.value * factor * 10) / 10
  useCm.value = !useCm.value
  nextTick(() => {
    convertingUnits = false
  })
}
</script>

<template>
  <div>
    <div class="field-label">Yarn weight</div>
    <select v-model="preset">
      <option value="lace">Lace</option>
      <option value="fingering">Fingering</option>
      <option value="sport">Sport</option>
      <option value="dk">DK</option>
      <option value="worsted">Worsted</option>
      <option value="aran">Aran</option>
      <option value="bulky">Bulky</option>
      <option value="super_bulky">Super Bulky</option>
      <option value="custom">Custom</option>
    </select>

    <div class="row">
      <div class="field">
        <input type="number" v-model.number="gaugeStitches" />
        <span>stitches in</span>
      </div>
      <div class="field">
        <input type="number" v-model.number="gaugeStitchSpan" />
        <span>{{ useCm ? 'cm' : 'inches' }}</span>
      </div>
    </div>

    <div class="row">
      <div class="field">
        <input type="number" v-model.number="gaugeRows" />
        <span>rows in</span>
      </div>
      <div class="field">
        <input type="number" v-model.number="gaugeRowSpan" />
        <span>{{ useCm ? 'cm' : 'inches' }}</span>
      </div>
    </div>

    <div class="unit-toggle">
      <button @click="toggleUnits()">Use {{ useCm ? 'inches' : 'cm' }}</button>
    </div>
  </div>
</template>

<style></style>
