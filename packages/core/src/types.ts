export type ColorSpace = 'hex' | 'rgb' | 'hsl' | 'oklch'

export interface HexValues { hex: string }
export interface RgbValues { r: number, g: number, b: number }
export interface HslValues { h: number, s: number, l: number }
export interface OklchValues { l: number, c: number, h: number }

export type ColorValues = HexValues | RgbValues | HslValues | OklchValues

export interface ColorModel {
  space: ColorSpace
  values: ColorValues
  alpha: number
  source: string
}

export type FormatTarget = 'hex' | 'rgba' | 'rgb' | 'hsla' | 'hsl' | 'oklch'

export interface FormatRequest {
  target: FormatTarget
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
  supports?: Partial<Record<FormatTarget | ColorSpace, boolean>>
  parse?: (input: string) => ColorModel | null
  format?: (model: ColorModel, request: FormatRequest) => string | null
  transform?: (model: ColorModel, step: Transformation) => ColorModel | null
}
