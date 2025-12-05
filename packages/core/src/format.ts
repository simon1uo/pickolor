import type { ColorError, ColorModel, FormatRequest, FormatType } from './types'
import { colord } from 'colord'
import { createError } from './errors'
import { runFormatPlugins } from './plugins'

const DEFAULT_PRECISION = 4

function round(value: number, precision = DEFAULT_PRECISION): number {
  return Number(value.toFixed(precision))
}

function formatNumber(value: number, precision: number): string {
  return round(value, precision).toFixed(precision)
}

function resolvePrecision(request: FormatRequest): number {
  const precision = request.precision ?? DEFAULT_PRECISION
  if (precision < 0 || precision > 6) {
    throw createError('format', 'INVALID_PRECISION', 'Precision must be between 0 and 6')
  }
  return precision
}

function clampAlpha(alpha: number | undefined): number {
  if (alpha === undefined || Number.isNaN(alpha))
    return 1
  return Math.min(1, Math.max(0, round(alpha)))
}

function modelToColord(model: ColorModel) {
  const color = colord({
    h: model.h,
    s: model.s * 100,
    v: model.v * 100,
    a: clampAlpha(model.a),
  })

  if (!color.isValid())
    throw createError('format', 'INVALID_MODEL', 'Invalid color model')

  return color
}

function hexFromRgb(color: ReturnType<typeof colord>): string {
  const { r, g, b } = color.toRgb()
  const toHex = (val: number) => val.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexWithAlpha(color: ReturnType<typeof colord>, alpha: number): string {
  const base = hexFromRgb(color).replace('#', '')
  const alphaInt = Math.round(alpha * 255)
  const alphaHex = alphaInt.toString(16).padStart(2, '0')
  return `#${base}${alphaHex}`
}

function formatByTarget(
  color: ReturnType<typeof colord>,
  target: FormatType,
  precision: number,
  includeAlpha: boolean,
): string {
  const rgb = color.toRgb()
  const hsl = color.toHsl()
  const alpha = rgb.a ?? 1

  switch (target) {
    case 'hex':
      return includeAlpha && alpha < 1
        ? hexWithAlpha(color, alpha)
        : hexFromRgb(color)
    case 'rgba':
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${formatNumber(alpha, precision)})`
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    case 'hsla':
      return `hsla(${formatNumber(hsl.h, precision)}, ${formatNumber(hsl.s, precision)}%, ${formatNumber(hsl.l, precision)}%, ${formatNumber(alpha, precision)})`
    case 'hsl':
      return `hsl(${formatNumber(hsl.h, precision)}, ${formatNumber(hsl.s, precision)}%, ${formatNumber(hsl.l, precision)}%)`
    case 'oklch':
      throw createError('format', 'UNSUPPORTED_TARGET', 'OKLCH formatting not supported yet')
    default:
      throw createError('format', 'UNSUPPORTED_TARGET', `Unsupported format target: ${target}`)
  }
}

export function formatColor(model: ColorModel, request: FormatRequest): string {
  const pluginResult = runFormatPlugins(model, request)
  if (pluginResult)
    return pluginResult

  const precision = resolvePrecision(request)
  const includeAlpha = request.includeAlpha ?? true

  const color = modelToColord(model)
  if (!color.isValid()) {
    const err: ColorError = createError(
      'format',
      'INVALID_MODEL',
      'Cannot format invalid color model',
    )
    throw err
  }

  const target = request.target ?? model.format
  return formatByTarget(color, target, precision, includeAlpha)
}
