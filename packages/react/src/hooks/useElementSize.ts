import type { RefObject } from 'react'
import { useLayoutEffect, useState } from 'react'

interface ElementSize {
  width: number
  height: number
}

export function useElementSize<T extends HTMLElement>(ref: RefObject<T>): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element)
      return

    const update = () => {
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      })
    }

    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => {
        window.removeEventListener('resize', update)
      }
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry)
        return
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return size
}
