/// <reference path="../env.d.ts" />
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import ColorPicker from '../src/ColorPicker.vue'

describe('ColorPicker (Vue)', () => {
  it('renders input and swatch', () => {
    const { container } = render(ColorPicker)
    expect(screen.getByRole('combobox')).toBeTruthy()
    expect(container.querySelector('.pickolor-swatch')).toBeTruthy()
  })
})
