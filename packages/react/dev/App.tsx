import { formatColor } from '@pickolor/core'
import { useState } from 'react'
import { ColorPicker } from '../src'
import '@pickolor/styles/styles.css'

const presets = ['#ff8800', '#2dd4bf', '#7c3aed', '#0ea5e9', '#f43f5e']

export default function App() {
  const [color, setColor] = useState('#ff8800')
  const [preview, setPreview] = useState('#ff8800')

  return (
    <main
      style={{
        padding: 0,
        margin: 0,
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: preview,
        transition: 'background 0.3s ease-in-out',
      }}
    >
      <section
        style={{
          display: 'grid',
          gap: 12,
          padding: 24,
          background: '#ffffff85',
          backdropFilter: 'blur(12px)',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 16px 50px rgba(15, 23, 42, 0.12)',
          width: 'min(300px, 100%)',
        }}
      >
        <ColorPicker
          value={color}
          formatRequest={{ target: 'rgb' }}
          onChange={(model) => {
            setColor(model.source)
            setPreview(formatColor(model, { target: 'hex', includeAlpha: false }))
          }}
          onError={(err) => {
            console.error('Color error', err)
          }}
        />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {presets.map(item => (
            <button
              key={item}
              onClick={() => {
                setColor(item)
                setPreview(item)
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
