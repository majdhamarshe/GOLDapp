import { useEffect, useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import SplashScreen from './components/common/SplashScreen'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2600)
    return () => window.clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen onSkip={() => setShowSplash(false)} />
  }

  return <AppRoutes />
}
