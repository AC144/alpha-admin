import { useState, useRef, useCallback } from 'react'
import { Plus, Trash2, X, GripVertical } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PriorityItem {
  id: string
  code: string
  mask: string | null
}

interface PriorityMaskTableProps {
  items: PriorityItem[]
  onChange: (items: PriorityItem[]) => void
  codeMaxLength: number
  codePlaceholder: string
  addLabel: string
}

export function PriorityMaskTable({
  items,
  onChange,
  codeMaxLength,
  codePlaceholder,
  addLabel,
}: PriorityMaskTableProps) {
  const [editingMaskId, setEditingMaskId] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const newRowRef = useRef<HTMLInputElement>(null)

  const updateCode = (id: string, code: string) => {
    const formatted = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, codeMaxLength)
    onChange(items.map((item) => (item.id === id ? { ...item, code: formatted } : item)))
  }

  const updateMask = (id: string, mask: string) => {
    const formatted = mask.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
    onChange(items.map((item) => (item.id === id ? { ...item, mask: formatted || null } : item)))
  }

  const clearMask = (id: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, mask: null } : item)))
    setEditingMaskId(null)
  }

  const addItem = () => {
    const newItem: PriorityItem = {
      id: String(Date.now()),
      code: '',
      mask: null,
    }
    onChange([...items, newItem])
    // Focus new row's code input after render
    setTimeout(() => newRowRef.current?.focus(), 50)
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) return

    const newItems = [...items]
    const target = direction === 'up' ? index - 1 : index + 1
    ;[newItems[index], newItems[target]] = [newItems[target], newItems[index]]
    onChange(newItems)
  }

  // Drag and drop
  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }, [])

  const handleDrop = useCallback((targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...items]
    const [dragged] = newItems.splice(dragIndex, 1)
    newItems.splice(targetIndex, 0, dragged)
    onChange(newItems)
    setDragIndex(null)
    setDragOverIndex(null)
  }, [dragIndex, items, onChange])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  // Duplicate detection
  const codeCounts = items.reduce<Record<string, number>>((acc, item) => {
    if (item.code) {
      acc[item.code] = (acc[item.code] || 0) + 1
    }
    return acc
  }, {})

  return (
    <div className="space-y-3">
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-2 py-2 w-8"></th>
              <th className="px-2 py-2 w-10 text-center font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">Code</th>
              <th className="px-3 py-2 text-left font-medium">Mask</th>
              <th className="px-2 py-2 w-20 text-center font-medium">Order</th>
              <th className="px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const isDuplicate = item.code && (codeCounts[item.code] || 0) > 1
              const isEditingMask = editingMaskId === item.id
              const hasMask = !!item.mask
              const isLast = index === items.length - 1

              return (
                <tr
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'border-b last:border-0 transition-colors',
                    dragIndex === index && 'opacity-40',
                    dragOverIndex === index && dragIndex !== index && 'bg-primary/5 border-t-2 border-t-primary',
                    hasMask && 'bg-amber-50/50'
                  )}
                >
                  {/* Drag handle */}
                  <td className="px-2 py-2 cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                  </td>

                  {/* Priority number */}
                  <td className="px-2 py-2 text-center">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </span>
                  </td>

                  {/* Code */}
                  <td className="px-3 py-2">
                    <Input
                      ref={isLast ? newRowRef : undefined}
                      value={item.code}
                      onChange={(e) => updateCode(item.id, e.target.value)}
                      placeholder={codePlaceholder}
                      className={cn(
                        'h-8 font-mono text-sm',
                        codeMaxLength === 4 ? 'w-20' : 'w-16',
                        isDuplicate && 'border-destructive'
                      )}
                      maxLength={codeMaxLength}
                    />
                    {isDuplicate && (
                      <p className="text-[10px] text-destructive mt-0.5">Duplicate</p>
                    )}
                  </td>

                  {/* Mask */}
                  <td className="px-3 py-2">
                    {isEditingMask ? (
                      <div className="flex items-center gap-1">
                        <Input
                          autoFocus
                          value={item.mask || ''}
                          onChange={(e) => updateMask(item.id, e.target.value)}
                          onBlur={() => setEditingMaskId(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Escape') setEditingMaskId(null)
                          }}
                          placeholder="Mask..."
                          className="h-8 w-24 font-mono text-sm"
                          maxLength={5}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingMaskId(item.id)}
                          className={cn(
                            'inline-flex items-center h-8 px-2 rounded-md border text-sm font-mono transition-colors hover:bg-muted/50',
                            hasMask
                              ? 'border-amber-200 bg-amber-50 text-amber-800'
                              : 'border-input text-muted-foreground'
                          )}
                        >
                          {hasMask ? item.mask : 'No'}
                        </button>
                        {hasMask && (
                          <button
                            type="button"
                            onClick={() => clearMask(item.id)}
                            className="text-muted-foreground hover:text-foreground"
                            title="Clear mask"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Order arrows */}
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                      >
                        <span className="text-xs">▲</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === items.length - 1}
                      >
                        <span className="text-xs">▼</span>
                      </Button>
                    </div>
                  </td>

                  {/* Delete */}
                  <td className="px-2 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </td>
                </tr>
              )
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No entries configured. Click below to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Button variant="outline" className="w-full" onClick={addItem}>
        <Plus className="mr-2 h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  )
}
