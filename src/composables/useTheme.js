import { ref, watch, watchEffect } from 'vue'

const theme = ref(
  localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
)

watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
})

export function useTheme() {
    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
    return { theme, toggleTheme }
}