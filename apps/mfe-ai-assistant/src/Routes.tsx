import { Route, Routes } from 'react-router-dom'

import './index.css'

import AssistantPage from './features/assistant/AssistantPage'

export default function AssistantRoutes() {
  return (
    <Routes>
      <Route index element={<AssistantPage />} />
    </Routes>
  )
}
