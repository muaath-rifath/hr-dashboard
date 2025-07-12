'use client'

import { useState, useEffect } from 'react'
import { IconWifi, IconWifiOff, IconLoader } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { isBackendEnabled } from '@/lib/config'

interface APIStatusProps {
  className?: string
}

type ConnectionStatus = 'checking' | 'connected' | 'dummyjson' | 'disconnected' | 'error'

export function APIStatus({ className }: APIStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>('checking')
  const [backendUrl, setBackendUrl] = useState<string>('')
  const dummyUrl = 'https://dummyjson.com/users?limit=1'

  useEffect(() => {
    const checkAPIStatus = async () => {
      // If backend is disabled, skip backend check
      if (!isBackendEnabled()) {
        console.log('[APIStatus] Backend disabled, checking DummyJSON only')
        setStatus('checking')
        
        try {
          console.log('[APIStatus] Checking DummyJSON:', dummyUrl)
          const dummyRes = await fetch(dummyUrl, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
          })
          if (dummyRes.ok) {
            setStatus('dummyjson')
            console.log('[APIStatus] DummyJSON connected')
            return
          } else {
            setStatus('error')
            console.log('[APIStatus] DummyJSON not ok:', dummyRes.status)
          }
        } catch (error) {
          setStatus('disconnected')
          console.log('[APIStatus] DummyJSON check failed:', error)
        }
        return
      }

      // Backend is enabled, check both
      try {
        setStatus('checking')
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
        setBackendUrl(apiUrl)
        // Try backend health
        console.log('[APIStatus] Checking backend:', apiUrl)
        const response = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        })
        if (response.ok) {
          setStatus('connected')
          console.log('[APIStatus] Backend connected')
          return
        } else {
          console.log('[APIStatus] Backend health not ok:', response.status)
        }
      } catch (error) {
        console.log('[APIStatus] Backend health check failed:', error)
      }
      // Try DummyJSON
      try {
        setStatus('checking')
        console.log('[APIStatus] Checking DummyJSON:', dummyUrl)
        const dummyRes = await fetch(dummyUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        })
        if (dummyRes.ok) {
          setStatus('dummyjson')
          console.log('[APIStatus] DummyJSON connected')
          return
        } else {
          setStatus('error')
          console.log('[APIStatus] DummyJSON not ok:', dummyRes.status)
        }
      } catch (error) {
        setStatus('disconnected')
        console.log('[APIStatus] DummyJSON check failed:', error)
      }
    }
    checkAPIStatus()
  }, [dummyUrl])

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return {
          icon: IconLoader,
          text: 'Checking API...',
          className: 'text-blue-500 animate-spin'
        }
      case 'connected':
        return {
          icon: IconWifi,
          text: 'Backend Connected',
          className: 'text-green-500'
        }
      case 'dummyjson':
        return {
          icon: IconWifi,
          text: isBackendEnabled() ? 'Using DummyJSON (Backend Unavailable)' : 'Using DummyJSON',
          className: 'text-yellow-500'
        }
      case 'disconnected':
        return {
          icon: IconWifiOff,
          text: 'No API Available',
          className: 'text-red-500'
        }
      case 'error':
        return {
          icon: IconWifiOff,
          text: 'API Error',
          className: 'text-red-500'
        }
      default:
        return {
          icon: IconWifiOff,
          text: 'Unknown',
          className: 'text-gray-500'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-sm',
      className
    )}>
      <Icon className={cn('w-4 h-4', config.className)} />
      <span className="text-gray-600 dark:text-gray-300">{config.text}</span>
      {backendUrl && status !== 'dummyjson' && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          ({backendUrl})
        </span>
      )}
      {status === 'dummyjson' && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          (DummyJSON)
        </span>
      )}
    </div>
  )
} 