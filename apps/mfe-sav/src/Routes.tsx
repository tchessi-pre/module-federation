import { Route, Routes } from 'react-router-dom'

import './index.css'

import SavPage from '@/features/sav/SavPage'

export default function SavRoutes() {
  return (
    <Routes>
      <Route index element={<SavPage />} />
    </Routes>
  )
}
