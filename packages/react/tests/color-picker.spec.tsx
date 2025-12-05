import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { ColorPicker } from '../src'

describe('ColorPicker (React)', () => {
  it('handles controlled change and emits parsed model + formatted value', () => {
    const handleChange = vi.fn()

    function Wrapper() {
      const [val, setVal] = useState('#ff0000')
      return (
        <ColorPicker
          value={val}
          formatRequest={{ target: 'rgba', includeAlpha: true }}
          onChange={(model, formatted) => {
            handleChange(model, formatted)
            setVal(model.source)
          }}
        />
      )
    }

    render(<Wrapper />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '#00ff00' } })

    expect(handleChange).toHaveBeenCalled()
    const [model, formatted] = handleChange.mock.calls.at(-1) as any
    expect(model.space).toBe('hex')
    expect(model.values.hex).toBe('00ff00')
    expect(formatted).toBe('rgba(0, 255, 0, 1.0000)')
    expect(screen.getByText(/Preview:/)).toHaveTextContent('rgba(0, 255, 0, 1.0000)')
  })

  it('emits error on invalid input', () => {
    const handleError = vi.fn()
    render(<ColorPicker value="#ff0000" onError={handleError} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'not-a-color' } })

    expect(handleError).toHaveBeenCalled()
    const [error] = handleError.mock.calls[0]
    expect(error.type).toBe('parse')
  })
})
