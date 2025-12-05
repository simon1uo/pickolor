import type { ColorError, ColorModel, ColorSpace, ColorValues } from './types'
import { colord } from 'colord'
import { createError } from './errors'
import { runParsePlugins } from './plugins'

const PRECISION = 4

const HEX_REGEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const HSL_MARKER = /hsl/i

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

function inferSpace(input: string): ColorSpace {
  if (HEX_REGEX.test(input.trim()))
    return 'hex'
  if (HSL_MARKER.test(input))
    return 'hsl'
  return 'rgb'
}

function toHexValue(color: ReturnType<typeof colord>): string {
  return color.toHex().replace('#', '').toLowerCase()
}

function toValues(space: ColorSpace, color: ReturnType<typeof colord>): ColorValues {
  if (space === 'hex') {
    return { hex: toHexValue(color) }
  }

  if (space === 'hsl') {
    const hsl = color.toHsl()
    return {
      h: round(hsl.h, PRECISION),
      s: round(hsl.s / 100, PRECISION),
      l: round(hsl.l / 100, PRECISION),
    }
  }

  // default rgb
  const rgb = color.toRgb()
  return {
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
  }
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

  const space = inferSpace(input)
  const inputAlpha = parseAlphaFromInput(input)
  const alpha = normalizeAlpha(inputAlpha ?? color.toRgb().a)

  return {
    space,
    values: toValues(space, color),
    alpha,
    source: input,
  }
}
