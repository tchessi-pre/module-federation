import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AppRoutes from '@/app/AppRoutes'
import { ThemeProvider } from '@cxhub/shared/theme'

const queryClient = new QueryClient()

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
