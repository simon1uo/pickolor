import type { ColorError, ColorModel, FormatRequest } from '@pickolor/core'
import type { ChangeEvent } from 'react'
import { formatColor, parseColor } from '@pickolor/core'
import { useMemo } from 'react'

export interface ColorPickerProps {
  value: string
  onChange?: (model: ColorModel, formatted: string) => void
  onError?: (error: ColorError) => void
  formatRequest?: FormatRequest
  label?: string
  className?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  onError,
  formatRequest,
  label = 'Color',
  className,
  inputProps,
}) => {
  const formattedValue = useMemo(() => {
    try {
      const model = parseColor(value)
      return formatRequest ? formatColor(model, formatRequest) : value
    }
    catch {
      return value
    }
  }, [value, formatRequest])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    try {
      const model = parseColor(next)
      const formatted = formatRequest ? formatColor(model, formatRequest) : next
      onChange?.(model, formatted)
    }
    catch (error) {
      if (onError)
        onError(error as ColorError)
    }
  }

  return (
    <label className={['pickolor-react-picker', className].filter(Boolean).join(' ')}>
      <span className="pickolor-react-label">{label}</span>
      <input
        type="text"
        value={value ?? ''}
        onChange={handleChange}
        className={['pickolor-react-input', inputProps?.className].filter(Boolean).join(' ')}
        {...inputProps}
      />
      <small className="pickolor-react-hint">
        Preview:
        {' '}
        {formattedValue}
      </small>
    </label>
  )
}
