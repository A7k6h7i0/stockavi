import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Download, ExternalLink, Music2, PlayCircle, Tag, User, X } from 'lucide-react'
import useStore from '../../store/useStore'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function PreviewModal() {
  const { previewMedia: media, clearPreviewMedia } = useStore()
  const [copied, setCopied] = useState(false)
  const [loadEmbeddedMedia, setLoadEmbeddedMedia] = useState(false)
  const [mediaBlocked, setMediaBlocked] = useState(false)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (media) {
      document.body.style.overflow = 'hidden'
      closeButtonRef.current?.focus()
      setLoadEmbeddedMedia(false)
      setMediaBlocked(false)
    } else {
      document.body.style.overflow = ''
      setCopied(false)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [media])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        clearPreviewMedia()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clearPreviewMedia])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(media.originalUrl || media.previewUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = media.originalUrl
    link.download = media.title || 'media'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

  const renderEmbeddedAction = () => (
    <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-5 px-6 py-10 text-center text-white">
      <div className="flex h-28 w-28 animate-float-slow items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl">
        {media.type === 'audio' ? <Music2 size={40} /> : <PlayCircle size={44} />}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-[-0.03em]">{media.title || 'Media preview'}</p>
        <p className="mt-2 text-sm leading-7 text-white/65">
          Some third-party hosts block embedded playback. Load the preview only when needed.
        </p>
      </div>
      {!mediaBlocked ? (
        <Button
          onClick={() => setLoadEmbeddedMedia(true)}
          variant="glass"
          className="border-white/20 px-5"
        >
          <PlayCircle size={16} />
          Load Preview
        </Button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-white/75">
            This source blocked inline playback in the browser. You can still open or download it.
          </p>
          <a
            href={media.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            <ExternalLink size={15} />
            Open Original Media
          </a>
        </div>
      )}
    </div>
  )

  return (
    <AnimatePresence>
      {media && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          onClick={clearPreviewMedia}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={media.title || 'Media preview'}
            className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.4)] dark:bg-neutral-900 lg:flex-row"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={clearPreviewMedia}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-xl transition-colors hover:bg-black/50"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>

            <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-ink-950 lg:w-[62%]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(31,157,152,0.28),_transparent_36%)]" />

              {media.type === 'photo' && (
                <img
                  src={media.largeUrl || media.previewUrl}
                  alt={media.title || 'Preview'}
                  className="relative z-10 h-full w-full object-contain"
                />
              )}

              {media.type === 'video' &&
                (loadEmbeddedMedia && !mediaBlocked ? (
                  <video
                    src={media.originalUrl}
                    poster={media.previewUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    preload="none"
                    onError={() => {
                      setMediaBlocked(true)
                      setLoadEmbeddedMedia(false)
                    }}
                    className="relative z-10 h-full w-full object-contain"
                  />
                ) : (
                  renderEmbeddedAction()
                ))}

              {media.type === 'audio' &&
                (loadEmbeddedMedia && !mediaBlocked ? (
                  <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 px-6 py-10 text-white">
                    <div className="flex h-28 w-28 animate-float-slow items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl">
                      <Music2 size={40} />
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold tracking-[-0.03em]">{media.title || 'Audio track'}</p>
                      <p className="mt-2 text-sm text-white/65">Listen and download the original source file.</p>
                    </div>
                    <audio
                      controls
                      src={media.originalUrl}
                      preload="none"
                      onError={() => {
                        setMediaBlocked(true)
                        setLoadEmbeddedMedia(false)
                      }}
                      className="w-full"
                    />
                  </div>
                ) : (
                  renderEmbeddedAction()
                ))}
            </div>

            <div className="flex flex-col overflow-y-auto p-6 sm:p-8 lg:w-[38%]">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color={media.type}>{media.type}</Badge>
                {media.source && <Badge>{media.source}</Badge>}
              </div>

              <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.04em] text-neutral-950 dark:text-white">
                {media.title || 'Untitled'}
              </h2>

              {media.author?.name && (
                <div className="mt-6 flex items-center gap-3 rounded-[1.4rem] border border-neutral-200/80 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1f9d98,#143f3d)] text-white shadow-[0_14px_28px_rgba(31,157,152,0.28)]">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">Author</p>
                    {media.author.url ? (
                      <a
                        href={media.author.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm font-semibold text-brand-600 hover:text-brand-500"
                      >
                        {media.author.name}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                        {media.author.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {media.width && media.height && (
                <div className="mt-5 text-sm text-neutral-500 dark:text-neutral-400">
                  {media.width} x {media.height} px
                </div>
              )}

              {media.tags?.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-neutral-400">
                    <Tag size={12} />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {media.tags.slice(0, 12).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neutral-200/80 bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {media.pageUrl && (
                <a
                  href={media.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-brand-500 dark:text-neutral-400 dark:hover:text-brand-300"
                >
                  <ExternalLink size={14} />
                  View original source
                </a>
              )}

              <div className="mt-auto flex gap-3 pt-8">
                <Button onClick={handleDownload} variant="primary" className="flex-1">
                  <Download size={15} />
                  Download
                </Button>
                <Button onClick={handleCopy} variant="secondary" className="flex-1">
                  <Copy size={15} />
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
