import type { MaybeRefOrGetter, Ref } from 'vue'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { useEventListener } from '@vueuse/core'
import { computed, onScopeDispose, ref, toValue, watch } from 'vue'

export type PopoverPlacement
  = | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'

export type PopoverStrategy = 'absolute' | 'fixed'

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
  triggerElement?: MaybeRefOrGetter<HTMLElement | null>
  transitionDelay?: number
}

export interface UsePopoverOptions {
  referenceRef: Ref<HTMLElement | null>
  floatingRef: Ref<HTMLElement | null>
  popoverProps?: MaybeRefOrGetter<PopoverProps | undefined>
}

export function usePopover(options: UsePopoverOptions) {
  const popoverProps = computed(() => toValue(options.popoverProps) ?? {})
  const placement = computed<PopoverPlacement>(() => popoverProps.value.placement ?? 'bottom-start')
  const offsetValue = computed(() => popoverProps.value.offset ?? 5)
  const zIndex = computed(() => popoverProps.value.zIndex ?? 1200)
  const attach = computed(() => popoverProps.value.attach ?? 'body')
  const transitionDelay = computed(() => popoverProps.value.transitionDelay ?? 140)
  const triggerElement = computed(() => toValue(popoverProps.value.triggerElement) ?? null)
  const triggerCleanup = ref<(() => void) | null>(null)

  const open = ref(popoverProps.value.defaultVisible ?? false)
  const lastNotified = ref<boolean | null>(null)

  const { referenceRef: referenceElement, floatingRef: floatingElement } = options

  const {
    floatingStyles,
    placement: resolvedPlacement,
    strategy,
    update,
  } = useFloating(referenceElement, floatingElement, {
    open,
    placement,
    middleware: computed(() => [offset(offsetValue.value), flip(), shift()]),
    whileElementsMounted: autoUpdate,
    transform: false,
  })

  watch(
    () => triggerElement.value,
    (node) => {
      triggerCleanup.value?.()
      triggerCleanup.value = null
      if (!node || node === referenceElement.value)
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
      node.addEventListener('click', handleTriggerClick)
      node.addEventListener('keydown', handleTriggerKeydown)
      triggerCleanup.value = () => {
        node.removeEventListener('click', handleTriggerClick)
        node.removeEventListener('keydown', handleTriggerKeydown)
      }
    },
    { immediate: true },
  )

  const stopPointerDown = useEventListener(
    () => window,
    'pointerdown',
    (event) => {
      if (!open.value)
        return
      const target = event.target as Node | null
      if (!target)
        return
      const trigger = triggerElement.value ?? referenceElement.value
      if (trigger && trigger.contains(target))
        return
      if (floatingElement.value?.contains(target))
        return
      setOpen(false)
    },
    { capture: true },
  )

  const stopKeydown = useEventListener(
    () => window,
    'keydown',
    (event: KeyboardEvent) => {
      if (!open.value)
        return
      if (event.key === 'Escape')
        setOpen(false)
    },
  )

  function getContextInfo(): PopoverContextInfo {
    const trigger = triggerElement.value ?? referenceElement.value
    return {
      trigger,
      floating: floatingElement.value,
      placement: (resolvedPlacement.value ?? placement.value) as PopoverPlacement,
      strategy: strategy.value as PopoverStrategy,
    }
  }

  function setOpen(nextOpen: boolean) {
    if (lastNotified.value === nextOpen)
      return
    open.value = nextOpen
    lastNotified.value = nextOpen
    popoverProps.value.onVisibleChange?.({ visible: nextOpen, context: getContextInfo() })
  }

  watch([referenceElement, floatingElement, open], () => {
    if (open.value)
      update()
  })

  onScopeDispose(() => {
    triggerCleanup.value?.()
    triggerCleanup.value = null
    stopPointerDown()
    stopKeydown()
  })

  return {
    open,
    setOpen,
    floatingStyles,
    placement,
    resolvedPlacement: resolvedPlacement as Ref<PopoverPlacement>,
    attach,
    zIndex,
    transitionDelay,
  }
}
