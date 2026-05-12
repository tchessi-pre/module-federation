import { Route, Routes } from 'react-router-dom'

import './index.css'

import FaqPage from './features/faq/FaqPage'

export default function FaqRoutes() {
  return (
    <Routes>
      <Route index element={<FaqPage />} />
    </Routes>
  )
}
