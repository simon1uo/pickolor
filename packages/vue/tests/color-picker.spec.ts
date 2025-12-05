import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import ColorPicker from '../src/ColorPicker.vue'

describe('ColorPicker (Vue)', () => {
  it('supports v-model sync and emits change with ColorModel', async () => {
    const { getByRole, emitted } = render(ColorPicker, {
      props: {
        modelValue: '#ff0000',
        formatRequest: { target: 'rgba', includeAlpha: true },
      },
    })

    const input = getByRole('textbox') as HTMLInputElement
    await fireEvent.update(input, '#00ff00')

    const updateEvents = emitted()['update:modelValue']
    expect(updateEvents?.[0]?.[0]).toBe('#00ff00')

    const changeEvents = emitted().change
    expect(changeEvents?.[0]?.[0].space).toBe('hex')
    expect(changeEvents?.[0]?.[0].values.hex).toBe('00ff00')
  })

  it('emits error event on invalid input', async () => {
    const { getByRole, emitted } = render(ColorPicker, {
      props: { modelValue: '#ff0000' },
    })

    const input = getByRole('textbox') as HTMLInputElement
    await fireEvent.update(input, 'bad-color')

    const errorEvents = emitted().error
    expect(errorEvents?.[0]?.[0].type).toBe('parse')
  })
})
