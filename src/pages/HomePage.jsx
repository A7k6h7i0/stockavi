import { useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Layers3, PlayCircle, Sparkles, Waves } from 'lucide-react'
import { fetchFeed } from '../api/mediaApi'
import MasonryGrid from '../components/media/MasonryGrid'
import PreviewModal from '../components/media/PreviewModal'
import PageTransition from '../components/layout/PageTransition'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

const FEED_PAGE_SIZE = 20
const FEATURE_PILLS = [
  { label: 'Curated photos', Icon: Layers3 },
  { label: 'Hover video previews', Icon: PlayCircle },
  { label: 'Audio discovery', Icon: Waves },
]

export default function HomePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => fetchFeed({ page: pageParam, perPage: FEED_PAGE_SIZE }),
    getNextPageParam: (lastPage, pages) =>
      (lastPage.results?.length ?? 0) < FEED_PAGE_SIZE ? undefined : pages.length + 1,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  })

  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage)
  const items = data?.pages?.flatMap((page) => page.results ?? []) ?? []
  const spotlightCount = items.length ? `${items.length}+` : '20+'

  return (
    <PageTransition>
      <div className="relative overflow-hidden pt-20 pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(31,157,152,0.2),_transparent_58%),radial-gradient(circle_at_80%_20%,_rgba(15,23,42,0.1),_transparent_32%)] dark:bg-[radial-gradient(circle_at_top,_rgba(81,185,181,0.22),_transparent_52%),radial-gradient(circle_at_80%_20%,_rgba(15,23,42,0.34),_transparent_28%)]" />

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mx-auto grid max-w-[1600px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-16"
        >
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 shadow-[0_10px_40px_rgba(31,157,152,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-brand-300"
            >
              <Sparkles size={12} />
              Premium stock discovery
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className="mt-6 text-5xl font-extrabold tracking-[-0.05em] text-neutral-950 dark:text-white sm:text-6xl lg:text-7xl"
            >
              Discover modern stock media with a gallery that feels editorial, not generic.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-300 sm:text-lg"
            >
              Browse photos, video, and audio from multiple premium sources in one fluid feed with
              fast search, immersive previews, and a full-bleed browsing experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/search?q=cinematic"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(7,19,21,0.22)] transition-transform duration-200 hover:-translate-y-0.5 dark:bg-white dark:text-neutral-950"
              >
                Explore cinematic
                <ArrowRight size={16} />
              </Link>
              <div className="inline-flex items-center rounded-2xl border border-white/60 bg-white/70 px-5 py-3 text-sm text-neutral-600 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                Live feed powered by your Stock Avi backend
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.55 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {FEATURE_PILLS.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/80 px-4 py-2 text-sm text-neutral-700 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-neutral-200"
                >
                  <Icon size={15} className="text-brand-500" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Spotlight</p>
                <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-neutral-950 dark:text-white">{spotlightCount}</p>
              </div>
              <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 px-3 py-2 text-sm font-medium text-brand-700 dark:text-brand-300">
                Fresh media
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,rgba(31,157,152,0.12),rgba(255,255,255,0.85))] p-5 dark:bg-[linear-gradient(135deg,rgba(31,157,152,0.18),rgba(255,255,255,0.06))]">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">Search themes</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['architecture', 'wildlife', 'ambient', 'startup'].map((term) => (
                    <Link
                      key={term}
                      to={`/search?q=${encodeURIComponent(term)}`}
                      className="rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-950 hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-neutral-950"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  ['Sources', 'Pexels, Unsplash, Pixabay'],
                  ['Motion', 'Hover previews and animated transitions'],
                  ['Audio', 'Sound effects and music in one place'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[1.35rem] border border-neutral-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">{label}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-200">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </motion.section>

        <section className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-10">
          {isError && (
            <div className="rounded-[1.75rem] border border-red-200/70 bg-red-50/80 py-20 text-center text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              Failed to load media. Please try again.
            </div>
          )}

          <MasonryGrid
            items={items}
            isLoading={isLoading || isFetchingNextPage}
            skeletonCount={isLoading ? 16 : 8}
          />

          <div ref={sentinelRef} className="h-10" />

          {isFetchingNextPage && (
            <div className="py-8 text-center text-sm text-neutral-400">Loading more...</div>
          )}
        </section>
      </div>

      <PreviewModal />
    </PageTransition>
  )
}
