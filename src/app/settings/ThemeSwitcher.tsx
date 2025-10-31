import React, { useState, useEffect } from 'react'

const themes = [
  { id: 'dark', name: 'Dark', description: 'Tema escuro padrão' },
  { id: 'light', name: 'Light', description: 'Tema claro' },
  { id: 'matrix', name: 'Matrix', description: 'Estilo matrix verde' },
  { id: 'ocean', name: 'Ocean', description: 'Azul oceânico' }
]

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('quantum:theme') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme)
      localStorage.setItem('quantum:theme', currentTheme)
    }
  }, [currentTheme])

  return (
    <div className="rounded-lg p-4 bg-bg-card border border-slate-800">
      <div className="text-sm font-medium mb-3">Theme Settings</div>
      <div className="space-y-2">
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => setCurrentTheme(theme.id)}
            className={`w-full text-left p-3 rounded transition-colors ${
              currentTheme === theme.id
                ? 'bg-primary/20 border border-primary text-primary'
                : 'bg-slate-900/20 border border-slate-800 hover:border-primary/50 text-slate-200'
            }`}
          >
            <div className="font-medium">{theme.name}</div>
            <div className="text-xs opacity-70">{theme.description}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs text-slate-400">
        Current theme: <span className="text-primary">{currentTheme}</span>
      </div>
    </div>
  )
}
