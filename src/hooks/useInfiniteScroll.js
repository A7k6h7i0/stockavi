import { useEffect, useRef } from 'react'

export function useInfiniteScroll(onLoadMore, hasNextPage, isFetchingNextPage) {
  const sentinelRef = useRef(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [onLoadMore, hasNextPage, isFetchingNextPage])

  return sentinelRef
}
