import * as React from 'react'
import { Route, Routes } from 'react-router-dom'
import DashboardPage from '@/features/dashboard/DashboardPage'
import NotFoundPage from '@/features/notfound/NotFoundPage'
import RemoteBoundary from './RemoteBoundary'
import ShellLayout from './ShellLayout'

const FeedbackRoutes = React.lazy(() => import('feedback/Routes'))
const AnalyticsRoutes = React.lazy(() => import('analytics/Routes'))
const AssistantRoutes = React.lazy(() => import('assistant/Routes'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="feedback/*"
          element={
            <RemoteBoundary>
              <FeedbackRoutes />
            </RemoteBoundary>
          }
        />
        <Route
          path="analytics/*"
          element={
            <RemoteBoundary>
              <AnalyticsRoutes />
            </RemoteBoundary>
          }
        />
        <Route
          path="assistant/*"
          element={
            <RemoteBoundary>
              <AssistantRoutes />
            </RemoteBoundary>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
