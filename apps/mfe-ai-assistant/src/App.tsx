import StandaloneLayout from '@/app/StandaloneLayout'
import { ThemeProvider } from '@cxhub/shared/theme'

export default function App() {
  return (
    <ThemeProvider>
      <StandaloneLayout />
    </ThemeProvider>
  )
}
