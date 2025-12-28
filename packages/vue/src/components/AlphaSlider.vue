<script setup lang="ts">
import type { ColorControlContext } from '../context/color'
import { computed, inject } from 'vue'
import { COLOR_CONTROL_CTX } from '../context/color'
import Slider from './Slider.vue'

export interface AlphaSliderProps {
  modelValue?: number
  value?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<AlphaSliderProps>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'input', value: number): void
}>()

const context = inject<ColorControlContext | null>(COLOR_CONTROL_CTX, null)

const isDisabled = computed(() => props.disabled || context?.includeAlpha.value === false)

const derivedValue = computed(() => {
  if (props.modelValue !== undefined)
    return props.modelValue
  if (props.value !== undefined)
    return props.value
  return context?.model.value?.a ?? 1
})

function handleInput(next: number) {
  emit('update:modelValue', next)
  emit('input', next)
  context?.setChannel('a', next)
}

function handleChange(next: number) {
  emit('update:modelValue', next)
  emit('change', next)
  context?.setChannel('a', next)
}
</script>

<template>
  <div class="pickolor-alpha-slider">
    <Slider
      type="alpha"
      :min="0"
      :max="1"
      :step="0.01"
      :disabled="isDisabled"
      :model-value="derivedValue"
      @input="handleInput"
      @change="handleChange"
    />
  </div>
</template>
