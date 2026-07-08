import { type ReactNode, useRef } from 'react'

type Testimonial = {
  id: string
  name: string
  job: string
  description: string
  initials: string
  avatarColor: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Lucas Mesquita',
    job: 'Product Designer',
    description:
      'The motion details feel intentional. Every interaction adds clarity without getting in the way.',
    initials: 'LM',
    avatarColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: '2',
    name: 'Ana Ribeiro',
    job: 'Frontend Engineer',
    description:
      'Smooth, fast, and polished. This is the kind of UI craft I want on every project.',
    initials: 'AR',
    avatarColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    job: 'Design Lead',
    description:
      'Subtle animations that make the product feel alive. Great balance between style and usability.',
    initials: 'PC',
    avatarColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: '4',
    name: 'Marina Silva',
    job: 'UX Researcher',
    description:
      'Users noticed the quality immediately. The interface feels more trustworthy and responsive.',
    initials: 'MS',
    avatarColor: 'bg-rose-100 text-rose-700',
  },
  {
    id: '5',
    name: 'João Alves',
    job: 'Creative Director',
    description:
      'Clean execution with strong attention to timing. It looks simple, but the details are excellent.',
    initials: 'JA',
    avatarColor: 'bg-sky-100 text-sky-700',
  },
]

const GAP = 'gap-4'
const MARQUEE_DURATION = 24
const HOVER_PLAYBACK_RATE = 0.7
const PLAYBACK_TRANSITION_MS = 400

const PROGRESSIVE_BLUR_LAYERS = [
  { blur: 1, stop: 30 },
  { blur: 2, stop: 55 },
  { blur: 4, stop: 80 },
  { blur: 8, stop: 100 },
]

function ProgressiveBlurEdge({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left'
  const fadeDirection = isLeft ? 'to right' : 'to left'
  const fadeClass = isLeft
    ? 'bg-gradient-to-r from-neutral-100/90 to-transparent'
    : 'bg-gradient-to-l from-neutral-100/90 to-transparent'

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 z-10 w-36 ${
        isLeft ? 'left-0' : 'right-0'
      }`}
    >
      {PROGRESSIVE_BLUR_LAYERS.map(({ blur, stop }) => (
        <div
          key={blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(${fadeDirection}, black 0%, transparent ${stop}%)`,
            WebkitMaskImage: `linear-gradient(${fadeDirection}, black 0%, transparent ${stop}%)`,
          }}
        />
      ))}

      <div className={`absolute inset-0 ${fadeClass}`} />
    </div>
  )
}

type MarqueeProps = {
  direction: 'left' | 'right'
  children: ReactNode
}

function setTrackPlaybackRate(track: HTMLDivElement, rate: number) {
  track.getAnimations().forEach((animation) => {
    animation.playbackRate = rate
  })
}

export function Marquee({ direction, children }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const playbackRateRef = useRef(1)
  const playbackRafRef = useRef<number | null>(null)

  function cancelPlaybackAnimation() {
    if (playbackRafRef.current !== null) {
      cancelAnimationFrame(playbackRafRef.current)
      playbackRafRef.current = null
    }
  }

  function animatePlaybackRate(
    track: HTMLDivElement,
    from: number,
    to: number,
    onComplete?: () => void,
  ) {
    cancelPlaybackAnimation()

    const start = performance.now()

    function frame(now: number) {
      const progress = Math.min((now - start) / PLAYBACK_TRANSITION_MS, 1)
      const eased = 1 - (1 - progress) ** 3
      const rate = from + (to - from) * eased

      setTrackPlaybackRate(track, rate)

      if (progress < 1) {
        playbackRafRef.current = requestAnimationFrame(frame)
      } else {
        playbackRafRef.current = null
        onComplete?.()
      }
    }

    playbackRafRef.current = requestAnimationFrame(frame)
  }

  function handleMouseEnter() {
    const track = trackRef.current
    if (!track) return

    animatePlaybackRate(track, playbackRateRef.current, HOVER_PLAYBACK_RATE, () => {
      playbackRateRef.current = HOVER_PLAYBACK_RATE
    })
  }

  function handleMouseLeave() {
    const track = trackRef.current
    if (!track) return

    animatePlaybackRate(track, playbackRateRef.current, 1, () => {
      playbackRateRef.current = 1
    })
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className={`marquee-track flex w-max ${GAP} ${
          direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'
        }`}
        style={{ animationDuration: `${MARQUEE_DURATION}s` }}
      >
        <div className={`flex shrink-0 items-stretch ${GAP}`}>{children}</div>
        <div
          className={`flex shrink-0 items-stretch ${GAP}`}
          aria-hidden="true"
        >
          {children}
        </div>
      </div>

      <ProgressiveBlurEdge side="left" />
      <ProgressiveBlurEdge side="right" />
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="w-72 shrink-0 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${testimonial.avatarColor}`}
        >
          {testimonial.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-900">
            {testimonial.name}
          </p>
          <p className="truncate text-xs text-neutral-500">{testimonial.job}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        {testimonial.description}
      </p>
    </article>
  )
}

function MarqueeContent() {
  return (
    <>
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </>
  )
}

export function MarqueePage() {
  return (
    <div className={`flex w-full max-w-4xl flex-col ${GAP}`}>
      <Marquee direction="left">
        <MarqueeContent />
      </Marquee>

      <Marquee direction="right">
        <MarqueeContent />
      </Marquee>
    </div>
  )
}
