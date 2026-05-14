// ─── Theme composable ──────────────────────────────────────────
// Single source of truth for dark/light mode.
// Call init() once in app.vue on mount; use toggle() in TopHeader.

export function useTheme() {
  const isDark = useState('isDark', () => false)

  // ─── Read localStorage + system preference and apply ─────────
  const init = () => {
    const stored = localStorage.getItem('theme')
    isDark.value =
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // ─── Flip the current theme and persist ──────────────────────
  const toggle = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, init, toggle }
}
