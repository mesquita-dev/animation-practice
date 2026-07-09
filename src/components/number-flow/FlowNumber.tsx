import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const DIGIT_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const digitSpring = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 28,
  mass: 0.85,
}

function findNextDigitIndex(
  current: number,
  targetDigit: number,
  trend: 'up' | 'down',
) {
  if (DIGIT_STRIP[current] === targetDigit) return current

  const forward: number[] = []
  const backward: number[] = []

  for (let index = 0; index < DIGIT_STRIP.length; index += 1) {
    if (DIGIT_STRIP[index] !== targetDigit) continue
    if (index >= current) forward.push(index)
    else backward.push(index)
  }

  const forwardDistance = forward.length ? forward[0] - current : Infinity
  const backwardDistance = backward.length
    ? current - backward[backward.length - 1]
    : Infinity

  if (forward.length === 0) return backward[backward.length - 1]
  if (backward.length === 0) return forward[0]

  if (trend === 'up') {
    return forwardDistance <= backwardDistance
      ? forward[0]
      : backward[backward.length - 1]
  }

  return backwardDistance <= forwardDistance
    ? backward[backward.length - 1]
    : forward[0]
}

function initialDigitIndex(digit: number) {
  return DIGIT_STRIP.indexOf(digit)
}

function DigitColumn({
  strip,
  offsetIndex,
  shouldAnimate,
}: {
  strip: number[]
  offsetIndex: number
  shouldAnimate: boolean
}) {
  const rowHeight = 100 / strip.length

  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden align-baseline"
      style={{
        width: '0.65em',
        height: '1em',
        lineHeight: 1,
        fontSize: 'inherit',
      }}
    >
      <motion.span
        className="absolute left-0 top-0 w-full will-change-transform"
        style={{ height: `${strip.length * 100}%` }}
        initial={false}
        animate={{ y: `-${offsetIndex * rowHeight}%` }}
        transition={shouldAnimate ? digitSpring : { duration: 0 }}
      >
        {strip.map((value, index) => (
          <span
            key={index}
            className="flex items-center justify-center"
            style={{ height: `${rowHeight}%` }}
          >
            {value}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

type FlowSmartDigitProps = {
  digit: number
  shouldAnimate: boolean
  trend: 'up' | 'down'
}

function FlowSmartDigit({ digit, shouldAnimate, trend }: FlowSmartDigitProps) {
  const indexRef = useRef(initialDigitIndex(digit))
  const [offsetIndex, setOffsetIndex] = useState(indexRef.current)

  useEffect(() => {
    if (!shouldAnimate) return

    const nextIndex = findNextDigitIndex(indexRef.current, digit, trend)
    indexRef.current = nextIndex
    setOffsetIndex(nextIndex)
  }, [digit, shouldAnimate, trend])

  return (
    <DigitColumn
      strip={DIGIT_STRIP}
      offsetIndex={offsetIndex}
      shouldAnimate={shouldAnimate}
    />
  )
}

type DigitPart =
  | { type: 'sep'; char: string; key: string }
  | { type: 'digit'; digit: number; key: string }

function parseNumberParts(text: string): DigitPart[] {
  const parts: DigitPart[] = []
  const normalized = text.startsWith('-') ? text.slice(1) : text
  const isNegative = text.startsWith('-')
  const [integerPart, fractionalPart] = normalized.split('.')

  for (let index = 0; index < integerPart.length; index += 1) {
    const placeFromRight = integerPart.length - 1 - index
    parts.push({
      type: 'digit',
      digit: Number(integerPart[index]),
      key: `i${placeFromRight}`,
    })
  }

  if (fractionalPart !== undefined) {
    parts.push({ type: 'sep', char: '.', key: 'dot' })

    for (let index = 0; index < fractionalPart.length; index += 1) {
      parts.push({
        type: 'digit',
        digit: Number(fractionalPart[index]),
        key: `f${index}`,
      })
    }
  }

  if (isNegative) {
    parts.unshift({ type: 'sep', char: '-', key: 'neg' })
  }

  return parts
}

function getDigitFromParts(parts: DigitPart[], key: string) {
  const part = parts.find(
    (entry) => entry.type === 'digit' && entry.key === key,
  )

  return part?.type === 'digit' ? part.digit : undefined
}

type FlowNumberProps = {
  value: number | string
  className?: string
  padStart?: number
}

export function FlowNumber({ value, className = '', padStart }: FlowNumberProps) {
  const text =
    typeof value === 'number' && padStart != null
      ? String(value).padStart(padStart, '0')
      : String(value)

  const previousText = useRef(text)
  const parts = parseNumberParts(text)
  const previousParts = parseNumberParts(previousText.current)

  useEffect(() => {
    previousText.current = text
  }, [text])

  return (
    <span
      className={`inline-flex items-center tabular-nums leading-none ${className}`}
    >
      {parts.map((part) => {
        if (part.type === 'sep') {
          return (
            <span
              key={part.key}
              className="inline-block shrink-0 text-center"
              style={{ width: part.char === '.' ? '0.35em' : undefined }}
            >
              {part.char}
            </span>
          )
        }

        const previousDigit = getDigitFromParts(previousParts, part.key)
        const shouldAnimate =
          previousDigit !== undefined && previousDigit !== part.digit
        const trend =
          previousDigit !== undefined && previousDigit <= part.digit
            ? 'up'
            : 'down'

        return (
          <FlowSmartDigit
            key={part.key}
            digit={part.digit}
            shouldAnimate={shouldAnimate}
            trend={trend}
          />
        )
      })}
    </span>
  )
}

type FlowValueProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  padStart?: number
}

export function FlowValue({
  value,
  decimals,
  prefix = '',
  suffix = '',
  className = '',
  padStart,
}: FlowValueProps) {
  const formatted =
    decimals != null ? value.toFixed(decimals) : String(Math.round(value))

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {prefix ? <span>{prefix}</span> : null}
      <FlowNumber value={formatted} padStart={padStart} />
      {suffix ? <span>{suffix}</span> : null}
    </span>
  )
}

const COUNTDOWN_STRIP = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

function findNextCountdownIndex(current: number, targetDigit: number) {
  for (let index = current + 1; index < COUNTDOWN_STRIP.length; index += 1) {
    if (COUNTDOWN_STRIP[index] === targetDigit) return index
  }

  return current
}

function initialCountdownIndex(digit: number) {
  return COUNTDOWN_STRIP.indexOf(digit)
}

type FlowCountdownDigitProps = {
  digit: number
  shouldAnimate: boolean
}

function FlowCountdownDigit({ digit, shouldAnimate }: FlowCountdownDigitProps) {
  const indexRef = useRef(initialCountdownIndex(digit))
  const [offsetIndex, setOffsetIndex] = useState(indexRef.current)

  useEffect(() => {
    if (!shouldAnimate) return

    const nextIndex = findNextCountdownIndex(indexRef.current, digit)
    indexRef.current = nextIndex
    setOffsetIndex(nextIndex)
  }, [digit, shouldAnimate])

  return (
    <DigitColumn
      strip={COUNTDOWN_STRIP}
      offsetIndex={offsetIndex}
      shouldAnimate={shouldAnimate}
    />
  )
}

type FlowStopwatchProps = {
  value: number
  className?: string
}

export function FlowStopwatch({ value, className = '' }: FlowStopwatchProps) {
  const previousValue = useRef(value)
  const safeValue = Math.min(10, Math.max(0, value))
  const padded = String(safeValue).padStart(2, '0')
  const previousPadded = String(
    Math.min(10, Math.max(0, previousValue.current)),
  ).padStart(2, '0')

  const tens = Number(padded[0])
  const ones = Number(padded[1])
  const previousTens = Number(previousPadded[0])
  const previousOnes = Number(previousPadded[1])

  useEffect(() => {
    previousValue.current = safeValue
  }, [safeValue])

  return (
    <span
      className={`inline-flex items-center tabular-nums leading-none ${className}`}
    >
      <FlowCountdownDigit
        digit={tens}
        shouldAnimate={tens !== previousTens}
      />
      <FlowCountdownDigit
        digit={ones}
        shouldAnimate={ones !== previousOnes}
      />
    </span>
  )
}
