<script setup lang="ts">
import type { ColorControlContext } from '../context/color'
import { clamp, formatColor } from '@pickolor/core'
import { useDraggable, useElementSize, useThrottleFn } from '@vueuse/core'
import { computed, inject, ref } from 'vue'
import { COLOR_CONTROL_CTX } from '../context/color'

export interface SliderProps {
  modelValue?: number
  value?: number
  type?: 'alpha' | 'hue'
  min?: number
  max?: number
  step?: number
  vertical?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  vertical: false,
  disabled: false,
  type: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'input', value: number): void
}>()

const context = inject<ColorControlContext | null>(COLOR_CONTROL_CTX, null)
const trackRef = ref<HTMLElement | null>(null)
const isVertical = computed(() => props.vertical === true)
const isDragDisabled = computed(() => props.disabled)
const { width: trackWidth, height: trackHeight } = useElementSize(trackRef)

const currentValue = computed(() => {
  if (props.modelValue !== undefined)
    return props.modelValue
  if (props.value !== undefined)
    return props.value
  return props.min
})

const valueRange = computed(() => props.max - props.min)

const normalizedRatio = computed(() => {
  const range = valueRange.value
  if (range <= 0)
    return 0
  return clamp((currentValue.value - props.min) / range, 0, 1)
})

const fallbackModel = {
  h: 0,
  s: 1,
  v: 1,
  a: 1,
  format: 'hex' as const,
  source: '',
}

const baseModel = computed(() => context?.model.value ?? fallbackModel)

const alphaStops = computed(() => {
  const base = baseModel.value
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
})

const thumbColor = computed(() => {
  if (props.type === 'alpha') {
    try {
      return formatColor(
        { ...baseModel.value, a: clamp(currentValue.value, 0, 1) },
        { target: 'rgba', precision: 3, includeAlpha: true },
      )
    }
    catch {
      return 'rgba(255, 0, 0, 1)'
    }
  }

  if (props.type === 'hue') {
    try {
      return formatColor(
        {
          h: clamp(currentValue.value, 0, 360),
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
})

const gradientStyle = computed(() => {
  const direction = isVertical.value ? 'to top' : 'to right'
  if (props.type === 'hue') {
    return {
      background: `linear-gradient(${direction}, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)`,
    }
  }
  if (props.type === 'alpha') {
    return {
      background: `linear-gradient(${direction}, ${alphaStops.value.start}, ${alphaStops.value.end})`,
    }
  }
  return {}
})

const thumbStyle = computed(() => {
  const width = trackWidth.value || 0
  const height = trackHeight.value || 0
  const ratio = normalizedRatio.value
  const x = ratio * width
  const y = (1 - ratio) * height
  if (isVertical.value) {
    return {
      left: '50%',
      top: `${y}px`,
      transform: 'translate(-50%, -50%)',
      background: thumbColor.value,
    }
  }
  return {
    left: `${x}px`,
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: thumbColor.value,
  }
})

const trackStyle = computed(() => ({
  touchAction: 'none',
}))

function applyStep(value: number) {
  const step = props.step
  if (!step || step <= 0)
    return value
  const precision = step.toString().split('.')[1]?.length ?? 0
  const stepped = Math.round((value - props.min) / step) * step + props.min
  return Number(stepped.toFixed(precision))
}

function normalizeValue(value: number) {
  return clamp(applyStep(value), props.min, props.max)
}

function emitInputValue(value: number) {
  const next = normalizeValue(value)
  emit('update:modelValue', next)
  emit('input', next)
}

function emitChangeValue(value: number) {
  const next = normalizeValue(value)
  emit('update:modelValue', next)
  emit('change', next)
}

function resolvePointerValue(event: PointerEvent) {
  if (!trackRef.value)
    return null
  const rect = trackRef.value.getBoundingClientRect()
  if (!rect.width || !rect.height)
    return null
  const range = valueRange.value
  if (range <= 0)
    return props.min
  if (isVertical.value) {
    const y = clamp(event.clientY - rect.top, 0, rect.height)
    const ratio = 1 - y / rect.height
    return props.min + ratio * range
  }
  const x = clamp(event.clientX - rect.left, 0, rect.width)
  const ratio = x / rect.width
  return props.min + ratio * range
}

const applyInput = useThrottleFn((next: number) => {
  emitInputValue(next)
}, 16)

function updateFromPointer(event: PointerEvent, commitChange = false, immediate = false) {
  const next = resolvePointerValue(event)
  if (next === null)
    return
  if (commitChange)
    emitChangeValue(next)
  else if (immediate)
    emitInputValue(next)
  else
    applyInput(next)
}

useDraggable(trackRef, {
  containerElement: trackRef,
  preventDefault: true,
  disabled: isDragDisabled,
  onStart: (_position, event) => {
    if (isDragDisabled.value)
      return false
    updateFromPointer(event, false, true)
  },
  onMove: (_position, event) => {
    updateFromPointer(event)
  },
  onEnd: (_position, event) => {
    updateFromPointer(event, true)
  },
})

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled)
    return
  const isDecrease = isVertical.value
    ? event.key === 'ArrowDown'
    : event.key === 'ArrowLeft'
  const isIncrease = isVertical.value
    ? event.key === 'ArrowUp'
    : event.key === 'ArrowRight'
  if (!isDecrease && !isIncrease)
    return
  event.preventDefault()
  const direction = isIncrease ? 1 : -1
  const next = currentValue.value + props.step * direction
  emitInputValue(next)
  emitChangeValue(next)
}
</script>

<template>
  <div
    class="pickolor-slider"
    :data-vertical="isVertical ? 'true' : 'false'"
    :data-variant="type ?? undefined"
    :data-disabled="disabled ? 'true' : 'false'"
  >
    <div
      ref="trackRef"
      class="pickolor-slider-track"
      role="slider"
      :tabindex="disabled ? -1 : 0"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="currentValue"
      :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
      :style="trackStyle"
      @keydown="handleKeydown"
    >
      <span v-if="type === 'alpha'" class="pickolor-slider-layer pickolor-slider-checker" />
      <span class="pickolor-slider-layer pickolor-slider-gradient" :style="gradientStyle" />
      <span class="pickolor-slider-thumb" :style="thumbStyle" />
    </div>
  </div>
</template>
