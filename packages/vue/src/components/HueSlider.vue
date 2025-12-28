<script setup lang="ts">
import type { ColorControlContext } from '../context/color'
import { computed, inject } from 'vue'
import { COLOR_CONTROL_CTX } from '../context/color'
import Slider from './Slider.vue'

export interface HueSliderProps {
  modelValue?: number
  value?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<HueSliderProps>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'input', value: number): void
}>()

const context = inject<ColorControlContext | null>(COLOR_CONTROL_CTX, null)

const derivedValue = computed(() => {
  if (props.modelValue !== undefined)
    return props.modelValue
  if (props.value !== undefined)
    return props.value
  return context?.model.value?.h ?? 0
})

function handleInput(next: number) {
  emit('update:modelValue', next)
  emit('input', next)
  context?.setChannel('h', next)
}

function handleChange(next: number) {
  emit('update:modelValue', next)
  emit('change', next)
  context?.setChannel('h', next)
}
</script>

<template>
  <div class="pickolor-hue-slider">
    <Slider
      type="hue"
      :min="0"
      :max="360"
      :step="1"
      :disabled="disabled"
      :model-value="derivedValue"
      @input="handleInput"
      @change="handleChange"
    />
  </div>
</template>
