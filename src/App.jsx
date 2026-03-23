import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import useStore from './store/useStore'

export default function App() {
  const location = useLocation()
  const { darkMode } = useStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
