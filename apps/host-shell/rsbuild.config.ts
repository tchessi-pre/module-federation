import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [pluginReact()],
  resolve: {
    alias: {
      '@': path.join(rootDir, 'src'),
    },
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  html: {
    template: './index.html',
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  moduleFederation: {
    options: {
      name: 'host',
      remotes: {
        feedback: 'feedback@http://localhost:5174/remoteEntry.js',
        analytics: 'analytics@http://localhost:5175/remoteEntry.js',
        assistant: 'assistant@http://localhost:5176/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.26.2' },
        zustand: { singleton: true, requiredVersion: '^4.5.5' },
        '@tanstack/react-query': { singleton: true, requiredVersion: '^5.59.16' },
      },
      shareStrategy: 'version-first',
    },
  },
})
