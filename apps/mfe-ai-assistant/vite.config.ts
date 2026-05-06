import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    federation({
      name: 'assistant',
      filename: 'remoteEntry.js',
      exposes: {
        './Routes': './src/Routes.tsx',
        './mount': './src/bootstrap.tsx',
      },
      shared: {
        react: { import: true },
        'react-dom': { import: true },
        'react/jsx-runtime': { import: true },
        'react-router-dom': { import: true },
        zustand: { import: true },
        '@tanstack/react-query': { import: true },
      },
    }),
  ],
  server: {
    port: 5176,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    emptyOutDir: false,
  },
}))
