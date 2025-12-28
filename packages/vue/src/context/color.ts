import type { ColorModel, FormatRequest } from '@pickolor/core'
import type { ComputedRef } from 'vue'

export const COLOR_CONTROL_CTX = Symbol('COLOR_CONTROL_CTX')

export type ColorChannel = 'h' | 's' | 'v' | 'a'

export interface ColorControlContext {
  model: ComputedRef<ColorModel | null>
  target: ComputedRef<FormatRequest['target']>
  precision: ComputedRef<FormatRequest['precision']>
  includeAlpha: ComputedRef<boolean>
  setModel: (model: ColorModel) => void
  setChannel: (channel: ColorChannel, value: number) => void
}
