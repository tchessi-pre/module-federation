import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        feedback: 'http://localhost:5174/assets/remoteEntry.js',
        analytics: 'http://localhost:5175/assets/remoteEntry.js',
        assistant: 'http://localhost:5176/assets/remoteEntry.js',
      },
      shared: {
        react: { import: true },
        'react-dom': { import: true },
        'react/jsx-runtime': { import: true, version: '18.3.1' },
        'react-router-dom': { import: true },
        zustand: { import: true },
        '@tanstack/react-query': { import: true },
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    emptyOutDir: false,
  },
})
