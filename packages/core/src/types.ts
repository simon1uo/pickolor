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
