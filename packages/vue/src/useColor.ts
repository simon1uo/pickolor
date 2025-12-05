import type { ColorError, FormatRequest } from '@pickolor/core'
import type { Ref } from 'vue'
import { formatColor, parseColor } from '@pickolor/core'
import { computed } from 'vue'

export interface UseColorOptions {
  value: Ref<string>
  formatRequest?: FormatRequest
  onError?: (error: ColorError) => void
}

export function useColor(options: UseColorOptions) {
  const { value, formatRequest, onError } = options

  const formatted = computed(() => {
    try {
      const model = parseColor(value.value)
      return formatRequest ? formatColor(model, formatRequest) : value.value
    }
    catch {
      return value.value
    }
  })

  const applyChange = (next: string) => {
    value.value = next
    try {
      const model = parseColor(next)
      const formattedValue = formatRequest ? formatColor(model, formatRequest) : next
      return { model, formatted: formattedValue }
    }
    catch (error) {
      onError?.(error as ColorError)
      return null
    }
  }

  return {
    value,
    formatted,
    applyChange,
  }
}
