<script setup>
import { reactive } from 'vue'
import { createChart, setCell } from '../engine/chart.js'
import ChartCanvas from '../components/ChartCanvas.vue'

const chart = reactive(createChart(10, 8))


function onPaint({ row, col }) {
    setCell(chart, row, col, 1)
}
</script>

<template>
  <h1>Editor</h1>
  <ChartCanvas :chart="chart" @paint="onPaint"/>
</template>
