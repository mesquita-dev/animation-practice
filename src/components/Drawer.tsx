import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

const backdropTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
}

const panelTransition = {
  type: 'spring' as const,
  duration: 0.55,
  bounce: 0,
}

export function DrawerPage() {
  const [open, setOpen] = useState(false)
  const titleId = useId()

  const close = useCallback(() => setOpen(false), [])
  const openDrawer = useCallback(() => setOpen(true), [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        close()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close, open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:border-indigo-400"
      >
        Open drawer
      </button>

      {createPortal(
        <AnimatePresence mode="popLayout">
          {open && (
            <>
              <motion.button
                type="button"
                aria-label="Fechar drawer"
                className="fixed inset-0 z-40 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={backdropTransition}
                onClick={close}
              />

              <motion.aside
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-neutral-200 bg-white shadow-2xl shadow-black/10"
                initial={{ x: '100%', opacity: 0.98 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.98 }}
                transition={panelTransition}
              >
                <header className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                  <h2 id={titleId} className="text-sm font-medium text-neutral-900">
                    Drawer
                  </h2>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Fechar"
                    className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <CloseIcon />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-sm text-neutral-600">
                    Conteúdo do drawer. Você pode colocar formulários, menus ou
                    qualquer painel lateral aqui.
                  </p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}
