import type { ColorModel, Transformation } from './types'
import { colord } from 'colord'
import { createError } from './errors'
import { runTransformPlugins } from './plugins'
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

function modelToColord(model: ColorModel) {
  return colord({
    h: model.h,
    s: model.s * 100,
    v: model.v * 100,
    a: normalizeAlpha(model.a),
  })
}

function applyStep(color: ReturnType<typeof colord>, step: Transformation): ReturnType<typeof colord> {
  switch (step.type) {
    case 'lighten':
      try {
        assertWithinRange(step)
      }
      catch (err) {
        throw createError('transform', 'OUT_OF_RANGE', (err as Error).message)
      }
      return step.value >= 0
        ? color.lighten(step.value * 100)
        : color.darken(Math.abs(step.value) * 100)
    case 'darken':
      try {
        assertWithinRange(step)
      }
      catch (err) {
        throw createError('transform', 'OUT_OF_RANGE', (err as Error).message)
      }
      return step.value >= 0
        ? color.darken(step.value * 100)
        : color.lighten(Math.abs(step.value) * 100)
    case 'saturate':
      return color.saturate(Math.max(0, Math.min(1, step.value)) * 100)
    case 'desaturate':
      return color.desaturate(Math.max(0, Math.min(1, step.value)) * 100)
    case 'hueShift':
      try {
        assertWithinRange(step)
      }
      catch (err) {
        throw createError('transform', 'OUT_OF_RANGE', (err as Error).message)
      }
      return color.rotate(step.value)
    case 'alpha': {
      try {
        assertWithinRange(step)
      }
      catch (err) {
        throw createError('transform', 'OUT_OF_RANGE', (err as Error).message)
      }
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

  let currentModel = model
  let color = modelToColord(currentModel)

  for (const step of steps) {
    const pluginResult = runTransformPlugins(currentModel, step)
    if (pluginResult) {
      currentModel = pluginResult
      color = modelToColord(currentModel)
      continue
    }

    color = applyStep(color, step)
    const hsv = color.toHsv()
    const alpha = normalizeAlpha(color.toRgb().a)
    currentModel = {
      h: round(hsv.h, PRECISION),
      s: round(hsv.s / 100, PRECISION),
      v: round(hsv.v / 100, PRECISION),
      a: alpha,
      format: currentModel.format,
      source: currentModel.source,
    }
  }

  return currentModel
}
