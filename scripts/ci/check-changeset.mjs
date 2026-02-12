import { execSync } from 'node:child_process'
import process from 'node:process'

const baseRef = process.env.GITHUB_BASE_REF

if (!baseRef) {
  console.log('changeset check skipped: not a pull_request event')
  process.exit(0)
}

const range = `origin/${baseRef}...HEAD`
const changedFiles = execSync(`git diff --name-only ${range}`, {
  encoding: 'utf-8',
}).trim()

if (!changedFiles) {
  console.log('changeset check skipped: no file changes detected')
  process.exit(0)
}

const files = changedFiles.split('\n')
const hasChangeset = files.some(file => file.startsWith('.changeset/'))

if (hasChangeset) {
  console.log('changeset check passed: changeset found')
  process.exit(0)
}

const requiresChangeset = files.some((file) => {
  if (file.startsWith('packages/'))
    return true
  if (file === 'package.json')
    return true
  if (file === 'pnpm-workspace.yaml')
    return true
  return false
})

if (requiresChangeset) {
  console.error('changeset check failed: missing changeset for package changes')
  console.error('Run: pnpm changeset')
  process.exit(1)
}

console.log('changeset check skipped: no publishable changes detected')
