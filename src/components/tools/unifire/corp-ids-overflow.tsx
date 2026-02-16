import { useState, useRef, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface CorpIdsOverflowProps {
  value: string[]
  onChange: (value: string[]) => void
  max?: number
  visibleCount?: number
  disabled?: boolean
  placeholder?: string
}

export function CorpIdsOverflow({
  value = [],
  onChange,
  max = 25,
  visibleCount = 3,
  disabled = false,
  placeholder = 'Add Corp ID...',
}: CorpIdsOverflowProps) {
  const [inputValue, setInputValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatInput = (input: string): string => {
    return input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
  }

  const addTag = () => {
    const formatted = formatInput(inputValue)
    if (formatted.length > 0 && !value.includes(formatted) && value.length < max) {
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

  const visibleTags = value.slice(0, visibleCount)
  const overflowCount = value.length - visibleCount

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 rounded-lg border bg-background px-2 py-1.5 min-h-[36px] cursor-text',
        isInvalid ? 'border-destructive' : 'border-input',
        disabled && 'opacity-50 cursor-not-allowed bg-muted'
      )}
      onClick={() => !disabled && inputRef.current?.focus()}
    >
      {visibleTags.map((tag, index) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded bg-secondary border border-input px-1.5 py-0.5 text-xs font-mono"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(index) }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}

      {overflowCount > 0 && (
        <Popover>
          <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Badge variant="secondary" className="cursor-pointer text-xs px-1.5 py-0.5 hover:bg-secondary/80">
              +{overflowCount} more
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-2">
              <p className="text-sm font-medium">All Corporate IDs ({value.length}/{max})</p>
              <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto">
                {value.map((tag, index) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded bg-secondary border border-input px-1.5 py-0.5 text-xs font-mono"
                  >
                    {tag}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {!disabled && value.length < max && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(formatInput(e.target.value))}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue.length > 0) addTag() }}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="flex-1 min-w-[60px] bg-transparent outline-none text-xs font-mono placeholder:text-muted-foreground"
        />
      )}

      {value.length > 0 && (
        <span className="ml-auto text-[10px] text-muted-foreground whitespace-nowrap">{value.length}/{max}</span>
      )}
    </div>
  )
}
