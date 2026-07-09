import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'

type ToolId = 'pen' | 'typography' | 'color'

type FontFamily = 'sans-serif' | 'serif' | 'slab'

const fontFamilyOptions: {
  id: FontFamily
  label: string
  fontFamily: string
}[] = [
  {
    id: 'sans-serif',
    label: 'Sans Serif',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'serif',
    label: 'Serif',
    fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
  },
  {
    id: 'slab',
    label: 'Slab',
    fontFamily: 'Rockwell, "Roboto Slab", "Courier New", serif',
  },
]

const fontSizeOptions = [12, 14, 16, 18, 24, 32]

const DEFAULT_TEXT = 'The quick brown fox jumps over the lazy dog'
const DEFAULT_BACKGROUND = '#ffffff'
const DEFAULT_TEXT_COLOR = '#404040'

const panelMotion = {
  initial: { opacity: 0, y: -4, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] as const },
}

type Tool = {
  id: ToolId
  label: string
  icon: React.ReactNode
}

const tools: Tool[] = [
  { id: 'pen', label: 'Pen', icon: <PenIcon /> },
  { id: 'typography', label: 'Typography', icon: <TypographyIcon /> },
  { id: 'color', label: 'Color', icon: <ColorIcon /> },
]

type ToolbarProps = {
  active: ToolId | null
  onSelect: (id: ToolId) => void
}

export function Toolbar({ active, onSelect }: ToolbarProps) {
  const [hovered, setHovered] = useState<ToolId | null>(null)
  const highlighted = hovered ?? active

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm shadow-black/5"
      onMouseLeave={() => setHovered(null)}
    >
      {tools.map((tool) => {
        const isHighlighted = highlighted === tool.id
        const isActive = active === tool.id

        return (
          <button
            key={tool.id}
            type="button"
            aria-label={tool.label}
            aria-pressed={isActive}
            onClick={() => onSelect(tool.id)}
            onMouseEnter={() => setHovered(tool.id)}
            className="relative flex size-9 items-center justify-center rounded-full"
          >
            {isHighlighted && (
              <motion.span
                layoutId="toolbar-highlight"
                className="absolute inset-0 rounded-full bg-neutral-100"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}

            <motion.span
              className="relative z-10"
              whileTap={{ scale: 0.94 }}
              animate={{ color: isHighlighted ? '#171717' : '#737373' }}
              transition={{ duration: 0.15 }}
            >
              {tool.icon}
            </motion.span>
          </button>
        )
      })}
    </div>
  )
}

type TypographyPanelProps = {
  fontFamily: FontFamily
  fontSize: number
  onFontFamilyChange: (family: FontFamily) => void
  onFontSizeChange: (size: number) => void
}

function TypographyPanel({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange,
}: TypographyPanelProps) {
  return (
    <motion.div
      {...panelMotion}
      className="w-auto min-w-[20rem] rounded-xl border border-neutral-200 bg-white p-3 shadow-lg shadow-black/10"
    >
      <div className="flex gap-4">
        <div className="min-w-[8.5rem]">
          <p className="mb-2 text-xs font-medium text-neutral-400">Font family</p>
          <div className="flex flex-col gap-1">
            {fontFamilyOptions.map((option) => {
              const isSelected = fontFamily === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onFontFamilyChange(option.id)}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-neutral-100 font-medium text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  style={{ fontFamily: option.fontFamily }}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="min-w-[5.5rem]">
          <p className="mb-2 text-xs font-medium text-neutral-400">Font size</p>
          <div className="grid grid-cols-2 gap-1">
            {fontSizeOptions.map((size) => {
              const isSelected = fontSize === size

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onFontSizeChange(size)}
                  className={`rounded-lg px-2 py-1.5 text-sm transition-colors ${
                    isSelected
                      ? 'bg-neutral-100 font-medium text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PenPanel({
  text,
  onTextChange,
}: {
  text: string
  onTextChange: (text: string) => void
}) {
  return (
    <motion.div
      {...panelMotion}
      className="w-64 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg shadow-black/10"
    >
      <p className="mb-2 text-xs font-medium text-neutral-400">Text</p>
      <textarea
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        rows={4}
        className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-indigo-400"
        placeholder="Type your text..."
      />
    </motion.div>
  )
}

type ColorPickerRowProps = {
  label: string
  color: string
  onChange: (color: string) => void
}

function ColorPickerRow({ label, color, onChange }: ColorPickerRowProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-neutral-600">{label}</span>
      <button
        type="button"
        aria-label={`${label} color`}
        onClick={() => inputRef.current?.click()}
        className="size-6 shrink-0 rounded-full border border-neutral-200 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={(event) => onChange(event.target.value)}
        className="sr-only"
      />
    </div>
  )
}

function ColorPanel({
  backgroundColor,
  textColor,
  onBackgroundChange,
  onTextColorChange,
}: {
  backgroundColor: string
  textColor: string
  onBackgroundChange: (color: string) => void
  onTextColorChange: (color: string) => void
}) {
  return (
    <motion.div
      {...panelMotion}
      className="w-64 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg shadow-black/10"
    >
      <div className="flex flex-col gap-4">
        <ColorPickerRow
          label="Color background"
          color={backgroundColor}
          onChange={onBackgroundChange}
        />
        <ColorPickerRow
          label="Text color"
          color={textColor}
          onChange={onTextColorChange}
        />
      </div>
    </motion.div>
  )
}

export function ToolbarPage() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null)
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans-serif')
  const [fontSize, setFontSize] = useState(16)
  const [text, setText] = useState(DEFAULT_TEXT)
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND)
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR)

  const previewFontFamily =
    fontFamilyOptions.find((option) => option.id === fontFamily)?.fontFamily ??
    fontFamilyOptions[0].fontFamily

  function handleSelectTool(id: ToolId) {
    setActiveTool((current) => (current === id ? null : id))
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div
        className="flex h-48 w-full items-center justify-center rounded-xl border border-dashed border-neutral-200 px-6 transition-colors"
        style={{ backgroundColor }}
      >
        <p
          className="text-center transition-colors"
          style={{
            fontFamily: previewFontFamily,
            fontSize,
            color: textColor,
          }}
        >
          {text.trim() || DEFAULT_TEXT}
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {activeTool === 'pen' && (
            <div key="pen-panel" className="absolute top-full mt-2">
              <PenPanel text={text} onTextChange={setText} />
            </div>
          )}
          {activeTool === 'typography' && (
            <div key="typography-panel" className="absolute top-full mt-2">
              <TypographyPanel
                fontFamily={fontFamily}
                fontSize={fontSize}
                onFontFamilyChange={setFontFamily}
                onFontSizeChange={setFontSize}
              />
            </div>
          )}
          {activeTool === 'color' && (
            <div key="color-panel" className="absolute top-full mt-2">
              <ColorPanel
                backgroundColor={backgroundColor}
                textColor={textColor}
                onBackgroundChange={setBackgroundColor}
                onTextColorChange={setTextColor}
              />
            </div>
          )}
        </AnimatePresence>

        <Toolbar active={activeTool} onSelect={handleSelectTool} />
      </div>
    </div>
  )
}

function PenIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
      />
    </svg>
  )
}

function TypographyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V5h16v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 19h8" />
    </svg>
  )
}

function ColorIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c-4.5 5.2-6 8.5-6 11.2a6 6 0 1 0 12 0C18 11.5 16.5 8.2 12 3Z"
      />
      <circle cx="9.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
