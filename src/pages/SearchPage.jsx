import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, SearchCode } from 'lucide-react'
import { searchMedia } from '../api/mediaApi'
import MasonryGrid from '../components/media/MasonryGrid'
import PreviewModal from '../components/media/PreviewModal'
import PageTransition from '../components/layout/PageTransition'
import SearchBar from '../components/search/SearchBar'
import FilterTabs from '../components/search/FilterTabs'
import { useDebounce } from '../hooks/useDebounce'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import useStore from '../store/useStore'

const SEARCH_PAGE_SIZE = 20

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { activeFilter, setActiveFilter } = useStore()
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '')
  const debouncedQuery = useDebounce(inputVal, 300)
  const currentQueryParam = searchParams.get('q') || ''

  useEffect(() => {
    setInputVal(currentQueryParam)
  }, [currentQueryParam])

  useEffect(() => {
    if (debouncedQuery && debouncedQuery !== currentQueryParam) {
      setSearchParams({ q: debouncedQuery }, { replace: true })
    } else if (!debouncedQuery && currentQueryParam) {
      setSearchParams({}, { replace: true })
    }
  }, [currentQueryParam, debouncedQuery, setSearchParams])

  const query = debouncedQuery || currentQueryParam

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['search', query, activeFilter],
    queryFn: ({ pageParam = 1 }) =>
      searchMedia({ q: query, type: activeFilter, page: pageParam, perPage: SEARCH_PAGE_SIZE }),
    getNextPageParam: (lastPage, pages) =>
      (lastPage.results?.length ?? 0) < SEARCH_PAGE_SIZE ? undefined : pages.length + 1,
    enabled: !!query,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 3,
  })

  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage)
  const items = data?.pages?.flatMap((page) => page.results ?? []) ?? []
  const total = data?.pages?.[0]?.total

  return (
    <PageTransition>
      <div className="relative overflow-hidden pt-20 pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(31,157,152,0.16),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(81,185,181,0.2),_transparent_52%)]" />

        <div className="sticky top-16 z-40 border-b border-neutral-200/60 bg-white/70 px-4 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/60 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/60 bg-white/85 px-4 py-3 text-sm font-semibold text-neutral-700 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-colors hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:text-brand-300"
            >
              <ArrowLeft size={16} />
              Home
            </Link>
            <div className="flex-1">
              <SearchBar
                value={inputVal}
                onChange={setInputVal}
                onClear={() => setInputVal('')}
                placeholder="Search photos, videos, audio..."
              />
            </div>
            <FilterTabs active={activeFilter} onChange={setActiveFilter} />
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8 lg:px-10">
          {query && !isLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-neutral-500 dark:text-neutral-400"
            >
              {total !== undefined ? `${total.toLocaleString()} results for ` : 'Results for '}
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">"{query}"</span>
            </motion.p>
          )}

          {!query && (
            <div className="flex min-h-[52vh] items-center justify-center">
              <div className="w-full max-w-2xl rounded-[2rem] border border-white/60 bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                  <SearchCode size={28} />
                </div>
                <p className="mt-6 text-2xl font-bold tracking-[-0.04em] text-neutral-950 dark:text-white">
                  Search for photos, videos, or audio
                </p>
                <p className="mt-3 text-base leading-7 text-neutral-500 dark:text-neutral-400">
                  Start with a topic like cinematic, nature, startup, or ambient and refine by media type.
                </p>
              </div>
            </div>
          )}
        </div>

        {query && (
          <section className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-10">
            {isError && (
              <div className="rounded-[1.75rem] border border-red-200/70 bg-red-50/80 py-20 text-center text-red-500 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                Something went wrong. Please try again.
              </div>
            )}

            {!isLoading && items.length === 0 && !isError && (
              <div className="rounded-[1.75rem] border border-neutral-200/70 bg-white/80 py-24 text-center text-neutral-400 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
                No results found for "{query}". Try a different keyword.
              </div>
            )}

            <MasonryGrid
              items={items}
              isLoading={isLoading || isFetchingNextPage}
              skeletonCount={isLoading ? 16 : 8}
            />

            <div ref={sentinelRef} className="h-10" />
          </section>
        )}
      </div>

      <PreviewModal />
    </PageTransition>
  )
}
