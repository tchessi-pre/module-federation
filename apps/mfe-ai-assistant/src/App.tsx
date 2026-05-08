import StandaloneLayout from './app/StandaloneLayout'
import { ThemeProvider } from './theme'

export default function App() {
  return (
    <ThemeProvider>
      <StandaloneLayout />
    </ThemeProvider>
  )
}
