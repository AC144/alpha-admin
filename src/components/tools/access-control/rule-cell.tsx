import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RuleCellProps {
  commands: string[]
  variant: 'allow' | 'deny'
  onClick: () => void
}

export function RuleCell({ commands, variant, onClick }: RuleCellProps) {
  const isEmpty = commands.length === 0

  const colors = variant === 'allow'
    ? {
        tag: 'bg-green-100 text-green-800 border-green-200',
        hover: 'hover:bg-green-50/50',
      }
    : {
        tag: 'bg-red-100 text-red-800 border-red-200',
        hover: 'hover:bg-red-50/50',
      }

  if (isEmpty) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full h-full min-h-[48px] flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors group rounded"
      >
        <span className="opacity-50 group-hover:opacity-100 flex items-center gap-1">
          <Plus className="h-3 w-3" />
          <span className="text-xs">Add</span>
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full h-full min-h-[48px] p-2 text-left transition-colors rounded',
        colors.hover
      )}
    >
      <div className="flex flex-wrap gap-1">
        {commands.slice(0, 6).map((cmd) => (
          <span
            key={cmd}
            className={cn(
              'px-1.5 py-0.5 rounded text-xs font-mono border',
              colors.tag
            )}
          >
            {cmd}
          </span>
        ))}
        {commands.length > 6 && (
          <span className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground">
            +{commands.length - 6}
          </span>
        )}
      </div>
    </button>
  )
}
