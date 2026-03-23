export default function Badge({ children, color = 'default' }) {
  const colors = {
    default:
      'border-neutral-200/70 bg-neutral-100 text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300',
    photo:
      'border-sky-200/80 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300',
    video:
      'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300',
    audio:
      'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${colors[color] || colors.default}`}
    >
      {children}
    </span>
  )
}
