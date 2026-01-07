import type { ColorError, ColorModel, FormatRequest, FormatType } from '@pickolor/core'
import type { ChangeEvent, CSSProperties, FocusEvent, KeyboardEvent } from 'react'
import type { ColorChannel } from './context/color'
import type { PopoverProps } from './hooks/usePopover'
import { clamp, formatColor, parseColor } from '@pickolor/core'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlphaSlider } from './components/AlphaSlider'
import { HueSlider } from './components/HueSlider'
import { SaturationPanel } from './components/SaturationPanel'
import { ColorControlContext } from './context/color'
import { usePopover } from './hooks/usePopover'

export interface ColorPickerProps {
  modelValue?: string
  value?: string
  defaultValue?: string
  target?: FormatType
  precision?: FormatRequest['precision']
  includeAlpha?: FormatRequest['includeAlpha']
  popoverProps?: PopoverProps
  onChange?: (payload: { value: string, formatted: string, model: ColorModel | null }) => void
  onError?: (error: ColorError) => void
}

function resolveAttachTarget(attach: PopoverProps['attach']): HTMLElement | null {
  if (typeof document === 'undefined')
    return null
  if (!attach)
    return document.body
  if (typeof attach === 'string')
    return document.querySelector(attach) ?? document.body
  return attach
}

export function ColorPicker({
  modelValue,
  value,
  defaultValue = '',
  target = 'hex',
  precision,
  includeAlpha = true,
  popoverProps,
  onChange,
  onError,
}: ColorPickerProps) {
  const popoverId = useId()
  const referenceRef = useRef<HTMLInputElement | null>(null)
  const floatingRef = useRef<HTMLDivElement | null>(null)
  const isPointerDownInside = useRef(false)

  const {
    open,
    setOpen,
    floatingStyles,
    resolvedPlacement,
    attach,
    zIndex,
    transitionDelay,
    setReference,
    setFloating,
  } = usePopover({
    referenceRef,
    floatingRef,
    popoverProps,
  })

  const [isPopoverRendered, setIsPopoverRendered] = useState(open)

  useEffect(() => {
    if (open) {
      let cancelled = false
      queueMicrotask(() => {
        if (cancelled)
          return
        setIsPopoverRendered(true)
      })
      return () => {
        cancelled = true
      }
    }
    const timer = window.setTimeout(() => {
      setIsPopoverRendered(false)
    }, transitionDelay)
    return () => {
      window.clearTimeout(timer)
    }
  }, [open, transitionDelay])

  const portalRoot = useMemo(() => resolveAttachTarget(attach), [attach])

  const isValueControlled = modelValue !== undefined || value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const currentValue = modelValue !== undefined
    ? modelValue
    : value !== undefined
      ? value
      : internalValue

  const formatRequest = useMemo<FormatRequest>(() => ({
    target,
    precision,
    includeAlpha,
  }), [target, precision, includeAlpha])

  const [modelState, setModelState] = useState<ColorModel | null>(null)
  const modelStateRef = useRef<ColorModel | null>(null)
  const [lastValidModel, setLastValidModel] = useState<ColorModel | null>(null)
  const lastNotifiedErrorRef = useRef<ColorError | null>(null)
  const lastEmittedValueRef = useRef<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    modelStateRef.current = modelState
  }, [modelState])

  const notifyError = useCallback((error: ColorError | null) => {
    if (!error) {
      lastNotifiedErrorRef.current = null
      return
    }
    if (lastNotifiedErrorRef.current === error)
      return
    lastNotifiedErrorRef.current = error
    onError?.(error)
  }, [onError])

  const stabilizeModel = useCallback((nextModel: ColorModel): ColorModel => {
    const base = modelStateRef.current ?? lastValidModel ?? nextModel
    if (nextModel.v === 0)
      return nextModel
    if (nextModel.s === 0)
      return { ...nextModel, h: base.h }
    return nextModel
  }, [lastValidModel])

  const formatModel = useCallback((nextModel: ColorModel): string => {
    return formatColor(nextModel, formatRequest)
  }, [formatRequest])

  const syncOutput = useCallback((formatted: string, model: ColorModel | null, shouldEmit: boolean) => {
    if (!isValueControlled)
      setInternalValue(formatted)
    setInputValue(formatted)
    if (!shouldEmit)
      return
    lastEmittedValueRef.current = formatted
    onChange?.({ value: formatted, formatted, model })
  }, [isValueControlled, onChange])

  const applyModel = useCallback((nextModel: ColorModel, shouldEmit = true) => {
    try {
      const stabilized = stabilizeModel(nextModel)
      const formatted = formatModel(stabilized)
      setModelState(stabilized)
      setLastValidModel(stabilized)
      syncOutput(formatted, stabilized, shouldEmit)
    }
    catch (error) {
      notifyError(error as ColorError)
    }
  }, [formatModel, notifyError, stabilizeModel, syncOutput])

  const getBaseModel = useCallback((): ColorModel => {
    const fromState = modelStateRef.current
    if (fromState)
      return fromState
    if (lastValidModel)
      return lastValidModel
    return {
      h: 0,
      s: 0,
      v: 0,
      a: 1,
      format: target,
      source: currentValue,
    }
  }, [currentValue, lastValidModel, target])

  const setModel = useCallback((nextModel: ColorModel) => {
    applyModel(nextModel)
  }, [applyModel])

  const setChannel = useCallback((channel: ColorChannel, value: number) => {
    const base = getBaseModel()
    const nextValue = channel === 'h' ? clamp(value, 0, 360) : clamp(value, 0, 1)
    const nextModel: ColorModel = {
      ...base,
      [channel]: nextValue,
    }
    applyModel(nextModel)
  }, [applyModel, getBaseModel])

  const modelForContext = useMemo(() => {
    if (modelState)
      return modelState
    if (lastValidModel)
      return lastValidModel
    return {
      h: 0,
      s: 0,
      v: 0,
      a: 1,
      format: target,
      source: currentValue,
    }
  }, [modelState, lastValidModel, target, currentValue])

  const controlContextValue = useMemo(() => ({
    model: modelForContext,
    target,
    precision,
    includeAlpha,
    setModel,
    setChannel,
  }), [modelForContext, target, precision, includeAlpha, setModel, setChannel])

  useEffect(() => {
    const model = modelStateRef.current ?? lastValidModel
    if (!model)
      return
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled)
        return
      applyModel(model, false)
    })
    return () => {
      cancelled = true
    }
  }, [formatRequest, applyModel, lastValidModel])

  const swatchColor = useMemo(() => {
    if (!modelState)
      return 'transparent'
    try {
      return formatColor(modelState, formatRequest)
    }
    catch {
      return 'transparent'
    }
  }, [modelState, formatRequest])

  const isEmpty = !modelState

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  const commitInput = useCallback(() => {
    const nextValue = inputValue.trim()
    if (!nextValue) {
      setModelState(null)
      setLastValidModel(null)
      syncOutput('', null, true)
      return
    }
    try {
      const model = parseColor(nextValue)
      applyModel(model, true)
    }
    catch (error) {
      notifyError(error as ColorError)
    }
  }, [inputValue, applyModel, notifyError, syncOutput])

  const handleInputKeydown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter')
      commitInput()
  }, [commitInput])

  const handleInputClick = () => {
    setOpen(true)
  }

  const handlePopoverPointerDown = () => {
    isPointerDownInside.current = true
  }

  const handlePopoverPointerUp = () => {
    isPointerDownInside.current = false
  }

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    commitInput()
    if (isPointerDownInside.current) {
      isPointerDownInside.current = false
      return
    }
    const nextTarget = event.relatedTarget as Node | null
    if (nextTarget && floatingRef.current?.contains(nextTarget))
      return
    setOpen(false)
  }

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled)
        return
      if (lastEmittedValueRef.current === currentValue) {
        lastEmittedValueRef.current = null
        return
      }
      if (!currentValue) {
        setModelState(null)
        setLastValidModel(null)
        setInputValue('')
        return
      }
      try {
        const model = parseColor(currentValue)
        applyModel(model, false)
      }
      catch (error) {
        notifyError(error as ColorError)
        setInputValue(currentValue)
      }
    })
    return () => {
      cancelled = true
    }
  }, [currentValue, applyModel, notifyError])

  const popoverStyle = useMemo(() => ({
    ...floatingStyles,
    zIndex,
    '--pickolor-popover-transition-ms': `${transitionDelay}ms`,
  }) as CSSProperties, [floatingStyles, zIndex, transitionDelay])

  const popoverBody = useMemo(() => (
    <div className="pickolor-popover-content">
      <SaturationPanel />
      <HueSlider />
      {includeAlpha ? <AlphaSlider /> : null}
    </div>
  ), [includeAlpha])

  const popoverNode = isPopoverRendered
    ? (
        <div
          ref={setFloating}
          id={popoverId}
          style={popoverStyle}
          className="pickolor-popover"
          role="dialog"
          aria-modal={false}
          aria-hidden={open ? undefined : true}
          data-open={open ? 'true' : 'false'}
          data-placement={resolvedPlacement}
          tabIndex={-1}
          onPointerDown={handlePopoverPointerDown}
          onPointerUp={handlePopoverPointerUp}
        >
          {popoverBody}
        </div>
      )
    : null

  return (
    <ColorControlContext.Provider value={controlContextValue}>
      <div className="pickolor-vue-picker">
        <div className="pickolor-input-wrap">
          <input
            ref={setReference}
            role="combobox"
            className="pickolor-vue-input"
            type="text"
            aria-expanded={open ? 'true' : 'false'}
            aria-haspopup="dialog"
            aria-controls={popoverId}
            value={inputValue}
            onKeyDown={handleInputKeydown}
            onChange={handleInput}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
          />
          <span
            className={`pickolor-swatch${isEmpty ? ' is-empty' : ''}`}
            style={{ background: swatchColor }}
            aria-hidden="true"
          />
        </div>
        {portalRoot && popoverNode
          ? createPortal(popoverNode, portalRoot)
          : null}
      </div>
    </ColorControlContext.Provider>
  )
}
