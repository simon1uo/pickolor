import type { ColorModel, FormatRequest } from '@pickolor/core'
import { createContext, useContext } from 'react'

export type ColorChannel = 'h' | 's' | 'v' | 'a'

export interface ColorControlContextValue {
  model: ColorModel | null
  target: FormatRequest['target']
  precision?: FormatRequest['precision']
  includeAlpha: boolean
  setModel: (model: ColorModel) => void
  setChannel: (channel: ColorChannel, value: number) => void
}

export const ColorControlContext = createContext<ColorControlContextValue | null>(null)

export function useColorControlContext(): ColorControlContextValue | null {
  return useContext(ColorControlContext)
}
