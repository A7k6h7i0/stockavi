import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search...' }) {
  return (
    <div className="group relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-brand-500"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-[1.5rem] border border-white/60 bg-white/90 pl-12 pr-12 text-sm font-medium text-neutral-900 shadow-[0_16px_50px_rgba(15,23,42,0.08)] outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-brand-500/40 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-neutral-100"
      />
      {value && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onClear}
          className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-300 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/20"
          aria-label="Clear search"
        >
          <X size={12} />
        </motion.button>
      )}
    </div>
  )
}
