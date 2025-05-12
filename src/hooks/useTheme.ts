import { useEffect, useState } from 'react'
import { getStorageData, setStorageData } from '@/shared/store'
export function useTheme() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = getStorageData('theme')
    if (stored === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const isNowDark = e.newValue === 'dark'
        setIsDark(isNowDark)
        document.documentElement.classList.toggle('dark', isNowDark)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, []) 

  const toggleTheme = () => {
    setIsDark(prev => {
      const newDark = !prev
      setStorageData('theme', newDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', newDark)
      return newDark
    })
  }

  return { isDark, toggleTheme }
}
