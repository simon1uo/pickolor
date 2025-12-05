import type { ColorError, ColorModel, FormatType } from './types'
import { colord } from 'colord'
import { createError } from './errors'
import { runParsePlugins } from './plugins'

const PRECISION = 4
const HEX_REGEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const HSL_MARKER = /hsla?/i
const RGBA_MARKER = /rgba/i

function round(value: number, precision = PRECISION): number {
  return Number(value.toFixed(precision))
}

function parseAlphaFromInput(input: string): number | undefined {
  const rgba = /rgba?\([^)]*,\s*([^,\s)]+)\s*\)$/i.exec(input)
  if (rgba && rgba[1])
    return Number.parseFloat(rgba[1])
  const hsla = /hsla?\([^)]*,\s*([^,\s)]+)\s*\)$/i.exec(input)
  if (hsla && hsla[1])
    return Number.parseFloat(hsla[1])
  return undefined
}

function normalizeAlpha(alpha: number | undefined): number {
  if (alpha === undefined)
    return 1
  if (Number.isNaN(alpha))
    return 1
  return Math.min(1, Math.max(0, round(alpha)))
}

function inferFormat(input: string): FormatType {
  const normalized = input.trim()
  if (HEX_REGEX.test(normalized))
    return 'hex'
  if (HSL_MARKER.test(normalized))
    return normalized.toLowerCase().includes('hsla') ? 'hsla' : 'hsl'
  if (RGBA_MARKER.test(normalized))
    return 'rgba'
  return 'rgb'
}

export function parseColor(input: string): ColorModel {
  const pluginResult = runParsePlugins(input)
  if (pluginResult)
    return pluginResult

  const color = colord(input)
  if (!color.isValid()) {
    const err: ColorError = createError(
      'parse',
      'INVALID_INPUT',
      'Invalid color input',
    )
    throw err
  }

  const hsv = color.toHsv()
  const inputAlpha = parseAlphaFromInput(input)
  const alpha = normalizeAlpha(inputAlpha ?? color.toRgb().a)

  const model: ColorModel = {
    h: round(hsv.h, PRECISION),
    s: round(hsv.s / 100, PRECISION),
    v: round(hsv.v / 100, PRECISION),
    a: alpha,
    format: inferFormat(input),
    source: input,
  }

  return model
}
