export default function SkeletonCard({ height = 280 }) {
  return (
    <div
      className="rounded-2xl overflow-hidden skeleton"
      style={{ height: `${height}px` }}
    />
  )
}
