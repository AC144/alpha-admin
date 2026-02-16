import { useState, useRef, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PCCTagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

const PCC_REGEX = /^[A-Z0-9]{4}$/

export function PCCTagInput({
  value = [],
  onChange,
  placeholder = 'Type PCC...',
  disabled = false,
  error = false,
}: PCCTagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatInput = (input: string): string => {
    return input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
  }

  const addTag = () => {
    const formatted = formatInput(inputValue)
    if (PCC_REGEX.test(formatted) && !value.includes(formatted)) {
      onChange([...value, formatted])
      setInputValue('')
      setIsInvalid(false)
    } else if (inputValue.length > 0) {
      setIsInvalid(true)
      setTimeout(() => setIsInvalid(false), 500)
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 rounded-lg border bg-background px-3 py-2 min-h-[40px] cursor-text',
        error || isInvalid ? 'border-destructive' : 'border-input',
        isInvalid && 'animate-shake',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded bg-secondary border border-input px-2 py-0.5 text-sm font-mono"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(index)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(formatInput(e.target.value))}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.length === 4) addTag()
        }}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={disabled}
        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground"
      />
    </div>
  )
}
