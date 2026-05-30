
import { useEffect } from 'react'
import { securityMonitor } from '@/utils/securityEnhancements'

interface SecurityProviderProps {
  children: React.ReactNode
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  useEffect(() => {
    // Set enhanced security headers (only those valid via <meta>)
    // X-Frame-Options and Strict-Transport-Security are IGNORED in <meta> by browsers —
    // they must be sent as HTTP headers. We use CSP frame-ancestors instead for clickjacking.
    const setSecurityHeaders = () => {
      // Content Security Policy — frame-ancestors replaces X-Frame-Options
      const cspMeta = document.createElement('meta')
      cspMeta.httpEquiv = 'Content-Security-Policy'
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net https://*.lovable.app https://*.lovable.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; connect-src 'self' https://rrlwabtzwvurhhfwpmiq.supabase.co wss://rrlwabtzwvurhhfwpmiq.supabase.co https://api.pwnedpasswords.com https://*.lovable.dev https://*.lovable.app; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; media-src 'self' https: blob:; frame-src 'self' https://lovable.app https://*.lovable.app https://*.lovable.dev; frame-ancestors 'self' https://*.lovable.app https://*.lovable.dev; worker-src 'self' blob:; upgrade-insecure-requests;"
      document.head.appendChild(cspMeta)

      // X-Content-Type-Options (valid in <meta>)
      const noSniffMeta = document.createElement('meta')
      noSniffMeta.httpEquiv = 'X-Content-Type-Options'
      noSniffMeta.content = 'nosniff'
      document.head.appendChild(noSniffMeta)

      // Referrer Policy (valid in <meta>)
      const referrerMeta = document.createElement('meta')
      referrerMeta.name = 'referrer'
      referrerMeta.content = 'strict-origin-when-cross-origin'
      document.head.appendChild(referrerMeta)

      // Permissions Policy (valid in <meta> in modern browsers)
      const permissionsMeta = document.createElement('meta')
      permissionsMeta.httpEquiv = 'Permissions-Policy'
      permissionsMeta.content = 'camera=(), microphone=(), geolocation=()'
      document.head.appendChild(permissionsMeta)
    }

    setSecurityHeaders()

    // Enhanced security event listeners
    const handleContextMenu = (e: MouseEvent) => {
      // Allow context menu in development
      if (import.meta.env.DEV) return
      
      securityMonitor.trackSuspiciousActivity('Context menu access attempt', {
        target: (e.target as HTMLElement)?.tagName,
        timestamp: Date.now()
      }, 'low')
      e.preventDefault()
    }

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.hasAttribute('data-sensitive')) {
        securityMonitor.trackSuspiciousActivity('Attempt to drag sensitive element', {
          element: target.tagName,
          hasSensitiveData: target.hasAttribute('data-sensitive')
        }, 'medium')
        e.preventDefault()
      }
    }

    // Enhanced keyboard shortcut protection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (import.meta.env.DEV) return
      
      const suspiciousKeys = [
        'F12',
        (e.ctrlKey && e.shiftKey && e.key === 'I'), // DevTools
        (e.ctrlKey && e.key === 'u'), // View source
        (e.ctrlKey && e.shiftKey && e.key === 'C'), // DevTools console
        (e.ctrlKey && e.shiftKey && e.key === 'J'), // DevTools console (alternative)
      ]
      
      if (suspiciousKeys.some(condition => condition === true || condition === e.key)) {
        securityMonitor.trackSuspiciousActivity('Developer tools access attempt', {
          key: e.key,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey
        }, 'low')
        e.preventDefault()
      }
    }

    // Monitor for console access attempts
    const handleConsoleAccess = () => {
      if (import.meta.env.DEV) return
      
      securityMonitor.trackSuspiciousActivity('Console access detected', {
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }, 'medium')
    }

    // Detect DevTools opening (works in some browsers)
    const detectDevTools = () => {
      if (import.meta.env.DEV) return
      
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        securityMonitor.trackSuspiciousActivity('DevTools potentially opened', {
          outerWidth: window.outerWidth,
          innerWidth: window.innerWidth,
          outerHeight: window.outerHeight,
          innerHeight: window.innerHeight
        }, 'low')
      }
    }

    // Monitor for suspicious network activity
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const url = args[0]?.toString() || ''
      
      // Monitor for suspicious external requests
      if (!url.includes('supabase.co') && !url.includes(window.location.hostname)) {
        securityMonitor.trackSuspiciousActivity('External API call detected', {
          url: url.slice(0, 100),
          origin: window.location.origin
        }, 'low')
      }
      
      return originalFetch(...args)
    }

    // Set up event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', detectDevTools)
    
    // Override console methods in production to detect usage
    if (!import.meta.env.DEV) {
      const originalLog = console.log
      console.log = (...args) => {
        handleConsoleAccess()
        originalLog(...args)
      }
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', detectDevTools)
      
      // Restore original fetch
      window.fetch = originalFetch
    }
  }, [])

  return <>{children}</>
}
