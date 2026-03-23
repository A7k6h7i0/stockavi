import Masonry from 'react-masonry-css'
import MediaCard from './MediaCard'
import SkeletonCard from './SkeletonCard'

const BREAKPOINTS = {
  default: 4,
  1280: 4,
  1024: 3,
  768: 2,
  480: 2,
  0: 1,
}

const SKELETON_HEIGHTS = [280, 360, 240, 320, 300, 420, 260, 380]

export default function MasonryGrid({ items, isLoading, skeletonCount = 12 }) {
  return (
    <Masonry
      breakpointCols={BREAKPOINTS}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {items.map((item, i) => (
        <MediaCard key={item.id} item={item} index={i} />
      ))}

      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard
            key={`skeleton-${i}`}
            height={SKELETON_HEIGHTS[i % SKELETON_HEIGHTS.length]}
          />
        ))}
    </Masonry>
  )
}
