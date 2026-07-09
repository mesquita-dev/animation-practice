import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { FlowNumber, FlowStopwatch, FlowValue } from './number-flow/FlowNumber'

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <p className="mb-4 text-xs font-medium text-neutral-400">{title}</p>
      {children}
    </div>
  )
}

function StopwatchCard() {
  const [seconds, setSeconds] = useState(10)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (!running || finished) return

    if (seconds === 0) {
      setRunning(false)
      setFinished(true)
      return
    }

    const timer = window.setTimeout(() => {
      setSeconds((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [running, finished, seconds])

  function handleStart() {
    setSeconds(10)
    setFinished(false)
    setRunning(true)
    setRunId((current) => current + 1)
  }

  return (
    <Card title="Stopwatch">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TimerIcon />
          <FlowStopwatch
            key={runId}
            value={seconds}
            className="text-4xl font-medium text-neutral-900"
          />
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={running}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {running ? 'Running...' : finished ? 'Restart' : 'Start'}
        </button>
      </div>
    </Card>
  )
}

function NumberChangeCard() {
  const [value, setValue] = useState(1284)
  const [price, setPrice] = useState(124.23)
  const [change, setChange] = useState(5.64)

  function randomize() {
    setValue(Math.floor(Math.random() * 9900) + 100)
    setPrice(Math.floor(Math.random() * 990) + 10 + Math.random())
    setChange(Number((Math.random() * 40 - 20).toFixed(2)))
  }

  return (
    <Card title="Number changes">
      <button
        type="button"
        onClick={randomize}
        className="flex w-full flex-col items-center gap-4 text-center transition-opacity hover:opacity-80"
      >
        <FlowNumber
          value={value}
          className="text-4xl font-medium text-neutral-900"
        />

        <div className="flex items-center justify-center gap-3">
          <FlowValue
            value={price}
            prefix="$"
            decimals={2}
            className="text-xl font-medium text-neutral-900"
          />
          <FlowValue
            value={change}
            prefix={change >= 0 ? '+' : ''}
            suffix="%"
            decimals={2}
            className={`text-sm font-medium ${
              change >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          />
        </div>

        <span className="text-xs text-neutral-400">Click to change</span>
      </button>
    </Card>
  )
}

type CounterItem = {
  id: 'reply' | 'repost' | 'like'
  count: number
  active?: boolean
}

function XCounterCard() {
  const [counters, setCounters] = useState<CounterItem[]>([
    { id: 'reply', count: 24 },
    { id: 'repost', count: 12 },
    { id: 'like', count: 847, active: false },
  ])

  function changeAllStats() {
    setCounters((current) =>
      current.map((item) => ({
        ...item,
        count: Math.floor(Math.random() * 900) + 10,
      })),
    )
  }

  function toggleLike() {
    setCounters((current) =>
      current.map((item) => {
        if (item.id !== 'like') return item

        const active = !item.active
        return {
          ...item,
          active,
          count: active ? item.count + 1 : item.count - 1,
        }
      }),
    )
  }

  return (
    <Card title="Counter">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={changeAllStats}
          className="shrink-0 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Change all stats
        </button>

        <div className="flex items-center gap-5">
          {counters.map((item) => {
            const isLike = item.id === 'like'

            return (
              <div key={item.id} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={isLike ? toggleLike : undefined}
                  className={isLike ? 'cursor-pointer' : 'cursor-default'}
                  tabIndex={isLike ? 0 : -1}
                >
                  <motion.span
                    whileTap={isLike ? { scale: 0.85 } : undefined}
                    animate={
                      isLike && item.active
                        ? { scale: [1, 1.2, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.25 }}
                    className={
                      isLike && item.active
                        ? 'text-red-500'
                        : 'text-neutral-400'
                    }
                  >
                    {item.id === 'reply' && <ReplyIcon />}
                    {item.id === 'repost' && <RepostIcon />}
                    {item.id === 'like' && <LikeIcon filled={item.active} />}
                  </motion.span>
                </button>

                <FlowNumber
                  value={item.count}
                  className={`text-sm leading-none ${
                    isLike && item.active
                      ? 'text-red-500'
                      : 'text-neutral-500'
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export function NumberFlowPage() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <StopwatchCard />
      <NumberChangeCard />
      <XCounterCard />
    </div>
  )
}

function TimerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 text-neutral-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  )
}

function ReplyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 2.25c-2.305 0-4.433.393-6.288 1.078C4.128 3.56 3 4.954 3 6.556v8.205Z"
      />
    </svg>
  )
}

function RepostIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.137-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.137 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3 3-3"
      />
    </svg>
  )
}

function LikeIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px]"
      fill={filled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  )
}
