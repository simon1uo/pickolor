// 用法: const { inputValue, swatchColor, isEmpty, handleInput, handleInputKeydown, commitInput, setModel, setChannel, modelForContext } = useInputModel({ props, emit })
import type { ColorError, ColorModel, FormatRequest } from '@pickolor/core'
import type { ColorChannel } from '../context/color'
import { clamp, formatColor, parseColor } from '@pickolor/core'
import { computed, ref, shallowRef, watch } from 'vue'

export interface UseInputModelProps {
  modelValue?: string
  value?: string
  defaultValue?: string
  target: FormatRequest['target']
  precision: FormatRequest['precision']
  includeAlpha: FormatRequest['includeAlpha']
  onChange?: (payload: { value: string, formatted: string, model: ColorModel | null }) => void
  onError?: (error: ColorError) => void
}

export interface UseInputModelEmit {
  (e: 'update:modelValue', value: string): void
  (e: 'change', payload: { value: string, formatted: string, model: ColorModel | null }): void
  (e: 'error', error: ColorError): void
}

export interface UseInputModelOptions {
  props: UseInputModelProps
  emit: UseInputModelEmit
}

export function useInputModel(options: UseInputModelOptions) {
  const { props, emit } = options
  const isValueControlled = computed(() => props.modelValue !== undefined || props.value !== undefined)
  const internalValue = ref(props.defaultValue ?? '')
  const currentValue = computed(() => {
    if (props.modelValue !== undefined)
      return props.modelValue
    if (props.value !== undefined)
      return props.value
    return internalValue.value
  })

  const formatRequest = computed<FormatRequest>(() => ({
    target: props.target,
    precision: props.precision,
    includeAlpha: props.includeAlpha,
  }))

  const lastValidModel = shallowRef<ColorModel | null>(null)
  const modelState = shallowRef<ColorModel | null>(null)
  const lastNotifiedError = shallowRef<ColorError | null>(null)
  const inputValue = ref('')
  const lastEmittedValue = shallowRef<string | null>(null)

  const swatchColor = computed(() => {
    if (!modelState.value)
      return 'transparent'
    try {
      return formatColor(modelState.value, formatRequest.value)
    }
    catch {
      return 'transparent'
    }
  })
  const isEmpty = computed(() => !modelState.value)

  function notifyError(error: ColorError | null) {
    if (!error) {
      lastNotifiedError.value = null
      return
    }
    if (lastNotifiedError.value === error)
      return
    lastNotifiedError.value = error
    emit('error', error)
    props.onError?.(error)
  }

  function stabilizeModel(nextModel: ColorModel): ColorModel {
    const base = modelState.value ?? lastValidModel.value ?? nextModel
    if (nextModel.v === 0)
      return nextModel
    if (nextModel.s === 0)
      return { ...nextModel, h: base.h }
    return nextModel
  }

  function formatModel(nextModel: ColorModel): string {
    return formatColor(nextModel, formatRequest.value)
  }

  function syncOutput(formatted: string, model: ColorModel | null, shouldEmit: boolean) {
    if (!isValueControlled.value)
      internalValue.value = formatted
    inputValue.value = formatted
    if (!shouldEmit)
      return
    lastEmittedValue.value = formatted
    emit('update:modelValue', formatted)
    emit('change', { value: formatted, formatted, model })
    props.onChange?.({ value: formatted, formatted, model })
  }

  function applyModel(nextModel: ColorModel, shouldEmit = true) {
    try {
      const stabilized = stabilizeModel(nextModel)
      const formatted = formatModel(stabilized)
      modelState.value = stabilized
      lastValidModel.value = stabilized
      syncOutput(formatted, stabilized, shouldEmit)
    }
    catch (error) {
      notifyError(error as ColorError)
    }
  }

  function getBaseModel(): ColorModel {
    const fromState = modelState.value
    if (fromState)
      return fromState
    if (lastValidModel.value)
      return lastValidModel.value
    return {
      h: 0,
      s: 0,
      v: 0,
      a: 1,
      format: props.target,
      source: currentValue.value,
    }
  }

  function setModel(nextModel: ColorModel) {
    applyModel(nextModel)
  }

  function setChannel(channel: ColorChannel, value: number) {
    const base = getBaseModel()
    const nextValue = channel === 'h' ? clamp(value, 0, 360) : clamp(value, 0, 1)
    const nextModel: ColorModel = {
      ...base,
      [channel]: nextValue,
    }
    applyModel(nextModel)
  }

  const modelForContext = computed(() => {
    if (modelState.value)
      return modelState.value
    if (lastValidModel.value)
      return lastValidModel.value
    return getBaseModel()
  })

  watch(formatRequest, () => {
    const model = modelState.value ?? lastValidModel.value
    if (!model)
      return
    applyModel(model)
  })

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement | null
    if (!target)
      return
    inputValue.value = target.value
  }

  function commitInput() {
    const nextValue = inputValue.value.trim()
    if (!nextValue) {
      modelState.value = null
      lastValidModel.value = null
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
  }

  function handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter')
      commitInput()
  }

  watch(currentValue, (next) => {
    if (lastEmittedValue.value === next) {
      lastEmittedValue.value = null
      return
    }
    if (!next) {
      modelState.value = null
      lastValidModel.value = null
      inputValue.value = ''
      return
    }
    try {
      const model = parseColor(next)
      applyModel(model, false)
    }
    catch (error) {
      notifyError(error as ColorError)
      inputValue.value = next
    }
  }, { immediate: true })

  return {
    inputValue,
    swatchColor,
    isEmpty,
    handleInput,
    handleInputKeydown,
    commitInput,
    setModel,
    setChannel,
    modelForContext,
  }
}
