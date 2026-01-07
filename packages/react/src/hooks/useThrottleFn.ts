import { useCallback, useEffect, useRef } from 'react'

export function useThrottleFn<T extends (...args: any[]) => void>(fn: T, wait = 16): T {
  const fnRef = useRef(fn)
  const lastRunRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const throttled = useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    const elapsed = now - lastRunRef.current

    if (elapsed >= wait) {
      lastRunRef.current = now
      fnRef.current(...args)
      return
    }

    if (timerRef.current !== null)
      return

    const remaining = wait - elapsed
    timerRef.current = setTimeout(() => {
      lastRunRef.current = Date.now()
      timerRef.current = null
      fnRef.current(...args)
    }, remaining)
  }, [wait]) as T

  return throttled
}
