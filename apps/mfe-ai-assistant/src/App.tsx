import StandaloneLayout from '@/app/StandaloneLayout'
import { ThemeProvider } from '@/shared/theme/theme'

export default function App() {
  return (
    <ThemeProvider>
      <StandaloneLayout />
    </ThemeProvider>
  )
}
