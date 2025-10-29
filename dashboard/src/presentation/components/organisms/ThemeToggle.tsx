'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    // Default to light theme if no preference saved
    const shouldBeDark = savedTheme === 'dark' || (savedTheme !== 'light' && prefersDark)
    setIsDark(shouldBeDark)

    // Apply theme (default to light if no saved preference)
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    applyTheme(initialDark)

    // If no saved theme, save light as default
    if (!savedTheme) {
      localStorage.setItem('theme', 'light')
    }
  }, [])

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement

    if (dark) {
      // Apply dark theme by adding dark class
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      // Apply light theme by removing dark class
      root.classList.remove('dark')
      root.classList.add('light')

      // Ensure light theme variables are set
      root.style.setProperty('--background', '#ffffff')
      root.style.setProperty('--foreground', '#111827')
      root.style.setProperty('--surface', '#f9fafb')
      root.style.setProperty('--surface-hover', '#f3f4f6')
      root.style.setProperty('--border', '#e5e7eb')
      root.style.setProperty('--border-hover', '#d1d5db')
      root.style.setProperty('--text-primary', '#111827')
      root.style.setProperty('--text-secondary', '#6b7280')
      root.style.setProperty('--text-muted', '#9ca3af')
      root.style.setProperty('--bg-gradient-start', '#eff6ff')
      root.style.setProperty('--bg-gradient-end', '#dbeafe')
      root.style.setProperty('--status-success-bg', '#f0fdf4')
      root.style.setProperty('--status-success-text', '#16a34a')
      root.style.setProperty('--status-warning-bg', '#fffbeb')
      root.style.setProperty('--status-warning-text', '#d97706')
      root.style.setProperty('--status-error-bg', '#fef2f2')
      root.style.setProperty('--status-error-text', '#dc2626')
      root.style.setProperty('--chart-primary', '#3b82f6')
      root.style.setProperty('--chart-error', '#ef4444')
      root.style.setProperty('--chart-warning', '#f59e0b')
      root.style.setProperty('--chart-success', '#10b981')
      root.style.setProperty('--chart-grid', '#e5e7eb')
      root.style.setProperty('--chart-text', '#374151')
    }
  }

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    applyTheme(newIsDark)

    // Save preference
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  // Clear any existing dark theme preference for new users
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      localStorage.removeItem('theme')
    }
  }, [])

  return (
    <button
      onClick={toggleTheme}
      className="btn-secondary"
      style={{
        position: 'fixed',
        top: 'var(--space-lg)',
        right: 'var(--space-lg)',
        zIndex: 40,
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem'
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-primary)' }} />
      ) : (
        <Moon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-primary)' }} />
      )}
    </button>
  )
}
