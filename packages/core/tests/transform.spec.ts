import { describe, expect, it } from 'vitest'
import { formatColor, parseColor, transformColor } from '../src'

describe('transformColor', () => {
  const baseHex = '#ff8800'
  const baseModel = () => parseColor(baseHex)

  it('applies lighten and darken sequentially with clamped output', () => {
    const result = transformColor(baseModel(), [
      { type: 'lighten', value: 0.2 },
      { type: 'darken', value: 0.1 },
    ])

    const out = formatColor(result, { target: 'rgba', precision: 4, includeAlpha: true })
    expect(out).toMatch(/^rgba\(/)
    expect(result.a).toBeCloseTo(1, 4)
    expect(result.v).toBeLessThanOrEqual(1)
  })

  it('handles hue shift and alpha adjustments in order', () => {
    const result = transformColor(baseModel(), [
      { type: 'hueShift', value: 45 },
      { type: 'alpha', value: -0.25 },
    ])

    expect(result.source).toBe(baseHex)
    expect(result.a).toBeCloseTo(0.75, 2)
    expect(result.h).toBeGreaterThanOrEqual(0)
  })

  it('throws structured error for unsupported transform type', () => {
    expect.assertions(3)
    try {
      transformColor(baseModel(), [
        // @ts-expect-error invalid type for test
        { type: 'unknown', value: 1 },
      ])
    }
    catch (error) {
      const err = error as any
      expect(err.type).toBe('transform')
      expect(typeof err.code).toBe('string')
      expect(err.message.length).toBeGreaterThanOrEqual(15)
    }
  })

  it('throws structured error for out-of-range value', () => {
    expect.assertions(3)
    try {
      transformColor(baseModel(), [{ type: 'lighten', value: 2 }])
    }
    catch (error) {
      const err = error as any
      expect(err.type).toBe('transform')
      expect(typeof err.code).toBe('string')
      expect(err.message.length).toBeGreaterThanOrEqual(15)
    }
  })

  it('keeps precision to 4 decimals in formatted output', () => {
    const result = transformColor(baseModel(), [{ type: 'lighten', value: 0.12345 }])
    const out = formatColor(result, { target: 'hsla', precision: 4, includeAlpha: true })
    expect(out).toMatch(/\d+\.\d{4}/)
  })
})
