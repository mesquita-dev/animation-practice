import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const backdropTransition = {
  duration: 0.15,
  ease: [0.23, 1, 0.32, 1] as const,
}

const panelSpring = {
  type: 'spring' as const,
  duration: 0.32,
  bounce: 0.08,
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()

  const close = useCallback(() => setOpen(false), [])
  const openPalette = useCallback(() => setOpen(true), [])
  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggle()
      }

      if (event.key === 'Escape' && open) {
        event.preventDefault()
        close()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close, open, toggle])

  useEffect(() => {
    if (!open) return

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="flex w-full max-w-sm items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-left transition-colors hover:border-indigo-400"
      >
        <SearchIcon />
        <span className="flex-1 text-sm text-neutral-400">command palette</span>
        <span className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      {createPortal(
        <AnimatePresence mode="popLayout">
          {open && (
            <>
              <motion.button
                type="button"
                aria-label="Fechar command palette"
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={backdropTransition}
                onClick={close}
              />

              <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[20vh]">
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  className="w-full max-w-lg origin-center overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl shadow-black/10"
                  initial={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
                  transition={panelSpring}
                >
                  <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
                    <SearchIcon />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Digite um comando ou pesquise..."
                      className="flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                    <span className="hidden items-center gap-1 sm:flex">
                      <Kbd>esc</Kbd>
                    </span>
                  </div>

                  <div className="px-4 py-8 text-center">
                    <p id={titleId} className="text-sm text-neutral-500">
                      Nenhum comando disponível ainda
                    </p>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
      {children}
    </kbd>
  )
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 text-neutral-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  )
}
