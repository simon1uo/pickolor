import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ColorPicker } from '../src/ColorPicker'

describe('ColorPicker (React)', () => {
  it('renders input and swatch', async () => {
    const { container } = render(<ColorPicker />)
    await act(async () => {})
    expect(screen.getByRole('combobox')).toBeTruthy()
    expect(container.querySelector('.pickolor-swatch')).toBeTruthy()
  })
})
