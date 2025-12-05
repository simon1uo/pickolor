import type { ColorModel } from '../src'
import { describe, expect, it } from 'vitest'
import { formatColor, parseColor } from '../src'

describe('parseColor', () => {
  it('parses HEX input into normalized model', () => {
    const model = parseColor('#ff8800')

    expect(model).toMatchObject({
      space: 'hex',
      values: { hex: 'ff8800' },
      alpha: 1,
      source: '#ff8800',
    })
  })

  it('parses RGBA with alpha and clamps precision', () => {
    const model = parseColor('rgba(255, 136, 0, 0.75555)')

    expect(model.space).toBe('rgb')
    expect(model.values).toMatchObject({ r: 255, g: 136, b: 0 })
    expect(model.alpha).toBeCloseTo(0.7556, 4)
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
  const baseModel = {
    space: 'rgb',
    values: { r: 255, g: 136, b: 0 },
    alpha: 0.8,
    source: 'rgb(255,136,0)',
  } as ColorModel

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
