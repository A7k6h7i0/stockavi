import { motion } from 'framer-motion'

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 cursor-pointer select-none'

  const variants = {
    primary:
      'bg-[linear-gradient(135deg,#1f9d98,#143f3d)] text-white shadow-[0_18px_35px_rgba(31,157,152,0.35)] hover:-translate-y-0.5',
    secondary:
      'border border-neutral-200/80 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10',
    ghost:
      'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5',
    glass:
      'border border-white/20 bg-white/15 text-white backdrop-blur-xl hover:bg-white/25',
  }

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
