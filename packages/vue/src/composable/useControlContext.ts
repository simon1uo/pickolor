// 用法: useControlContext({ model, target, precision, includeAlpha, setModel, setChannel })
import type { ColorModel, FormatRequest } from '@pickolor/core'
import type { ComputedRef } from 'vue'
import type { ColorChannel, ColorControlContext } from '../context/color'
import { provide } from 'vue'
import { COLOR_CONTROL_CTX } from '../context/color'

export interface UseControlContextOptions {
  model: ComputedRef<ColorModel | null>
  target: ComputedRef<FormatRequest['target']>
  precision: ComputedRef<FormatRequest['precision']>
  includeAlpha: ComputedRef<boolean>
  setModel: (model: ColorModel) => void
  setChannel: (channel: ColorChannel, value: number) => void
}

export function useControlContext(options: UseControlContextOptions) {
  const controlContext: ColorControlContext = {
    model: options.model,
    target: options.target,
    precision: options.precision,
    includeAlpha: options.includeAlpha,
    setModel: options.setModel,
    setChannel: options.setChannel,
  }

  provide(COLOR_CONTROL_CTX, controlContext)

  return controlContext
}
