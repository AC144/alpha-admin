import { useRef } from 'react'
import { Upload, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImportExportToolbarProps {
  onImport: (file: File) => void
  onExport: () => void
  importLabel?: string
  exportLabel?: string
  accept?: string
}

export function ImportExportToolbar({
  onImport,
  onExport,
  importLabel = 'Import XLSX',
  exportLabel = 'Export XLSX',
  accept = '.xlsx,.xls,.csv',
}: ImportExportToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        {importLabel}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        {exportLabel}
      </Button>
    </div>
  )
}
