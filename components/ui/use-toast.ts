import { useState, useCallback } from 'react'

interface Toast {
  id: number
  variant?: 'default' | 'destructive'
  title?: string
  description: string
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random()
    const newToast: Toast = { id, title, description, variant }
    setToasts(prev => [...prev, newToast])

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  return { toast, toasts }
}

export type { Toast }
