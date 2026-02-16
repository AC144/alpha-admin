import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MultiChipComboboxProps {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  maxItems?: number
  allowCustom?: boolean
  maxLength?: number
  uppercase?: boolean
  condensedView?: boolean
  condensedThreshold?: number
}

export function MultiChipCombobox({
  value = [],
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  error = false,
  className,
  maxItems,
  allowCustom = true,
  maxLength,
  uppercase = false,
  condensedView = false,
  condensedThreshold = 3,
}: MultiChipComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const available = options.filter((opt) => !value.includes(opt))
    const filtered = available.filter((opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredOptions(filtered)
  }, [inputValue, options, value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setInputValue('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const addItem = (item: string) => {
    const formattedItem = uppercase ? item.toUpperCase() : item
    if (!value.includes(formattedItem) && (!maxItems || value.length < maxItems)) {
      onChange([...value, formattedItem])
      setInputValue('')
    }
  }

  const removeItem = (item: string) => {
    onChange(value.filter((v) => v !== item))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    if (uppercase) newValue = newValue.toUpperCase()
    if (maxLength) newValue = newValue.slice(0, maxLength)
    setInputValue(newValue)
    setIsOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredOptions.length > 0) {
        addItem(filteredOptions[0])
      } else if (allowCustom && inputValue.trim()) {
        addItem(inputValue.trim())
      }
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeItem(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const isMaxReached = maxItems ? value.length >= maxItems : false

  // Condensed view logic
  const displayedChips = condensedView && value.length > condensedThreshold
    ? value.slice(0, condensedThreshold)
    : value
  const hiddenCount = condensedView ? value.length - condensedThreshold : 0

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div
        className={cn(
          'flex flex-wrap items-center gap-1 rounded-lg border bg-background px-2 py-1 min-h-[36px] cursor-text',
          error ? 'border-destructive' : 'border-input',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {displayedChips.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-xs font-medium"
          >
            {item}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeItem(item)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}

        {condensedView && hiddenCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground cursor-help">
                +{hiddenCount} more
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="flex flex-wrap gap-1">
                {value.slice(condensedThreshold).map((item) => (
                  <span key={item} className="text-xs">{item}</span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {!isMaxReached && !disabled && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
            className="flex-1 min-w-[60px] h-6 bg-transparent outline-none text-sm"
          />
        )}

        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="ml-auto px-1 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && !isMaxReached && (
        <div className="absolute z-[9999] mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                className="flex items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
                onClick={() => addItem(option)}
              >
                {option}
              </div>
            ))
          ) : allowCustom && inputValue.trim() ? (
            <div
              className="flex items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent text-muted-foreground"
              onClick={() => addItem(inputValue.trim())}
            >
              <span className="mr-2 text-xs">Add:</span>
              <span className="font-medium">{uppercase ? inputValue.toUpperCase() : inputValue}</span>
            </div>
          ) : (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {isMaxReached ? `Maximum ${maxItems} items` : 'No options available'}
            </div>
          )}
        </div>
      )}

      {maxItems && (
        <div className="absolute right-0 -bottom-5 text-xs text-muted-foreground">
          {value.length}/{maxItems}
        </div>
      )}
    </div>
  )
}
