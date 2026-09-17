<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import PageFooter from '@/components/PageFooter.vue'
import GridSetupModal from '@/components/GridSetupModal.vue'

const router = useRouter()
const showSetupModal = ref(false)

function onSetupConfirm() {
  showSetupModal.value = false
  router.push('/editor')
}
</script>

<template>
  <NavBar />
  <div class="grid-wrapper">
    <div class="grid-background"></div>
    <div class="cta">
      <h2>DoodleChart</h2>
      <h3>
        Design your own custom colorwork charts for knitting, crochet, cross-stitch, and more.
      </h3>
      <div class="chart-selection">
        <button @click="showSetupModal = true">Custom Chart</button>
        <button @click="$router.push('/editor')">Default Chart</button>
      </div>
      <GridSetupModal
        :open="showSetupModal"
        @close="showSetupModal = false"
        @confirm="onSetupConfirm"
      />
    </div>

    <PageFooter class="page-footer" />
  </div>
</template>

<style scoped>
.grid-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: var(--background);
}

.grid-background {
  position: absolute;
  top: -20px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  background-image:
    linear-gradient(to right, var(--grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid) 1px, transparent 1px);
  background-size: 30px 20px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%);
  transition: opacity 0.3s ease;
}

.page-footer {
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.cta {
  max-width: 600px;
  margin: 4rem auto;
  padding: 0 2rem;
  border-radius: 20px;
  z-index: 4;
  background-color: var(--secondary60);
  transition:
    max-width 0.2s ease,
    margin 0.2s ease,
    padding 0.2s ease;
}

h2 {
  font-size: 4rem;
  transition: font-size 0.2s ease;
}

h3 {
  font-size: 1.5rem;
  transition: font-size 0.2s ease;
}

.chart-selection {
  margin: 2rem 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  transition: gap 0.2s ease;
}

button {
  font-size: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  transition: all 0.2s ease;
}

@media (min-width: 641px) and (max-width: 1024px) {
  .cta {
    max-width: 600px;
  }

  h2 {
    font-size: 3rem;
  }

  h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 640px) {
  .cta {
    max-width: 100%;
    margin: 4rem 2rem 2rem;
    padding: 0 18px;
  }

  .grid-background {
    opacity: 0.5;
  }

  h2 {
    font-size: 3rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  .chart-selection {
    flex-direction: column;
    gap: 1rem;
  }

  .chart-selection button {
    width: 100%;
  }
}
</style>
