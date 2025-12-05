import type { ColorModel, FormatRequest, Plugin, Transformation } from './types'

const registry: Plugin[] = []

export function registerPlugin(plugin: Plugin): void {
  const exists = registry.some(item => item.name === plugin.name)
  if (exists) {
    throw new Error(`Plugin with name "${plugin.name}" already registered`)
  }
  registry.push(plugin)
}

export function runParsePlugins(input: string): ColorModel | null {
  for (const plugin of registry) {
    if (plugin.parse) {
      const result = plugin.parse(input)
      if (result)
        return result
    }
  }
  return null
}

export function runFormatPlugins(
  model: ColorModel,
  request: FormatRequest,
): string | null {
  for (const plugin of registry) {
    if (plugin.format) {
      const result = plugin.format(model, request)
      if (result)
        return result
    }
  }
  return null
}

export function runTransformPlugins(
  model: ColorModel,
  step: Transformation,
): ColorModel | null {
  for (const plugin of registry) {
    if (plugin.transform) {
      const result = plugin.transform(model, step)
      if (result)
        return result
    }
  }
  return null
}
