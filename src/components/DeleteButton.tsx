import { animate, motion } from 'motion/react'
import { useRef, useState } from 'react'

const FILL_DURATION = 1.2

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  )
}

export function DeleteButton({
  onDelete,
  className,
}: {
  onDelete?: () => void
  className?: string
} = {}) {
  const fillRef = useRef<HTMLSpanElement>(null)
  const fillAnimationRef = useRef<ReturnType<typeof animate> | null>(null)
  const [isPressing, setIsPressing] = useState(false)

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (!fillRef.current) return

    event.currentTarget.setPointerCapture(event.pointerId)
    setIsPressing(true)
    fillAnimationRef.current?.stop()

    fillAnimationRef.current = animate(
      fillRef.current,
      { scaleX: 1 },
      {
        duration: FILL_DURATION,
        ease: 'linear',
        onComplete: () => onDelete?.(),
      },
    )
  }

  function resetFill() {
    if (!fillRef.current) return

    fillAnimationRef.current?.stop()
    fillAnimationRef.current = animate(
      fillRef.current,
      { scaleX: 0 },
      { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
    )
    setIsPressing(false)
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    resetFill()
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    resetFill()
  }

  return (
    <motion.button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
      className={`relative flex select-none items-center gap-2 overflow-hidden rounded-full bg-[#ffc2c3] px-[12px] py-[8px] text-sm font-medium touch-none ${className ?? ''}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
    >
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute inset-0 origin-left bg-[#ff4649]"
        style={{ transform: 'scaleX(0)' }}
      />

      <motion.span
        className="relative z-10 flex items-center gap-2"
        animate={{ color: isPressing ? '#ef233c' : '#ba181b' }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
      >
        <TrashIcon />
        Delete
      </motion.span>
    </motion.button>
  )
}
