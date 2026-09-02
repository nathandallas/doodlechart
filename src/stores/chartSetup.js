import { defineStore } from 'pinia'
import { YARN_PRESETS } from '@/engine/gauge'

export const useChartSetupStore = defineStore('chartSetup', {
  state: () => ({
    cols: 20,
    rows: 22,
    palette: ['#F7F4EE', '#bc5953', '#c47fa0', '#7b75da', '#3984a3', '#7a9e5e'],
    gridColor: '#666',
    gridOpacity: 1,
    gauge: { ...YARN_PRESETS.aran, stitchSpan: 4, rowSpan: 4 },
  }),
  actions: {
    reset() {
      this.$reset()
    },
  },
})
