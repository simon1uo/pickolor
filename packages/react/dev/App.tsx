import type { FormatRequest } from '@pickolor/core'
import { formatColor, parseColor } from '@pickolor/core'
import { useMemo, useState } from 'react'
import { ColorPicker } from '../src'
import '@pickolor/styles/styles.css'

const presets = ['#ff8800', '#2dd4bf', '#7c3aed', '#0ea5e9', '#f43f5e']
const popoverPlacements = [
  'bottom',
  'bottom-start',
  'bottom-end',
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'left',
  'left-start',
  'left-end',
] as const

const formatTargets: FormatRequest['target'][] = [
  'hex',
  'hex8',
  'rgba',
  'rgb',
  'hsla',
  'hsl',
  'hsva',
  'hsv',
  'cmyk',
  'css',
]

type PopoverPlacement = typeof popoverPlacements[number]

export default function App() {
  const [color, setColor] = useState('#ff8800')
  const [includeAlpha, setIncludeAlpha] = useState(true)
  const [target, setTarget] = useState<FormatRequest['target']>('hex')
  const [popoverPlacement, setPopoverPlacement] = useState<PopoverPlacement>('bottom')

  const formattedPreview = useMemo(() => {
    if (!color)
      return ''
    try {
      const parsed = parseColor(color)
      return formatColor(parsed, { target, includeAlpha })
    }
    catch {
      return color
    }
  }, [color, target, includeAlpha])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: formattedPreview || '#ffffff',
        transition: 'background 0.3s ease-in-out',
        fontFamily: 'Inter, sans-serif',
        margin: 0,
        padding: 0,
      }}
    >
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 24,
          background: '#ffffff85',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 16px 50px rgba(15, 23, 42, 0.12)',
          width: 'min(360px, 100%)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0f172a' }}>
            <input
              type="checkbox"
              checked={includeAlpha}
              onChange={(event) => setIncludeAlpha(event.target.checked)}
            />
            Enable alpha
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0f172a' }}>
            <span>Format</span>
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value as FormatRequest['target'])}
              style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff' }}
            >
              {formatTargets.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0f172a' }}>
            <span>Popover</span>
            <select
              value={popoverPlacement}
              onChange={(event) => setPopoverPlacement(event.target.value as PopoverPlacement)}
              style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff' }}
            >
              {popoverPlacements.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <ColorPicker
          value={color}
          target={target}
          includeAlpha={includeAlpha}
          popoverProps={{ placement: popoverPlacement }}
          onChange={({ value }) => setColor(value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#0f172a' }}>
          <span>Preview: {formattedPreview}</span>
          <span>Value: {color || '-'}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {presets.map(item => (
            <button
              key={item}
              onClick={() => {
                setColor(item)
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #d0d5dd',
                background: item,
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.16)',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
