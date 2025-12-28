<script setup lang="ts">
import type { FormatType } from '@pickolor/core'
import { ref } from 'vue'
import { ColorPicker } from '../src'

const color = ref('#ff8800')
const presets = ['#ff8800', '#2dd4bf', '#7c3aed', '#0ea5e9', '#f43f5e']
const includeAlpha = ref(true)
const targetOptions = [
  'hex',
  'hex8',
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'hsv',
  'hsva',
  'cmyk',
  'css',
  'oklch',
] as const satisfies FormatType[]

const target = ref<FormatType>('hex')
const precision = ref(4)
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

type PopoverPlacement = typeof popoverPlacements[number]
const popoverPlacement = ref<PopoverPlacement>('bottom')

function onPresetClick(preset: string) {
  color.value = preset
}
</script>

<template>
  <main class="pickolor-demo" :style="{ background: color }">
    <section class="pickolor-card">
      <div class="control-row">
        <label class="control-checkbox">
          <input v-model="includeAlpha" type="checkbox">
          Include alpha
        </label>
        <label class="control-select">
          <span>Target</span>
          <select v-model="target">
            <option v-for="item in targetOptions" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </label>
        <label class="control-select">
          <span>Precision</span>
          <select v-model.number="precision">
            <option :value="0">0</option>
            <option :value="2">2</option>
            <option :value="4">4</option>
            <option :value="6">6</option>
          </select>
        </label>
        <label class="control-select">
          <span>Popover</span>
          <select v-model="popoverPlacement">
            <option v-for="item in popoverPlacements" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </label>
      </div>
      <ColorPicker v-model="color" :target="target" :precision="precision" :include-alpha="includeAlpha"
        :popover-props="{ placement: popoverPlacement }" />
      <div class="presets">
        <button v-for="item in presets" :key="item" :style="{ background: item }" @click="onPresetClick(item)">
          {{ item }}
        </button>
      </div>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>

<style scoped>
.pickolor-demo {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  font-family: Inter, sans-serif;
  transition: background 0.3s ease-in-out;
}

.pickolor-card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: min(300px, 100%);
  background: #ffffff85;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 16px 50px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.preview {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.presets {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.presets button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
}

.control-row {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.control-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #0f172a;
}

.control-select {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #0f172a;
}

.control-select select {
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  background: #fff;
  color: #0f172a;
  font-size: 13px;
  cursor: pointer;
}
</style>
