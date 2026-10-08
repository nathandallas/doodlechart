<script setup>
import { Menu, Settings, CircleQuestionMark } from '@lucide/vue'

const emit = defineEmits(['open-menu', 'open-settings', 'toggle-shortcuts'])
</script>

<template>
  <header class="top-bar">
    <button type="button" class="bar-btn" title="Menu" aria-label="Menu" @click="emit('open-menu')">
      <Menu :size="22" :stroke-width="1.8" />
    </button>

    <h1 class="wordmark">DoodleChart</h1>

    <div class="actions">
      <button
        type="button"
        class="bar-btn"
        title="Settings"
        aria-label="Settings"
        @click="emit('open-settings')"
      >
        <Settings :size="22" :stroke-width="1.8" />
      </button>
      <button
        type="button"
        class="bar-btn"
        title="Keyboard shortcuts"
        aria-label="Keyboard shortcuts"
        @click="emit('toggle-shortcuts')"
      >
        <CircleQuestionMark :size="22" :stroke-width="1.8" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: var(--secondary);
}

.wordmark {
  font-size: 1.4rem;
  line-height: 1;
  padding-top: 0.2rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.bar-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  box-shadow: none;
}

.bar-btn:hover {
  background: none;
}

.bar-btn svg {
  color: var(--text-primary);
}

@media (min-width: 641px) {
  .top-bar {
    padding: 0.35rem 1.5rem;
  }

  .wordmark {
    font-size: 1.6rem;
  }
}

@media (min-width: 1025px) {
  .top-bar {
    padding: 0.5rem 2.5rem;
  }

  .wordmark {
    font-size: 1.8rem;
  }
}
</style>
