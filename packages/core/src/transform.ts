import type { ColorModel, ColorSpace, ColorValues, Transformation } from './types'
import { colord } from 'colord'
import { createError } from './errors'
import { assertWithinRange } from './types'

const PRECISION = 4

function round(value: number, precision = PRECISION): number {
  return Number(value.toFixed(precision))
}

function normalizeAlpha(alpha: number | undefined): number {
  if (alpha === undefined || Number.isNaN(alpha))
    return 1
  return Math.min(1, Math.max(0, round(alpha)))
}

function toValues(space: ColorSpace, color: ReturnType<typeof colord>): ColorValues {
  if (space === 'hex') {
    return { hex: color.toHex().replace('#', '').toLowerCase() }
  }
  if (space === 'hsl') {
    const hsl = color.toHsl()
    return {
      h: round(hsl.h, PRECISION),
      s: round(hsl.s / 100, PRECISION),
      l: round(hsl.l / 100, PRECISION),
    }
  }
  const rgb = color.toRgb()
  return { r: rgb.r, g: rgb.g, b: rgb.b }
}

function modelToColord(model: ColorModel) {
  const alpha = model.alpha ?? 1
  switch (model.space) {
    case 'hex':
      return colord(`#${(model.values as any).hex}`).alpha(alpha)
    case 'hsl': {
      const { h, s, l } = model.values as any
      return colord({ h, s: s * 100, l: l * 100, a: alpha })
    }
    case 'rgb': {
      const { r, g, b } = model.values as any
      return colord({ r, g, b, a: alpha })
    }
    default:
      throw createError('transform', 'UNSUPPORTED_SPACE', `Unsupported color space: ${model.space}`)
  }
}

function applyStep(color: ReturnType<typeof colord>, step: Transformation): ReturnType<typeof colord> {
  try {
    assertWithinRange(step)
  }
  catch (err) {
    throw createError('transform', 'OUT_OF_RANGE', (err as Error).message)
  }

  switch (step.type) {
    case 'lighten':
      return step.value >= 0
        ? color.lighten(step.value * 100)
        : color.darken(Math.abs(step.value) * 100)
    case 'darken':
      return step.value >= 0
        ? color.darken(step.value * 100)
        : color.lighten(Math.abs(step.value) * 100)
    case 'saturate':
      return step.value >= 0
        ? color.saturate(step.value * 100)
        : color.desaturate(Math.abs(step.value) * 100)
    case 'desaturate':
      return step.value >= 0
        ? color.desaturate(step.value * 100)
        : color.saturate(Math.abs(step.value) * 100)
    case 'hueShift':
      return color.rotate(step.value)
    case 'alpha': {
      const current = color.toRgb().a ?? 1
      const next = normalizeAlpha(current + step.value)
      return color.alpha(next)
    }
    default:
      throw createError('transform', 'UNSUPPORTED_TRANSFORM', `Unsupported transform type: ${step.type as string}`)
  }
}

export function transformColor(model: ColorModel, steps: Transformation[]): ColorModel {
  if (!Array.isArray(steps)) {
    throw createError('transform', 'INVALID_STEPS', 'Transform steps must be an array')
  }

  let color = modelToColord(model)

  for (const step of steps) {
    color = applyStep(color, step)
  }

  const alpha = normalizeAlpha(color.toRgb().a)

  return {
    space: model.space,
    values: toValues(model.space, color),
    alpha,
    source: model.source,
  }
}
