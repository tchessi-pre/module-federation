import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

let root: Root | null = null

export function mount(element: Element, options?: { basename?: string }) {
  root = createRoot(element)

  root.render(
    <StrictMode>
      <BrowserRouter basename={options?.basename || ''}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )

  return () => {
    root?.unmount()
    root = null
  }
}

export function unmount() {
  root?.unmount()
  root = null
}

const api = { mount, unmount }
export default api

const container = document.getElementById('root')
if (container) mount(container)
