import { useEventListener } from '@vueuse/core'


export const isMacPlatform =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.platform ?? navigator.userAgent)

function isEditableTarget(target) {
  if (!target) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}


export function useKeyboardShortcuts({
  setTool,
  undo,
  redo,
  clear,
  zoomIn,
  zoomOut,
  resetZoom,
  isPanning,
  toggleShortcuts,
} = {}) {
  useEventListener(window, 'keydown', (e) => {
    if (isEditableTarget(e.target)) return

    // Hold Space to pan the canvas instead of painting.
    if (e.code === 'Space') {
      if (!e.repeat && isPanning) isPanning.value = true
      e.preventDefault()
      return
    }

    if (e.shiftKey && (e.key === '?' || e.code === 'Slash')) {
      e.preventDefault()
      toggleShortcuts?.()
      return
    }

    const mod = e.ctrlKey || e.metaKey
    if (mod) {
      const key = e.key.toLowerCase()
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo?.()
      } else if ((key === 'y' && !e.metaKey) || (key === 'z' && e.shiftKey)) {
        e.preventDefault()
        redo?.()
      } else if (key === 'x' && !e.metaKey) {
        e.preventDefault()
        clear?.()
      } else if (key === '=' || key === '+') {
        e.preventDefault()
        zoomIn?.()
      } else if (key === '-' || key === '_') {
        e.preventDefault()
        zoomOut?.()
      } else if (key === '0') {
        e.preventDefault()
        resetZoom?.()
      }
      return
    }

    switch (e.key.toLowerCase()) {
      case 'b':
        setTool?.('paint')
        break
      case 'e':
        setTool?.('erase')
        break
      case 'g':
        setTool?.('fill')
        break
    }
  })

  useEventListener(window, 'keyup', (e) => {
    if (e.code === 'Space' && isPanning) isPanning.value = false
  })


  useEventListener(window, 'blur', () => {
    if (isPanning) isPanning.value = false
  })
}
