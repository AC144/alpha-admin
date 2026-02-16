import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  allowCustom?: boolean
  maxLength?: number
  uppercase?: boolean
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  error = false,
  className,
  allowCustom = true,
  maxLength,
  uppercase = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const filtered = options.filter((opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredOptions(filtered)
  }, [inputValue, options])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        // If custom input is allowed, keep the typed value
        if (allowCustom && inputValue) {
          onChange(uppercase ? inputValue.toUpperCase() : inputValue)
        } else if (!options.includes(inputValue)) {
          setInputValue(value)
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, inputValue, value, options, allowCustom, onChange, uppercase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    if (uppercase) newValue = newValue.toUpperCase()
    if (maxLength) newValue = newValue.slice(0, maxLength)
    setInputValue(newValue)
    setIsOpen(true)
  }

  const handleSelect = (option: string) => {
    setInputValue(option)
    onChange(option)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0])
      } else if (allowCustom && inputValue) {
        onChange(uppercase ? inputValue.toUpperCase() : inputValue)
        setIsOpen(false)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setInputValue(value)
    }
  }

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div
        className={cn(
          'flex items-center rounded-lg border bg-background',
          error ? 'border-destructive' : 'border-input',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-8 px-3 bg-transparent outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="px-2 h-8 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (filteredOptions.length > 0 || (allowCustom && inputValue)) && (
        <div className="absolute z-[9999] mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {filteredOptions.map((option) => (
            <div
              key={option}
              className={cn(
                'flex items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent',
                option === value && 'bg-accent'
              )}
              onClick={() => handleSelect(option)}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  option === value ? 'opacity-100' : 'opacity-0'
                )}
              />
              {option}
            </div>
          ))}
          {allowCustom && inputValue && !options.includes(inputValue) && (
            <div
              className="flex items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent text-muted-foreground"
              onClick={() => handleSelect(uppercase ? inputValue.toUpperCase() : inputValue)}
            >
              <span className="mr-2 text-xs">Add:</span>
              <span className="font-medium">{uppercase ? inputValue.toUpperCase() : inputValue}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
