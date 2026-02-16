import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImportPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  newCount: number
  updatedCount: number
  unchangedCount: number
  errorCount: number
  previewColumns: string[]
  previewRows: Record<string, unknown>[]
}

export function ImportPreviewDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Import Preview',
  newCount,
  updatedCount,
  unchangedCount,
  errorCount,
  previewColumns,
  previewRows,
}: ImportPreviewDialogProps) {
  const totalValid = newCount + updatedCount + unchangedCount

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Review the import results before applying</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary badges */}
          <div className="flex flex-wrap gap-3">
            {newCount > 0 && (
              <div className="px-3 py-1.5 rounded-md bg-green-50 border border-green-200 text-sm text-green-800">
                {newCount} new
              </div>
            )}
            {updatedCount > 0 && (
              <div className="px-3 py-1.5 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
                {updatedCount} updated
              </div>
            )}
            {unchangedCount > 0 && (
              <div className="px-3 py-1.5 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-600">
                {unchangedCount} unchanged
              </div>
            )}
            {errorCount > 0 && (
              <div className="px-3 py-1.5 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
                {errorCount} errors
              </div>
            )}
          </div>

          {/* Preview table */}
          {previewRows.length > 0 && (
            <div className="max-h-[250px] overflow-y-auto rounded border">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    {previewColumns.map((col) => (
                      <th key={col} className="px-2 py-1 text-left font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.slice(0, 20).map((row, i) => (
                    <tr key={i} className="border-t">
                      {previewColumns.map((col) => (
                        <td key={col} className="px-2 py-1">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewRows.length > 20 && (
                <div className="px-2 py-1 text-xs text-muted-foreground bg-muted">
                  ... and {previewRows.length - 20} more rows
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={totalValid === 0}>
            Import {totalValid} Record{totalValid !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
