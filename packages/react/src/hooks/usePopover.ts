import type { Placement, ReferenceType, Strategy, UseFloatingReturn } from '@floating-ui/react'
import type { MutableRefObject } from 'react'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type PopoverPlacement = Placement
export type PopoverStrategy = Strategy

export interface PopoverContextInfo {
  trigger: HTMLElement | null
  floating: HTMLElement | null
  placement: PopoverPlacement
  strategy: PopoverStrategy
}

export interface PopoverOpenChangePayload {
  visible: boolean
  context: PopoverContextInfo
}

export interface PopoverOffsetOptions {
  mainAxis?: number
  crossAxis?: number
  alignmentAxis?: number
}

export interface PopoverProps {
  defaultVisible?: boolean
  onVisibleChange?: (payload: PopoverOpenChangePayload) => void
  placement?: PopoverPlacement
  offset?: number | PopoverOffsetOptions
  zIndex?: number
  attach?: string | HTMLElement
  triggerElement?: HTMLElement | null | (() => HTMLElement | null)
  transitionDelay?: number
}

export interface UsePopoverOptions {
  referenceRef: MutableRefObject<HTMLElement | null>
  floatingRef: MutableRefObject<HTMLElement | null>
  popoverProps?: PopoverProps
}

export interface UsePopoverReturn {
  open: boolean
  setOpen: (next: boolean) => void
  floatingStyles: UseFloatingReturn['floatingStyles']
  placement: PopoverPlacement
  resolvedPlacement: PopoverPlacement
  attach: PopoverProps['attach']
  zIndex: number
  transitionDelay: number
  setReference: UseFloatingReturn['refs']['setReference']
  setFloating: UseFloatingReturn['refs']['setFloating']
}

function resolveTriggerElement(trigger: PopoverProps['triggerElement']): HTMLElement | null {
  if (typeof trigger === 'function')
    return trigger()
  return trigger ?? null
}

export function usePopover(options: UsePopoverOptions): UsePopoverReturn {
  const { referenceRef, floatingRef, popoverProps } = options
  const resolvedProps = popoverProps ?? {}
  const [open, setOpenState] = useState(resolvedProps.defaultVisible ?? false)
  const lastNotifiedRef = useRef<boolean | null>(null)
  const openRef = useRef(open)

  useEffect(() => {
    openRef.current = open
  }, [open])

  const placement = resolvedProps.placement ?? 'bottom-start'
  const offsetValue = resolvedProps.offset ?? 5
  const zIndex = resolvedProps.zIndex ?? 1200
  const attach = resolvedProps.attach ?? 'body'
  const transitionDelay = resolvedProps.transitionDelay ?? 140

  const middleware = useMemo(() => {
    return [offset(offsetValue), flip(), shift()]
  }, [offsetValue])

  const { refs, floatingStyles, update, placement: resolvedPlacement, strategy } = useFloating({
    open,
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
    transform: false,
  })

  const getContextInfo = useCallback((): PopoverContextInfo => {
    const trigger = resolveTriggerElement(resolvedProps.triggerElement) ?? referenceRef.current
    return {
      trigger,
      floating: floatingRef.current,
      placement: (resolvedPlacement ?? placement) as PopoverPlacement,
      strategy: strategy as PopoverStrategy,
    }
  }, [resolvedProps.triggerElement, referenceRef, floatingRef, resolvedPlacement, placement, strategy])

  const setOpen = useCallback((nextOpen: boolean) => {
    if (lastNotifiedRef.current === nextOpen)
      return
    setOpenState(nextOpen)
    lastNotifiedRef.current = nextOpen
    resolvedProps.onVisibleChange?.({ visible: nextOpen, context: getContextInfo() })
  }, [resolvedProps, getContextInfo])

  useEffect(() => {
    if (!open)
      return
    update()
  }, [open, update])

  useEffect(() => {
    const triggerElement = resolveTriggerElement(resolvedProps.triggerElement)
    if (!triggerElement || triggerElement === referenceRef.current)
      return

    const handleTriggerClick = () => {
      setOpen(true)
    }
    const handleTriggerKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setOpen(true)
      }
    }

    triggerElement.addEventListener('click', handleTriggerClick)
    triggerElement.addEventListener('keydown', handleTriggerKeydown)

    return () => {
      triggerElement.removeEventListener('click', handleTriggerClick)
      triggerElement.removeEventListener('keydown', handleTriggerKeydown)
    }
  }, [resolvedProps.triggerElement, referenceRef, setOpen])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!openRef.current)
        return
      const target = event.target as Node | null
      if (!target)
        return
      const trigger = resolveTriggerElement(resolvedProps.triggerElement) ?? referenceRef.current
      if (trigger && trigger.contains(target))
        return
      if (floatingRef.current?.contains(target))
        return
      setOpen(false)
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (!openRef.current)
        return
      if (event.key === 'Escape')
        setOpen(false)
    }

    window.addEventListener('pointerdown', handlePointerDown, true)
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true)
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [resolvedProps.triggerElement, referenceRef, floatingRef, setOpen])

  const setReference = useCallback((node: ReferenceType | null) => {
    referenceRef.current = node instanceof HTMLElement ? node : null
    refs.setReference(node)
    if (openRef.current && node)
      update()
  }, [referenceRef, refs, update])

  const setFloating = useCallback((node: HTMLElement | null) => {
    floatingRef.current = node
    refs.setFloating(node)
    if (openRef.current && node)
      update()
  }, [floatingRef, refs, update])

  return {
    open,
    setOpen,
    floatingStyles,
    placement,
    resolvedPlacement: (resolvedPlacement ?? placement) as PopoverPlacement,
    attach,
    zIndex,
    transitionDelay,
    setReference,
    setFloating,
  }
}
