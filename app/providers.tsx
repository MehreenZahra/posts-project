'use client'

import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme-preference"
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
} 