import { Route, Routes } from 'react-router-dom'

import './index.css'

import { FeedbackListPage, NewFeedbackPage } from './features/feedback/FeedbackPages'

export default function FeedbackRoutes() {
  return (
    <Routes>
      <Route index element={<FeedbackListPage />} />
      <Route path="new" element={<NewFeedbackPage />} />
    </Routes>
  )
}
