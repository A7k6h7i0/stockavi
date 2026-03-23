import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, Music, Play } from 'lucide-react'
import useStore from '../../store/useStore'
import Badge from '../ui/Badge'

export default function MediaCard({ item, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [videoBlocked, setVideoBlocked] = useState(false)
  const videoRef = useRef(null)
  const { setPreviewMedia } = useStore()

  const handleOpenPreview = () => setPreviewMedia(item)

  const handleMouseEnter = () => {
    setHovered(true)

    if (item.type === 'video' && !videoBlocked) {
      setVideoEnabled(true)
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setVideoEnabled(false)

    if (item.type === 'video' && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleVideoCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = item.originalUrl
    link.download = item.title || 'media'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

  const aspectRatio =
    item.width && item.height ? Math.min(Math.max(item.height / item.width, 0.62), 1.8) : 1
  const cardHeight = Math.round(300 * aspectRatio)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.45), ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOpenPreview}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleOpenPreview()
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/75 shadow-[0_24px_70px_rgba(15,23,42,0.12)] outline-none transition-transform duration-300 focus-visible:ring-4 focus-visible:ring-brand-500/20 dark:border-white/10 dark:bg-white/5"
      style={{ height: `${cardHeight}px` }}
    >
      {!imgLoaded && item.type !== 'audio' && <div className="absolute inset-0 skeleton" />}

      {item.type === 'photo' && (
        <img
          src={item.previewUrl}
          alt={item.title || 'Media'}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-cover transition duration-700 ${hovered ? 'scale-[1.06]' : 'scale-100'} ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {item.type === 'video' && (
        <>
          <img
            src={item.previewUrl}
            alt={item.title || 'Video preview'}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${videoEnabled && !videoBlocked ? 'opacity-0' : 'opacity-100'}`}
          />

          {videoEnabled && !videoBlocked && (
            <video
              ref={videoRef}
              src={item.originalUrl}
              poster={item.previewUrl}
              muted
              loop
              playsInline
              preload="none"
              onCanPlay={handleVideoCanPlay}
              onError={() => {
                setVideoBlocked(true)
                setVideoEnabled(false)
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {!hovered && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-xl">
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </div>
            </div>
          )}
        </>
      )}

      {item.type === 'audio' && (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(31,157,152,0.32),_transparent_40%),linear-gradient(135deg,rgba(10,20,24,0.96),rgba(31,157,152,0.72))] px-4 text-center text-white">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <motion.div
            animate={hovered ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ repeat: hovered ? Infinity : 0, duration: 1.2 }}
            className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/15 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          >
            <Music size={30} />
          </motion.div>
          <p className="mt-4 max-w-[16rem] text-sm font-semibold leading-6 text-white/90">
            {item.title || 'Audio Track'}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/55">Open to play</p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent opacity-80" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex flex-col justify-between p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <Badge color={item.type}>{item.type}</Badge>
          {item.source && (
            <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-xl">
              {item.source}
            </span>
          )}
        </div>

        <div className="pointer-events-auto">
          {item.author?.name && (
            <p className="mb-3 truncate text-xs font-medium text-white/80">by {item.author.name}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenPreview()
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/15 py-2.5 text-xs font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/25"
            >
              <Eye size={13} />
              Preview
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1f9d98,#143f3d)] py-2.5 text-xs font-semibold text-white shadow-[0_14px_30px_rgba(31,157,152,0.3)] transition-transform hover:-translate-y-0.5"
            >
              <Download size={13} />
              Download
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
