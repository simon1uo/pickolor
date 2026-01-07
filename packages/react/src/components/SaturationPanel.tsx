import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'
import { clamp, formatColor } from '@pickolor/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useColorControlContext } from '../context/color'
import { useElementSize } from '../hooks/useElementSize'
import { useThrottleFn } from '../hooks/useThrottleFn'

export interface SaturationPanelProps {
  disabled?: boolean
  width?: number | string
  height?: number | string
}

export function SaturationPanel({
  disabled = false,
  width,
  height,
}: SaturationPanelProps) {
  const context = useColorControlContext()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLSpanElement | null>(null)
  const isDragDisabled = disabled || !context
  const [isDragging, setIsDragging] = useState(false)
  const { width: panelWidth, height: panelHeight } = useElementSize(panelRef)
  const { width: thumbWidth, height: thumbHeight } = useElementSize(thumbRef)

  const saturation = context?.model?.s ?? 0
  const value = context?.model?.v ?? 0
  const hue = clamp(context?.model?.h ?? 0, 0, 360)

  const panelBackground = useMemo(() => {
    let hueColor = '#ff0000'
    try {
      hueColor = formatColor(
        { h: hue, s: 1, v: 1, a: 1, format: 'hex', source: '' },
        { target: 'hex', precision: 0, includeAlpha: false },
      )
    }
    catch {
      hueColor = '#ff0000'
    }
    return `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`
  }, [hue])

  const thumbColor = useMemo(() => {
    let color = '#ff0000'
    try {
      color = formatColor(
        { h: hue, s: saturation, v: value, a: 1, format: 'hex', source: '' },
        { target: 'hex', precision: 0, includeAlpha: false },
      )
    }
    catch {
      color = '#ff0000'
    }
    return color
  }, [hue, saturation, value])

  const panelStyle = useMemo<CSSProperties>(() => {
    const resolvedWidth = typeof width === 'number' ? `${width}px` : width
    const resolvedHeight = typeof height === 'number' ? `${height}px` : height
    return {
      background: panelBackground,
      touchAction: 'none',
      ...(resolvedWidth ? { width: resolvedWidth } : null),
      ...(resolvedHeight ? { height: resolvedHeight } : null),
    }
  }, [width, height, panelBackground])

  const resolvePointerPosition = useCallback((event: MouseEvent | PointerEvent) => {
    const panel = panelRef.current
    if (!panel)
      return null
    const rect = panel.getBoundingClientRect()
    if (!rect.width || !rect.height)
      return null
    const x = clamp(Math.round(event.clientX - rect.left), 0, rect.width)
    const y = clamp(Math.round(event.clientY - rect.top), 0, rect.height)
    return {
      s: x / rect.width,
      v: 1 - y / rect.height,
    }
  }, [])

  const applySaturationValue = useThrottleFn((nextS: number, nextV: number) => {
    if (!context)
      return
    const base = context.model
    if (!base)
      return
    const safeS = clamp(nextS, 0, 1)
    const safeV = clamp(nextV, 0, 1)
    if (base.s === safeS && base.v === safeV)
      return
    context.setModel({
      ...base,
      s: safeS,
      v: safeV,
    })
  }, 16)

  const updateFromPointer = useCallback((event: MouseEvent | PointerEvent) => {
    const next = resolvePointerPosition(event)
    if (!next)
      return
    applySaturationValue(next.s, next.v)
  }, [resolvePointerPosition, applySaturationValue])

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isDragDisabled)
      return
    updateFromPointer(event.nativeEvent)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDragDisabled)
      return
    event.preventDefault()
    panelRef.current?.setPointerCapture(event.pointerId)
    setIsDragging(true)
    updateFromPointer(event.nativeEvent)
  }

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!isDragging || isDragDisabled)
      return
    event.preventDefault()
    updateFromPointer(event)
  }, [isDragging, isDragDisabled, updateFromPointer])

  const stopDragging = useCallback((event: PointerEvent) => {
    if (!isDragging)
      return
    if (panelRef.current?.hasPointerCapture(event.pointerId))
      panelRef.current?.releasePointerCapture(event.pointerId)
    setIsDragging(false)
  }, [isDragging])

  useEffect(() => {
    if (!isDragging)
      return
    const handleMove = (event: PointerEvent) => handlePointerMove(event)
    const handleUp = (event: PointerEvent) => stopDragging(event)
    const handleCancel = (event: PointerEvent) => stopDragging(event)

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleCancel)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleCancel)
    }
  }, [isDragging, handlePointerMove, stopDragging])

  const thumbStyle = useMemo<CSSProperties>(() => {
    const halfWidth = (thumbWidth || 0) / 2
    const halfHeight = (thumbHeight || 0) / 2
    const top = Math.round((1 - value) * panelHeight - halfHeight)
    const left = Math.round(saturation * panelWidth - halfWidth)

    return {
      left: `${left}px`,
      top: `${top}px`,
      background: thumbColor,
    }
  }, [panelHeight, panelWidth, saturation, value, thumbColor, thumbWidth, thumbHeight])

  return (
    <div
      ref={panelRef}
      className="pickolor-saturation-panel"
      data-disabled={disabled ? 'true' : 'false'}
      style={panelStyle}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      <span ref={thumbRef} className="pickolor-saturation-thumb" style={thumbStyle} />
    </div>
  )
}
