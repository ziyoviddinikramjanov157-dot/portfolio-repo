import { defineConfig } from 'vitest/config'

// every test file resets the same test database, so files run one after another
export default defineConfig({ test: { fileParallelism: false, testTimeout: 15000 } })
