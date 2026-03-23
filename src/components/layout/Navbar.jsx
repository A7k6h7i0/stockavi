import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Moon, Search, Sparkles, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode, setSearchQuery, setActiveFilter } = useStore()
  const [inputVal, setInputVal] = useState('')

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search)
      setInputVal(params.get('q') || '')
    } else {
      setInputVal('')
    }
  }, [location.pathname, location.search])

  const handleSearch = (e) => {
    e.preventDefault()

    if (!inputVal.trim()) {
      navigate('/search')
      return
    }

    const nextQuery = inputVal.trim()
    setSearchQuery(nextQuery)
    setActiveFilter('all')
    navigate(`/search?q=${encodeURIComponent(nextQuery)}`)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 rounded-[1.6rem] border border-white/60 bg-white/72 px-3 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/70 sm:px-5">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1f9d98,#0f172a)] text-white shadow-[0_18px_35px_rgba(31,157,152,0.35)]">
            <Sparkles size={16} strokeWidth={2.2} />
          </div>
          <div className="hidden sm:block">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Stock Avi
            </div>
            <div className="text-sm font-bold tracking-[-0.03em] text-neutral-900 dark:text-white">
              Premium stock media
            </div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="mx-auto flex flex-1 items-center">
          <div className="group relative w-full">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-brand-500"
            />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search photos, videos, audio..."
              className="h-11 w-full rounded-2xl border border-transparent bg-neutral-100/90 pl-11 pr-4 text-sm text-neutral-800 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-brand-500/40 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:bg-white/5 dark:text-neutral-100 dark:focus:bg-white/10"
            />
          </div>
        </form>

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={toggleDarkMode}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white/90 text-neutral-700 transition-colors hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:text-brand-300"
          aria-label="Toggle dark mode"
        >
          <AnimatedIcon darkMode={darkMode} />
        </motion.button>
      </div>
    </motion.nav>
  )
}

function AnimatedIcon({ darkMode }) {
  return (
    <motion.div
      key={darkMode ? 'sun' : 'moon'}
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      exit={{ rotate: 90, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </motion.div>
  )
}
