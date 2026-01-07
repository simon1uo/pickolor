import { useMemo } from 'react'
import { useColorControlContext } from '../context/color'
import { Slider } from './Slider'

export interface AlphaSliderProps {
  modelValue?: number
  value?: number
  disabled?: boolean
  onChange?: (value: number) => void
  onInput?: (value: number) => void
  onUpdateModelValue?: (value: number) => void
}

export function AlphaSlider({
  modelValue,
  value,
  disabled = false,
  onChange,
  onInput,
  onUpdateModelValue,
}: AlphaSliderProps) {
  const context = useColorControlContext()

  const isDisabled = useMemo(() => disabled || context?.includeAlpha === false, [disabled, context?.includeAlpha])

  const derivedValue = useMemo(() => {
    if (modelValue !== undefined)
      return modelValue
    if (value !== undefined)
      return value
    return context?.model?.a ?? 1
  }, [modelValue, value, context?.model?.a])

  const handleInput = (next: number) => {
    onUpdateModelValue?.(next)
    onInput?.(next)
    context?.setChannel('a', next)
  }

  const handleChange = (next: number) => {
    onUpdateModelValue?.(next)
    onChange?.(next)
    context?.setChannel('a', next)
  }

  return (
    <div className="pickolor-alpha-slider">
      <Slider
        type="alpha"
        min={0}
        max={1}
        step={0.01}
        disabled={isDisabled}
        modelValue={derivedValue}
        onInput={handleInput}
        onChange={handleChange}
        onUpdateModelValue={onUpdateModelValue}
      />
    </div>
  )
}
