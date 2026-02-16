import { useState, useRef } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  colorMap?: Record<string, string>
}

export function TagSelect({
  value = [],
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  error = false,
  colorMap = {},
}: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const availableOptions = options.filter((opt) => !value.includes(opt))

  const addTag = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag])
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const getTagColor = (tag: string): string => {
    if (colorMap[tag]) return colorMap[tag]
    return 'bg-secondary text-secondary-foreground'
  }

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          'flex flex-wrap items-center gap-1 rounded-lg border bg-background px-2 py-1.5 min-h-[36px] cursor-pointer',
          error ? 'border-destructive' : 'border-input',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {value.length === 0 && (
          <span className="text-sm text-muted-foreground">{placeholder}</span>
        )}
        {value.map((tag) => (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
              getTagColor(tag)
            )}
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tag)
                }}
                className="hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
      </div>

      {isOpen && availableOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {availableOptions.map((option) => (
            <div
              key={option}
              className="flex items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
              onClick={() => {
                addTag(option)
                if (availableOptions.length === 1) {
                  setIsOpen(false)
                }
              }}
            >
              <span
                className={cn(
                  'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium',
                  getTagColor(option)
                )}
              >
                {option}
              </span>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
