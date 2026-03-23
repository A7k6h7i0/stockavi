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
  const audioSource = media?.largeUrl || media?.originalUrl
  const downloadUrl = media?.type === 'audio' ? audioSource || media?.originalUrl : media?.originalUrl
  const copyUrl = media?.originalUrl || media?.pageUrl || downloadUrl

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
      await navigator.clipboard.writeText(copyUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = media.title || 'media'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

  const renderEmbeddedAction = () => (
    <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-4 px-5 py-6 text-center text-white sm:gap-5 sm:px-6 sm:py-10">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl sm:h-28 sm:w-28 sm:animate-float-slow">
        {media.type === 'audio' ? <Music2 size={40} /> : <PlayCircle size={44} />}
      </div>
      <div>
        <p className="text-xl font-bold leading-tight tracking-[-0.03em] sm:text-2xl">
          {media.title || 'Media preview'}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/65 sm:leading-7">
          Some third-party hosts block embedded playback. Load the preview only when needed.
        </p>
      </div>
      {!mediaBlocked ? (
        <Button
          onClick={() => setLoadEmbeddedMedia(true)}
          variant="glass"
          className="w-full border-white/20 px-5 sm:w-auto"
        >
          <PlayCircle size={16} />
          Load Preview
        </Button>
      ) : (
        <div className="w-full space-y-3">
          <p className="text-sm text-white/75">
            This source blocked inline playback in the browser. You can still open or download it.
          </p>
          <a
            href={audioSource || media.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:w-auto"
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6"
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
            className="relative z-10 flex h-[calc(100vh-1rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.4)] dark:bg-neutral-900 sm:max-h-[92vh] sm:h-auto sm:rounded-[2rem] lg:flex-row"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={clearPreviewMedia}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-xl transition-colors hover:bg-black/50 sm:right-4 sm:top-4"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>

            <div className="relative flex min-h-[250px] shrink-0 items-center justify-center overflow-hidden bg-ink-950 sm:min-h-[320px] lg:w-[62%]">
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
                  <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-4 px-5 py-6 text-white sm:gap-6 sm:px-6 sm:py-10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl sm:h-28 sm:w-28 sm:animate-float-slow">
                      <Music2 size={40} />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold leading-tight tracking-[-0.03em] sm:text-2xl">
                        {media.title || 'Audio track'}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        Listen and download the original source file.
                      </p>
                    </div>
                    <audio
                      controls
                      src={audioSource}
                      preload="none"
                      onError={() => {
                        setMediaBlocked(true)
                        setLoadEmbeddedMedia(false)
                      }}
                      className="w-full max-w-md"
                    />
                  </div>
                ) : (
                  renderEmbeddedAction()
                ))}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 sm:p-8 lg:w-[38%]">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color={media.type}>{media.type}</Badge>
                {media.source && <Badge>{media.source}</Badge>}
              </div>

              <h2 className="mt-4 text-xl font-extrabold leading-tight tracking-[-0.04em] text-neutral-950 dark:text-white sm:mt-5 sm:text-2xl">
                {media.title || 'Untitled'}
              </h2>

              {media.author?.name && (
                <div className="mt-5 flex items-center gap-3 rounded-[1.25rem] border border-neutral-200/80 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/5 sm:mt-6 sm:rounded-[1.4rem]">
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
                <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 sm:mt-5">
                  {media.width} x {media.height} px
                </div>
              )}

              {media.tags?.length > 0 && (
                <div className="mt-5 sm:mt-6">
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
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-brand-500 dark:text-neutral-400 dark:hover:text-brand-300 sm:mt-6"
                >
                  <ExternalLink size={14} />
                  View original source
                </a>
              )}

              <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:pt-8">
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
