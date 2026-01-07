import { useMemo } from 'react'
import { useColorControlContext } from '../context/color'
import { Slider } from './Slider'

export interface HueSliderProps {
  modelValue?: number
  value?: number
  disabled?: boolean
  onChange?: (value: number) => void
  onInput?: (value: number) => void
  onUpdateModelValue?: (value: number) => void
}

export function HueSlider({
  modelValue,
  value,
  disabled = false,
  onChange,
  onInput,
  onUpdateModelValue,
}: HueSliderProps) {
  const context = useColorControlContext()

  const derivedValue = useMemo(() => {
    if (modelValue !== undefined)
      return modelValue
    if (value !== undefined)
      return value
    return context?.model?.h ?? 0
  }, [modelValue, value, context?.model?.h])

  const handleInput = (next: number) => {
    onUpdateModelValue?.(next)
    onInput?.(next)
    context?.setChannel('h', next)
  }

  const handleChange = (next: number) => {
    onUpdateModelValue?.(next)
    onChange?.(next)
    context?.setChannel('h', next)
  }

  return (
    <div className="pickolor-hue-slider">
      <Slider
        type="hue"
        min={0}
        max={360}
        step={1}
        disabled={disabled}
        modelValue={derivedValue}
        onInput={handleInput}
        onChange={handleChange}
        onUpdateModelValue={onUpdateModelValue}
      />
    </div>
  )
}
