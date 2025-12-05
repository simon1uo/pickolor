import { describe, expect, it } from 'vitest'
import { formatColor, parseColor } from '../src'

describe('parseColor', () => {
  it('parses HEX input into normalized model', () => {
    const model = parseColor('#ff8800')

    expect(model).toMatchObject({
      format: 'hex',
      a: 1,
      source: '#ff8800',
    })
    expect(model.h).toBeGreaterThanOrEqual(0)
    expect(model.s).toBeGreaterThan(0)
    expect(model.v).toBeGreaterThan(0)
  })

  it('parses RGBA with alpha and clamps precision', () => {
    const model = parseColor('rgba(255, 136, 0, 0.75555)')

    expect(model.format).toBe('rgba')
    expect(model.a).toBeCloseTo(0.7556, 4)
    expect(model.source.toLowerCase()).toContain('rgba')
  })

  it('throws structured error for invalid input', () => {
    expect.assertions(4)
    try {
      parseColor('not-a-color')
    }
    catch (error) {
      const err = error as any
      expect(err.type).toBe('parse')
      expect(typeof err.code).toBe('string')
      expect(typeof err.message).toBe('string')
      expect(err.message.length).toBeGreaterThanOrEqual(15)
    }
  })
})

describe('formatColor', () => {
  const baseModel = parseColor('rgba(255, 136, 0, 0.8)')

  it('formats to rgba string with precision and alpha', () => {
    const out = formatColor(baseModel, {
      target: 'rgba',
      precision: 4,
      includeAlpha: true,
    })

    expect(out).toBe('rgba(255, 136, 0, 0.8000)')
  })

  it('formats to hex without alpha when includeAlpha is false', () => {
    const out = formatColor(baseModel, { target: 'hex', includeAlpha: false })
    expect(out).toBe('#ff8800')
  })

  it('round-trips format -> parse with hsla', () => {
    const input = 'hsla(210, 60%, 50%, 0.5)'
    const parsed = parseColor(input)
    const formatted = formatColor(parsed, { target: 'hsla', precision: 2, includeAlpha: true })
    const again = parseColor(formatted)
    expect(again.format).toBe('hsla')
    expect(again.a).toBeCloseTo(0.5, 2)
    expect(again.h).toBeCloseTo(parsed.h, 1)
  })

  it('throws structured error for unsupported target', () => {
    expect.assertions(3)
    try {
      // @ts-expect-error invalid target for test
      formatColor(baseModel, { target: 'unknown-format' })
    }
    catch (error) {
      const err = error as any
      expect(err.type).toBe('format')
      expect(typeof err.code).toBe('string')
      expect(err.message.length).toBeGreaterThanOrEqual(15)
    }
  })
})
