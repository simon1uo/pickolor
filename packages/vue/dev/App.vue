<script setup lang="ts">
import { ref } from 'vue'
import { ColorPicker } from '../src'

const color = ref('#ff8800')
const preview = ref('#ff8800')
const presets = ['#ff8800', '#2dd4bf', '#7c3aed', '#0ea5e9', '#f43f5e']

function onChange(model) {
  preview.value = model
}

function onPresetClick(preset) {
  color.value = preset
  preview.value = preset
}

function onError(err: any) {
  console.error('Color error', err)
}
</script>

<template>
  <main class="pickolor-demo" :style="{ background: color }">
    <section class="pickolor-card">
      <ColorPicker v-model="color" :format-request="{ target: 'rgb' }" @change="onChange" @error="onError" />
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
</style>
