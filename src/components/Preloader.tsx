import { animate, AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

type PreloaderProps = {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 2.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => setProgress(Math.round(value)),
      onComplete: () => setIsExiting(true),
    })

    return () => controls.stop()
  }, [])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-100"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="max-w-xs text-center text-sm font-medium tracking-tight text-neutral-900"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            This is my study of animation
          </motion.h1>

          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="h-[2px] w-28 overflow-hidden rounded-full bg-neutral-200">
              <motion.div
                className="h-full origin-left rounded-full bg-neutral-900"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.1, ease: 'linear' }}
                style={{ width: '100%' }}
              />
            </div>

            <motion.span
              className="text-[10px] tabular-nums text-neutral-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {progress}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
