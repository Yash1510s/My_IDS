import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return true // default to dark
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm backdrop-blur transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      <span className="relative h-5 w-5">
        <Sun className={`absolute inset-0 h-5 w-5 transition-transform duration-300 ${dark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
        <Moon className={`absolute inset-0 h-5 w-5 transition-transform duration-300 ${dark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
      </span>
      <span className="hidden sm:inline">{dark ? 'Dark' : 'Light'}</span>
    </button>
  )}


