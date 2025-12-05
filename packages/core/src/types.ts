export type FormatType = 'hex' | 'rgba' | 'rgb' | 'hsla' | 'hsl' | 'oklch'

/**
 * ColorModel 采用 HSVA 作为单一来源（0-1 归一化），并记录最近的格式视图。
 * h: 0-360, s/v/a: 0-1
 */
export interface ColorModel {
  h: number
  s: number
  v: number
  a: number
  format: FormatType
  source: string
}

export interface FormatView {
  type: FormatType
  text: string
}

export interface FormatRequest {
  target: FormatType
  precision?: number
  includeAlpha?: boolean
}

export type TransformationType
  = | 'lighten'
    | 'darken'
    | 'saturate'
    | 'desaturate'
    | 'hueShift'
    | 'alpha'

export interface Transformation {
  type: TransformationType
  value: number
}

export const TRANSFORM_RANGES: Record<TransformationType, { min: number, max: number }> = {
  lighten: { min: -1, max: 1 },
  darken: { min: -1, max: 1 },
  saturate: { min: -1, max: 1 },
  desaturate: { min: -1, max: 1 },
  hueShift: { min: -360, max: 360 },
  alpha: { min: -1, max: 1 },
}

export function assertWithinRange(step: Transformation): void {
  const range = TRANSFORM_RANGES[step.type]
  if (!range)
    return

  const { min, max } = range
  if (step.value < min || step.value > max)
    throw new RangeError(`Value for ${step.type} must be between ${min} and ${max}`)
}

export type ColorErrorType = 'parse' | 'format' | 'transform' | 'plugin'

export interface ColorError {
  code: string
  type: ColorErrorType
  field?: string
  message: string
}

export interface Plugin {
  name: string
  supports?: Partial<Record<FormatType, boolean>>
  parse?: (input: string) => ColorModel | null
  format?: (model: ColorModel, request: FormatRequest) => string | null
  transform?: (model: ColorModel, step: Transformation) => ColorModel | null
}
