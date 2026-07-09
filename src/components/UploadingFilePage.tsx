import { animate, AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { DeleteButton } from './DeleteButton'

const UPLOAD_DURATION = 3
const UPLOAD_GREEN = '#22c55e'
const ICON_GAP = 8
const SUCCESS_MESSAGE_DURATION = 2000
const TEXT_OFFSET = 56
const HOVER_ENTER_MOTION = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
}
const HOVER_EXIT_MOTION = {
  duration: 0.12,
  ease: [0.22, 1, 0.36, 1] as const,
}

type ButtonState = 'idle' | 'uploading' | 'success' | 'returning'

type UploadedFile = {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'complete'
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileType(file: File) {
  if (file.type) return file.type
  const extension = file.name.split('.').pop()
  return extension ? extension.toUpperCase() : 'Unknown'
}

function UploadIcon({ color = '#171717' }: { color?: string }) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 7.5 12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  )
}

function FileUploadItem({
  file,
  progress,
  isUploading,
  onDelete,
}: {
  file: File
  progress: number
  isUploading: boolean
  onDelete: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const showDelete = isHovered && !isUploading

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs font-medium text-neutral-900">
          {file.name}
        </p>

        <div className="relative h-9 w-24 shrink-0">
          <AnimatePresence initial={false}>
            {showDelete ? (
              <motion.div
                key="delete"
                className="absolute inset-y-0 right-0 flex items-center justify-end"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: HOVER_ENTER_MOTION }}
                exit={{ y: 6, opacity: 0, transition: HOVER_EXIT_MOTION }}
                onClick={(event) => event.stopPropagation()}
              >
                <DeleteButton
                  className="px-2 py-1 text-xs"
                  onDelete={onDelete}
                />
              </motion.div>
            ) : (
              <motion.div
                key="meta"
                className="absolute inset-y-0 right-0 flex items-center justify-end gap-2 text-xs whitespace-nowrap text-neutral-400"
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: HOVER_ENTER_MOTION }}
                exit={{ y: -6, opacity: 0, transition: HOVER_EXIT_MOTION }}
              >
                <span>{formatFileSize(file.size)}</span>
                <span aria-hidden="true">·</span>
                <span>{getFileType(file)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isUploading && (
        <div className="h-1 overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full origin-left rounded-full bg-neutral-900"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </motion.li>
  )
}

export function UploadingFilePage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const animationRefs = useRef<Map<string, ReturnType<typeof animate>>>(new Map())
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const returnAnimationRef = useRef<ReturnType<typeof animate> | null>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [iconOffset, setIconOffset] = useState(0)
  const [fillScale, setFillScale] = useState(0)
  const [textOnGreen, setTextOnGreen] = useState(false)
  const [buttonState, setButtonState] = useState<ButtonState>('idle')

  function clearSuccessTimeout() {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
      successTimeoutRef.current = null
    }
  }

  function stopReturnAnimation() {
    returnAnimationRef.current?.stop()
    returnAnimationRef.current = null
  }

  function updateButtonVisuals(progress: number) {
    if (!buttonRef.current || !iconRef.current) return

    const clientWidth = buttonRef.current.clientWidth
    const iconWidth = iconRef.current.offsetWidth
    const maxOffset = clientWidth - iconWidth - ICON_GAP * 2
    const greenRight = progress * clientWidth

    setFillScale(progress)
    setTextOnGreen(greenRight >= TEXT_OFFSET)
    setIconOffset(
      Math.max(0, Math.min(maxOffset, greenRight - iconWidth - ICON_GAP * 2)),
    )
  }

  function startReturnAnimation() {
    stopReturnAnimation()

    if (!buttonRef.current || !iconRef.current) {
      setButtonState('idle')
      return
    }

    setButtonState('returning')

    returnAnimationRef.current = animate(1, 0, {
      duration: UPLOAD_DURATION,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => updateButtonVisuals(value),
      onComplete: () => {
        returnAnimationRef.current = null
        setButtonState('idle')
      },
    })
  }

  useEffect(() => {
    return () => {
      animationRefs.current.forEach((controls) => controls.stop())
      animationRefs.current.clear()
      clearSuccessTimeout()
      stopReturnAnimation()
    }
  }, [])

  function startUpload(id: string) {
    animationRefs.current.get(id)?.stop()

    const controls = animate(0, 100, {
      duration: UPLOAD_DURATION,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        const progress = Math.round(value)
        setFiles((current) =>
          current.map((item) =>
            item.id === id ? { ...item, progress } : item,
          ),
        )
      },
      onComplete: () => {
        setFiles((current) => {
          const updated = current.map((item) =>
            item.id === id
              ? { ...item, progress: 100, status: 'complete' as const }
              : item,
          )

          const hasUploading = updated.some((item) => item.status === 'uploading')

          if (!hasUploading) {
            clearSuccessTimeout()
            setButtonState('success')
            successTimeoutRef.current = setTimeout(() => {
              startReturnAnimation()
              successTimeoutRef.current = null
            }, SUCCESS_MESSAGE_DURATION)
          }

          return updated
        })
        animationRefs.current.delete(id)
      },
    })

    animationRefs.current.set(id, controls)
  }

  function handleFileSelect(selected: FileList | null) {
    if (!selected?.length) return

    const newFiles = Array.from(selected).map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: 'uploading' as const,
    }))

    setFiles((current) => [...current, ...newFiles])
    clearSuccessTimeout()
    stopReturnAnimation()
    setButtonState('uploading')
    newFiles.forEach(({ id }) => startUpload(id))
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleDeleteFile(id: string) {
    animationRefs.current.get(id)?.stop()
    animationRefs.current.delete(id)
    setFiles((current) => current.filter((item) => item.id !== id))
  }

  function handleUploadClick() {
    inputRef.current?.click()
  }

  function handleUploadKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleUploadClick()
    }
  }

  const activeUpload = files.find((item) => item.status === 'uploading')
  const buttonProgress = activeUpload?.progress ?? 0
  const isButtonActive =
    buttonState === 'uploading' ||
    buttonState === 'success' ||
    buttonState === 'returning'

  useEffect(() => {
    if (!buttonRef.current || !iconRef.current) return
    if (buttonState === 'returning') return

    const clientWidth = buttonRef.current.clientWidth
    const iconWidth = iconRef.current.offsetWidth
    const maxOffset = clientWidth - iconWidth - ICON_GAP * 2

    if (buttonState === 'idle') {
      setIconOffset(0)
      setFillScale(0)
      setTextOnGreen(false)
      return
    }

    if (buttonState === 'success') {
      setFillScale(1)
      setIconOffset(maxOffset)
      setTextOnGreen(true)
      return
    }

    updateButtonVisuals(buttonProgress / 100)
  }, [buttonProgress, buttonState])

  const buttonText =
    buttonState === 'uploading'
      ? 'Uploading file...'
      : buttonState === 'success' || buttonState === 'returning'
        ? 'Successfully uploaded'
        : 'Choose a file'

  return (
    <div className="flex w-full max-w-sm flex-col rounded-xl bg-white p-3">
      <div className="mb-10 flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-900">Upload file</h2>

        <p className="text-xs text-neutral-500">
          Select a file from your device and add it to the list below. Supported
          formats include images, documents, and other common file types.
        </p>
      </div>

      <div className="mb-20 flex flex-col gap-2">
        <p className="text-xs font-medium text-neutral-700">Files uploaded</p>

        {files.length === 0 ? (
          <p className="text-xs text-neutral-400">No files uploaded yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {files.map(({ id, file, progress, status }) => (
              <FileUploadItem
                key={id}
                file={file}
                progress={progress}
                isUploading={status === 'uploading'}
                onDelete={() => handleDeleteFile(id)}
              />
            ))}
          </ul>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={(event) => handleFileSelect(event.target.files)}
      />

      <div
        ref={buttonRef}
        role="button"
        tabIndex={0}
        onClick={handleUploadClick}
        onKeyDown={handleUploadKeyDown}
        className={`group relative flex h-16 cursor-pointer items-center overflow-hidden rounded-xl bg-neutral-100 p-2 ${
          isButtonActive
            ? ''
            : 'transition-[background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-neutral-200/70'
        }`}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 origin-left"
          initial={false}
          animate={{ scaleX: fillScale }}
          transition={{ duration: 0.1, ease: 'linear' }}
          style={{ width: '100%', backgroundColor: UPLOAD_GREEN }}
        />

        <span
          className={`relative z-10 pl-14 text-sm font-medium transition-colors duration-300 ${
            textOnGreen ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {buttonText}
        </span>

        <motion.span
          ref={iconRef}
          className={`absolute left-2 top-2 z-10 flex aspect-square h-[calc(100%-1rem)] items-center justify-center overflow-hidden rounded-lg bg-white ${
            isButtonActive
              ? ''
              : 'transition-[background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-neutral-50'
          }`}
          animate={{ x: iconOffset }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          <UploadIcon color={isButtonActive ? UPLOAD_GREEN : '#171717'} />
        </motion.span>
      </div>
    </div>
  )
}
