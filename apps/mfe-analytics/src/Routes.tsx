import { Route, Routes } from 'react-router-dom'

import './index.css'

import AnalyticsPage from './features/analytics/AnalyticsPage'

export default function AnalyticsRoutes() {
  return (
    <Routes>
      <Route index element={<AnalyticsPage />} />
    </Routes>
  )
}
