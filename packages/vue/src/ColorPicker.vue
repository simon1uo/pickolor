<script setup lang="ts">
import type { ColorError, ColorModel, FormatRequest } from '@pickolor/core'
import { computed } from 'vue'
import { useColor } from './useColor'

const props = defineProps<{
  modelValue: string
  formatRequest?: FormatRequest
  label?: string
  className?: string
  inputProps?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', model: ColorModel): void
  (e: 'error', error: ColorError): void
}>()

const label = computed(() => props.label ?? 'Color')
const wrapperClass = computed(() => props.className)
const colorValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const { formatted, applyChange } = useColor({
  value: colorValue,
  formatRequest: computed(() => props.formatRequest).value,
  onError: error => emit('error', error),
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const next = target.value
  const result = applyChange(next)
  if (result)
    emit('change', result.model)
}
</script>

<template>
  <label class="pickolor-vue-picker" :class="wrapperClass">
    <span class="pickolor-vue-label">{{ label }}</span>
    <input v-bind="inputProps" type="text" class="pickolor-vue-input" :value="modelValue ?? ''" @input="onInput">
    <small class="pickolor-vue-hint">Preview: {{ formatted }}</small>
  </label>
</template>
