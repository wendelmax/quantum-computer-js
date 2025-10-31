import React, { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CircuitPrefsProvider } from './CircuitPrefs'

export default function QuantumShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
  }

  const clearCircuit = () => {
    localStorage.removeItem('quantum:circuit')
    localStorage.removeItem('quantum:loadCircuit')
    window.dispatchEvent(new CustomEvent('quantum:clear-circuit'))
    navigate('/')
  }

  return (
    <CircuitPrefsProvider>
      <div className="min-h-screen bg-bg text-slate-100 p-6 font-sans">
        <div className="max-w-[1200px] mx-auto rounded-2xl overflow-hidden shadow-2xl bg-bg-card">
          {!focusMode && (
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-bg/40">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-slate-900/40 flex items-center justify-center">
                  <svg width="20" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#9bd3ff" strokeWidth="1.2" />
                    <rect x="6" y="9" width="6" height="2" rx="0.5" fill="#9bd3ff" />
                  </svg>
                </div>
                <Link to="/" className="text-xl font-semibold tracking-wide hover:text-sky-300 transition-colors">Quantum Computer JS</Link>
                <span className="ml-3 px-2 py-0.5 text-xs bg-slate-800 rounded-md text-slate-300">demo</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <a
                  href="https://github.com/wendelmax/quantum-computer-js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:bg-slate-800/40 transition-colors text-slate-300 hover:text-sky-300"
                  title="View on GitHub"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded hover:bg-slate-800/40 hover:text-sky-300 transition-colors"
                  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  _
                </button>
                <button
                  onClick={toggleFocusMode}
                  className="p-2 rounded hover:bg-slate-800/40 hover:text-sky-300 transition-colors"
                  title={focusMode ? "Exit focus mode" : "Enter focus mode"}
                >
                  ▢
                </button>
                <button
                  onClick={clearCircuit}
                  className="p-2 rounded hover:bg-slate-800/40 hover:text-red-400 transition-colors"
                  title="Clear circuit and go to home"
                >
                  ✕
                </button>
              </div>
            </header>
          )}

          {focusMode && (
            <div className="absolute top-2 right-2 z-50">
              <button
                onClick={toggleFocusMode}
                className="p-2 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors"
                title="Exit focus mode"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          )}

          <div className={`grid gap-6 p-6 ${focusMode ? 'grid-cols-1' : sidebarCollapsed ? 'grid-cols-12' : 'grid-cols-12'}`}>
            {!focusMode && !sidebarCollapsed && (
              <aside className="col-span-2 bg-transparent">
              <nav className="flex flex-col gap-2">
                <NavLink to="/circuits" className={({ isActive }) => `text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`}>
                  <span className="w-8 h-8 rounded-md bg-slate-900/40 flex items-center justify-center text-sm text-sky-300">🧪</span>
                  <span className="text-sm">Quantum Studio</span>
                </NavLink>
                <NavLink to="/algorithms" className={({ isActive }) => `text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`}>
                  <span className="w-8 h-8 rounded-md bg-slate-900/40 flex items-center justify-center text-sm text-sky-300">📈</span>
                  <span className="text-sm">Algorithms</span>
                </NavLink>
                <NavLink to="/data-lab" className={({ isActive }) => `text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`}>
                  <span className="w-8 h-8 rounded-md bg-slate-900/40 flex items-center justify-center text-sm text-sky-300">📊</span>
                  <span className="text-sm">Data Explorer</span>
                </NavLink>
                <NavLink to="/state-viewer" className={({ isActive }) => `text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`}>
                  <span className="w-8 h-8 rounded-md bg-slate-900/40 flex items-center justify-center text-sm text-sky-300">🌐</span>
                  <span className="text-sm">State Viewer</span>
                </NavLink>
                <NavLink to="/gates" className={({ isActive }) => `text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`}>
                  <span className="w-8 h-8 rounded-md bg-slate-900/40 flex items-center justify-center text-sm text-sky-300">#</span>
                  <span className="text-sm">Gates Library</span>
                </NavLink>
                <NavLink to="/oracles" className={({ isActive }) => `text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`}>
                  <span className="w-8 h-8 rounded-md bg-slate-900/40 flex items-center justify-center text-sm text-sky-300">🔮</span>
                  <span className="text-sm">Oracles</span>
                </NavLink>
                <NavLink to="/docs" className={({ isActive }) => `text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`}>
                  <span className="w-8 h-8 rounded-md bg-slate-900/40 flex items-center justify-center text-sm text-sky-300">📄</span>
                  <span className="text-sm">Documentation</span>
                </NavLink>
                <NavLink to="/api" className={({ isActive }) => `text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`}>
                  <span className="w-8 h-8 rounded-md bg-slate-900/40 flex items-center justify-center text-sm text-sky-300">⚡</span>
                  <span className="text-sm">API Terminal</span>
                </NavLink>
              </nav>
              </aside>
            )}

            {!focusMode && sidebarCollapsed && (
              <aside className="col-span-1 bg-transparent">
                <nav className="flex flex-col gap-2">
                  <NavLink to="/circuits" className={({ isActive }) => `text-left flex items-center justify-center px-2 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`} title="Quantum Studio">
                    <span className="text-sm text-sky-300">🧪</span>
                  </NavLink>
                  <NavLink to="/algorithms" className={({ isActive }) => `text-left flex items-center justify-center px-2 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`} title="Algorithms">
                    <span className="text-sm text-sky-300">📈</span>
                  </NavLink>
                  <NavLink to="/data-lab" className={({ isActive }) => `text-left flex items-center justify-center px-2 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`} title="Data Explorer">
                    <span className="text-sm text-sky-300">📊</span>
                  </NavLink>
                  <NavLink to="/state-viewer" className={({ isActive }) => `text-left flex items-center justify-center px-2 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`} title="State Viewer">
                    <span className="text-sm text-sky-300">🌐</span>
                  </NavLink>
                  <NavLink to="/gates" className={({ isActive }) => `text-left flex items-center justify-center px-2 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`} title="Gates Library">
                    <span className="text-sm text-sky-300">#</span>
                  </NavLink>
                  <NavLink to="/oracles" className={({ isActive }) => `text-left flex items-center justify-center px-2 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`} title="Oracles">
                    <span className="text-sm text-sky-300">🔮</span>
                  </NavLink>
                  <NavLink to="/docs" className={({ isActive }) => `text-left flex items-center justify-center px-2 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`} title="Documentation">
                    <span className="text-sm text-sky-300">📄</span>
                  </NavLink>
                  <NavLink to="/api" className={({ isActive }) => `text-left flex items-center justify-center px-2 py-2 rounded-lg hover:bg-slate-800/30 transition-all ${isActive ? 'text-primary' : ''}`} title="API Terminal">
                    <span className="text-sm text-sky-300">⚡</span>
                  </NavLink>
                </nav>
              </aside>
            )}

            <main className={focusMode ? 'col-span-1' : sidebarCollapsed ? 'col-span-11' : 'col-span-10'}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </CircuitPrefsProvider>
  )
}

