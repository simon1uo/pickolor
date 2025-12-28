import type { ColorError, ColorModel, FormatType } from './types'
import { colord } from 'colord'
import { cmykInputToColor } from './cmyk'
import { createError } from './errors'
import { runParsePlugins } from './plugins'

const PRECISION = 4
const HEX_REGEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const HSL_MARKER = /hsla?/i
const HSV_MARKER = /hsva?/i
const RGBA_MARKER = /rgba/i
const CMYK_MARKER = /cmyk/i

function round(value: number, precision = PRECISION): number {
  return Number(value.toFixed(precision))
}

function parseAlphaFromInput(input: string): number | undefined {
  const rgba = /rgba?\([^)]*,\s*([^,\s)]+)\s*\)$/i.exec(input)
  if (rgba && rgba[1])
    return parseAlphaValue(rgba[1])
  const hsla = /hsla?\([^)]*,\s*([^,\s)]+)\s*\)$/i.exec(input)
  if (hsla && hsla[1])
    return parseAlphaValue(hsla[1])
  return undefined
}

function parseAlphaValue(value: string): number {
  const trimmed = value.trim()
  if (trimmed.endsWith('%')) {
    const num = Number.parseFloat(trimmed.slice(0, -1))
    if (Number.isNaN(num))
      return Number.NaN
    return num / 100
  }
  return Number.parseFloat(trimmed)
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
  if (HEX_REGEX.test(normalized)) {
    const hex = normalized.replace(/^#/, '')
    if (hex.length === 4 || hex.length === 8)
      return 'hex8'
    return 'hex'
  }
  if (HSL_MARKER.test(normalized))
    return normalized.toLowerCase().includes('hsla') ? 'hsla' : 'hsl'
  if (HSV_MARKER.test(normalized))
    return normalized.toLowerCase().includes('hsva') ? 'hsva' : 'hsv'
  if (RGBA_MARKER.test(normalized))
    return 'rgba'
  if (CMYK_MARKER.test(normalized))
    return 'cmyk'
  return 'rgb'
}

export function parseColor(input: string): ColorModel {
  const pluginResult = runParsePlugins(input)
  if (pluginResult)
    return pluginResult

  const color = colord(cmykInputToColor(input))
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
