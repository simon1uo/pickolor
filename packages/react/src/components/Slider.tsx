import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { clamp, formatColor } from '@pickolor/core'
import { useCallback, useMemo, useRef } from 'react'
import { useColorControlContext } from '../context/color'
import { useElementSize } from '../hooks/useElementSize'
import { useThrottleFn } from '../hooks/useThrottleFn'

export interface SliderProps {
  modelValue?: number
  value?: number
  type?: 'alpha' | 'hue'
  min?: number
  max?: number
  step?: number
  vertical?: boolean
  disabled?: boolean
  onInput?: (value: number) => void
  onChange?: (value: number) => void
  onUpdateModelValue?: (value: number) => void
}

export function Slider({
  modelValue,
  value,
  type,
  min = 0,
  max = 100,
  step = 1,
  vertical = false,
  disabled = false,
  onInput,
  onChange,
  onUpdateModelValue,
}: SliderProps) {
  const context = useColorControlContext()
  const trackRef = useRef<HTMLDivElement | null>(null)
  const isVertical = vertical === true
  const isDragDisabled = disabled
  const { width: trackWidth, height: trackHeight } = useElementSize(trackRef)

  const currentValue = useMemo(() => {
    if (modelValue !== undefined)
      return modelValue
    if (value !== undefined)
      return value
    return min
  }, [modelValue, value, min])

  const valueRange = max - min

  const normalizedRatio = useMemo(() => {
    if (valueRange <= 0)
      return 0
    return clamp((currentValue - min) / valueRange, 0, 1)
  }, [currentValue, min, valueRange])

  const fallbackModel = useMemo(() => ({
    h: 0,
    s: 1,
    v: 1,
    a: 1,
    format: 'hex' as const,
    source: '',
  }), [])

  const baseModel = context?.model ?? fallbackModel

  const alphaStops = useMemo(() => {
    const base = baseModel
    try {
      const start = formatColor(
        { ...base, a: 0 },
        { target: 'rgba', precision: 3, includeAlpha: true },
      )
      const end = formatColor(
        { ...base, a: 1 },
        { target: 'rgba', precision: 3, includeAlpha: true },
      )
      return { start, end }
    }
    catch {
      return { start: 'rgba(255, 0, 0, 0)', end: 'rgba(255, 0, 0, 1)' }
    }
  }, [baseModel])

  const thumbColor = useMemo(() => {
    if (type === 'alpha') {
      try {
        return formatColor(
          { ...baseModel, a: clamp(currentValue, 0, 1) },
          { target: 'rgba', precision: 3, includeAlpha: true },
        )
      }
      catch {
        return 'rgba(255, 0, 0, 1)'
      }
    }

    if (type === 'hue') {
      try {
        return formatColor(
          {
            h: clamp(currentValue, 0, 360),
            s: 1,
            v: 1,
            a: 1,
            format: 'hex',
            source: '',
          },
          { target: 'hex', precision: 0, includeAlpha: false },
        )
      }
      catch {
        return '#ff0000'
      }
    }

    return 'var(--pickolor-accent)'
  }, [type, baseModel, currentValue])

  const gradientStyle = useMemo<CSSProperties>(() => {
    const direction = isVertical ? 'to top' : 'to right'
    if (type === 'hue') {
      return {
        background: `linear-gradient(${direction}, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)`,
      }
    }
    if (type === 'alpha') {
      return {
        background: `linear-gradient(${direction}, ${alphaStops.start}, ${alphaStops.end})`,
      }
    }
    return {}
  }, [type, isVertical, alphaStops])

  const thumbStyle = useMemo<CSSProperties>(() => {
    const width = trackWidth || 0
    const height = trackHeight || 0
    const ratio = normalizedRatio
    const x = ratio * width
    const y = (1 - ratio) * height
    if (isVertical) {
      return {
        left: '50%',
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        background: thumbColor,
      }
    }
    return {
      left: `${x}px`,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      background: thumbColor,
    }
  }, [trackWidth, trackHeight, normalizedRatio, isVertical, thumbColor])

  const trackStyle = useMemo<CSSProperties>(() => ({
    touchAction: 'none',
  }), [])

  const applyStep = useCallback((value: number) => {
    if (!step || step <= 0)
      return value
    const precision = step.toString().split('.')[1]?.length ?? 0
    const stepped = Math.round((value - min) / step) * step + min
    return Number(stepped.toFixed(precision))
  }, [min, step])

  const normalizeValue = useCallback((value: number) => {
    return clamp(applyStep(value), min, max)
  }, [applyStep, min, max])

  const emitInputValue = useCallback((value: number) => {
    const next = normalizeValue(value)
    onUpdateModelValue?.(next)
    onInput?.(next)
  }, [normalizeValue, onInput, onUpdateModelValue])

  const emitChangeValue = useCallback((value: number) => {
    const next = normalizeValue(value)
    onUpdateModelValue?.(next)
    onChange?.(next)
  }, [normalizeValue, onChange, onUpdateModelValue])

  const resolvePointerValue = useCallback((event: PointerEvent) => {
    const track = trackRef.current
    if (!track)
      return null
    const rect = track.getBoundingClientRect()
    if (!rect.width || !rect.height)
      return null
    if (valueRange <= 0)
      return min
    if (isVertical) {
      const y = clamp(event.clientY - rect.top, 0, rect.height)
      const ratio = 1 - y / rect.height
      return min + ratio * valueRange
    }
    const x = clamp(event.clientX - rect.left, 0, rect.width)
    const ratio = x / rect.width
    return min + ratio * valueRange
  }, [isVertical, min, valueRange])

  const applyInput = useThrottleFn((next: number) => {
    emitInputValue(next)
  }, 16)

  const updateFromPointer = useCallback((event: PointerEvent, commitChange = false, immediate = false) => {
    const next = resolvePointerValue(event)
    if (next === null)
      return
    if (commitChange)
      emitChangeValue(next)
    else if (immediate)
      emitInputValue(next)
    else
      applyInput(next)
  }, [resolvePointerValue, emitChangeValue, emitInputValue, applyInput])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDragDisabled)
      return
    event.preventDefault()
    trackRef.current?.setPointerCapture(event.pointerId)
    updateFromPointer(event.nativeEvent, false, true)
  }, [isDragDisabled, updateFromPointer])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDragDisabled)
      return
    if (!trackRef.current?.hasPointerCapture(event.pointerId))
      return
    updateFromPointer(event.nativeEvent)
  }, [isDragDisabled, updateFromPointer])

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDragDisabled)
      return
    if (!trackRef.current?.hasPointerCapture(event.pointerId))
      return
    trackRef.current?.releasePointerCapture(event.pointerId)
    updateFromPointer(event.nativeEvent, true)
  }, [isDragDisabled, updateFromPointer])

  const handleKeydown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled)
      return
    const isDecrease = isVertical
      ? event.key === 'ArrowDown'
      : event.key === 'ArrowLeft'
    const isIncrease = isVertical
      ? event.key === 'ArrowUp'
      : event.key === 'ArrowRight'
    if (!isDecrease && !isIncrease)
      return
    event.preventDefault()
    const direction = isIncrease ? 1 : -1
    const next = currentValue + step * direction
    emitInputValue(next)
    emitChangeValue(next)
  }, [disabled, isVertical, currentValue, step, emitInputValue, emitChangeValue])

  return (
    <div
      className="pickolor-slider"
      data-vertical={isVertical ? 'true' : 'false'}
      data-variant={type ?? undefined}
      data-disabled={disabled ? 'true' : 'false'}
    >
      <div
        ref={trackRef}
        className="pickolor-slider-track"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        style={trackStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeydown}
      >
        {type === 'alpha' && <span className="pickolor-slider-layer pickolor-slider-checker" />}
        <span className="pickolor-slider-layer pickolor-slider-gradient" style={gradientStyle} />
        <span className="pickolor-slider-thumb" style={thumbStyle} />
      </div>
    </div>
  )
}
