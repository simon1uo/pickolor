<script setup lang="ts">
import type { ColorError, ColorModel, FormatType } from '@pickolor/core'
import type { PopoverProps } from './composable/usePopover'
import { computed, ref, shallowRef, useId } from 'vue'
import { AlphaSlider, HueSlider, SaturationPanel } from './components'
import { useControlContext } from './composable/useControlContext'
import { useInputModel } from './composable/useInputModel'
import { usePopover } from './composable/usePopover'

export interface ColorPickerProps {
  modelValue?: string
  value?: string
  defaultValue?: string
  target?: FormatType
  precision?: number
  includeAlpha?: boolean
  popoverProps?: PopoverProps
  onChange?: (payload: { value: string, formatted: string, model: ColorModel | null }) => void
  onError?: (error: ColorError) => void
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '',
  defaultValue: '',
  target: 'hex',
  includeAlpha: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', payload: { value: string, formatted: string, model: ColorModel | null }): void
  (e: 'error', error: ColorError): void
}>()

const {
  inputValue,
  swatchColor,
  isEmpty,
  handleInput,
  handleInputKeydown,
  commitInput,
  setModel,
  setChannel,
  modelForContext,
} = useInputModel({ props, emit })

useControlContext({
  model: modelForContext,
  target: computed(() => props.target),
  precision: computed(() => props.precision),
  includeAlpha: computed(() => props.includeAlpha),
  setModel,
  setChannel,
})

const classNameValue = 'pickolor-vue-picker'

const popoverId = useId()
const isPointerDownInside = ref(false)

const referenceRef = shallowRef<HTMLElement | null>(null)
const floatingRef = shallowRef<HTMLElement | null>(null)

const {
  open,
  setOpen,
  floatingStyles,
  resolvedPlacement,
  attach,
  zIndex,
  transitionDelay,
} = usePopover({
  referenceRef,
  floatingRef,
  popoverProps: computed(() => props.popoverProps),
})

const popoverStyle = computed(() => ({
  ...floatingStyles.value,
  'zIndex': zIndex.value,
  '--pickolor-popover-transition-ms': `${transitionDelay.value}ms`,
}))

function handleInputClick() {
  setOpen(true)
}

function handlePopoverPointerDown() {
  isPointerDownInside.value = true
}

function handlePopoverPointerUp() {
  isPointerDownInside.value = false
}

function handleInputBlur(event: FocusEvent) {
  commitInput()
  if (isPointerDownInside.value) {
    isPointerDownInside.value = false
    return
  }
  const nextTarget = event.relatedTarget as Node | null
  if (nextTarget && floatingRef.value?.contains(nextTarget))
    return
  setOpen(false)
}
</script>

<template>
  <div :class="classNameValue">
    <div class="pickolor-input-wrap">
      <input
        ref="referenceRef" role="combobox" class="pickolor-vue-input" type="text"
        :aria-expanded="open ? 'true' : 'false'" aria-haspopup="dialog" :aria-controls="popoverId" :value="inputValue"
        @keydown="handleInputKeydown" @input="handleInput" @click="handleInputClick" @blur="handleInputBlur"
      >
      <span
        class="pickolor-swatch" :class="{ 'is-empty': isEmpty }" :style="{ background: swatchColor }"
        aria-hidden="true"
      />
    </div>

    <Teleport :to="attach">
      <Transition name="pickolor-pop" appear>
        <div
          v-if="open" :id="popoverId" ref="floatingRef" :style="popoverStyle" class="pickolor-popover"
          role="dialog" :aria-modal="false" :aria-hidden="open ? undefined : true"
          :data-open="open ? 'true' : 'false'" :data-placement="resolvedPlacement" tabindex="-1"
          @pointerdown="handlePopoverPointerDown" @pointerup="handlePopoverPointerUp"
        >
          <div class="pickolor-popover-content">
            <SaturationPanel />
            <HueSlider />
            <AlphaSlider v-if="props.includeAlpha" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
