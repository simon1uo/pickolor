import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()

const packagesDir = path.join(root, 'packages')

const packageDirs = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)

const requiredFiles = ['README.md', 'LICENSE']
const missing = []

for (const dir of packageDirs) {
  const base = path.join(packagesDir, dir)
  const distDir = path.join(base, 'dist')

  if (!fs.existsSync(distDir)) {
    missing.push(`${dir}: dist/`)
  }

  for (const file of requiredFiles) {
    const filePath = path.join(base, file)
    if (!fs.existsSync(filePath)) {
      missing.push(`${dir}: ${file}`)
    }
  }
}

if (missing.length > 0) {
  console.error('release check failed: missing publish artifacts')
  for (const entry of missing) {
    console.error(`- ${entry}`)
  }
  process.exit(1)
}

console.log('release check passed: publish artifacts present')
