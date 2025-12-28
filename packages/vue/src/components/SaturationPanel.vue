<script setup lang="ts">
// useEventListener: 绑定 panelRef/window 处理点击与拖拽更新
import type { ColorControlContext } from '../context/color'
import { clamp, formatColor } from '@pickolor/core'
import { useElementSize, useEventListener, useThrottleFn } from '@vueuse/core'
import { computed, inject, ref } from 'vue'
import { COLOR_CONTROL_CTX } from '../context/color'

export interface SaturationPanelProps {
  disabled?: boolean
  width?: number | string
  height?: number | string
}

const props = withDefaults(defineProps<SaturationPanelProps>(), {
  disabled: false,
})

const context = inject<ColorControlContext | null>(COLOR_CONTROL_CTX, null)
const panelRef = ref<HTMLElement | null>(null)
const thumbRef = ref<HTMLElement | null>(null)
const isDragDisabled = computed(() => props.disabled || !context)
const isDragging = ref(false)
const { width: panelWidth, height: panelHeight } = useElementSize(panelRef)
const { width: thumbWidth, height: thumbHeight } = useElementSize(thumbRef)

const saturation = computed(() => context?.model.value?.s ?? 0)
const value = computed(() => context?.model.value?.v ?? 0)
const hue = computed(() => clamp(context?.model.value?.h ?? 0, 0, 360))

const panelBackground = computed(() => {
  let hueColor = '#ff0000'
  try {
    hueColor = formatColor(
      { h: hue.value, s: 1, v: 1, a: 1, format: 'hex', source: '' },
      { target: 'hex', precision: 0, includeAlpha: false },
    )
  }
  catch {
    hueColor = '#ff0000'
  }
  return `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`
})

const thumbColor = computed(() => {
  let color = '#ff0000'
  try {
    color = formatColor(
      { h: hue.value, s: saturation.value, v: value.value, a: 1, format: 'hex', source: '' },
      { target: 'hex', precision: 0, includeAlpha: false },
    )
  }
  catch {
    color = '#ff0000'
  }
  return color
})

const panelStyle = computed(() => {
  const width = props.width === undefined ? undefined : (typeof props.width === 'number' ? `${props.width}px` : props.width)
  const height = props.height === undefined ? undefined : (typeof props.height === 'number' ? `${props.height}px` : props.height)
  return {
    width,
    height,
    background: panelBackground.value,
    touchAction: 'none',
  }
})

function resolvePointerPosition(event: MouseEvent | PointerEvent) {
  if (!panelRef.value)
    return null
  const rect = panelRef.value.getBoundingClientRect()
  if (!rect.width || !rect.height)
    return null
  const x = clamp(Math.round(event.clientX - rect.left), 0, rect.width)
  const y = clamp(Math.round(event.clientY - rect.top), 0, rect.height)
  const saturation = x / rect.width
  const value = 1 - y / rect.height
  return {
    s: saturation,
    v: value,
  }
}

const applySaturationValue = useThrottleFn((nextS: number, nextV: number) => {
  if (!context)
    return
  const base = context.model.value
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

function updateFromPointer(event: MouseEvent | PointerEvent) {
  const next = resolvePointerPosition(event)
  if (!next)
    return
  applySaturationValue(next.s, next.v)
}

useEventListener(panelRef, 'click', (event) => {
  if (isDragDisabled.value)
    return
  updateFromPointer(event)
})

useEventListener(panelRef, 'pointerdown', (event) => {
  if (isDragDisabled.value)
    return
  event.preventDefault()
  if (panelRef.value)
    panelRef.value.setPointerCapture(event.pointerId)
  isDragging.value = true
  updateFromPointer(event)
})

useEventListener(window, 'pointermove', (event) => {
  if (!isDragging.value || isDragDisabled.value)
    return
  event.preventDefault()
  updateFromPointer(event)
})

useEventListener(window, 'pointerup', (event) => {
  if (!isDragging.value)
    return
  if (panelRef.value?.hasPointerCapture(event.pointerId))
    panelRef.value.releasePointerCapture(event.pointerId)
  isDragging.value = false
})

useEventListener(window, 'pointercancel', (event) => {
  if (!isDragging.value)
    return
  if (panelRef.value?.hasPointerCapture(event.pointerId))
    panelRef.value.releasePointerCapture(event.pointerId)
  isDragging.value = false
})

const thumbStyle = computed(() => {
  const halfWidth = (thumbWidth.value || 0) / 2
  const halfHeight = (thumbHeight.value || 0) / 2
  const top = Math.round((1 - value.value) * panelHeight.value - halfHeight)
  const left = Math.round(saturation.value * panelWidth.value - halfWidth)

  return {
    left: `${left}px`,
    top: `${top}px`,
    background: thumbColor.value,
  }
})
</script>

<template>
  <div
    ref="panelRef" class="pickolor-saturation-panel" :data-disabled="disabled ? 'true' : 'false'"
    :style="panelStyle"
  >
    <span ref="thumbRef" class="pickolor-saturation-thumb" :style="thumbStyle" />
  </div>
</template>
