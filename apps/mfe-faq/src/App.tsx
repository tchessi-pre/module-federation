import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import StandaloneLayout from '@/app/StandaloneLayout'
import { ThemeProvider } from '@cxhub/shared/theme'

const queryClient = new QueryClient()

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <StandaloneLayout />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
