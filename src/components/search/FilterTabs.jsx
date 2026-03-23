import { motion } from 'framer-motion'
import { Film, Image, LayoutGrid, Music } from 'lucide-react'

const FILTERS = [
  { id: 'all', label: 'All', Icon: LayoutGrid },
  { id: 'photo', label: 'Photos', Icon: Image },
  { id: 'video', label: 'Videos', Icon: Film },
  { id: 'audio', label: 'Audio', Icon: Music },
]

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-[1.4rem] border border-white/60 bg-white/75 p-1.5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
      {FILTERS.map(({ id, label, Icon }) => {
        const isActive = active === id

        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            whileTap={{ scale: 0.96 }}
            className={`relative flex items-center gap-2 rounded-[1rem] px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              isActive
                ? 'text-white'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="filter-pill"
                className="absolute inset-0 rounded-[1rem] bg-[linear-gradient(135deg,#1f9d98,#143f3d)] shadow-[0_16px_35px_rgba(31,157,152,0.35)]"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <Icon size={14} className="relative z-10" />
            <span className="relative z-10">{label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
