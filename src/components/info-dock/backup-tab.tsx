import { useState, useRef } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { BackupRecord } from '@/types/info-dock'

const sampleBackups: BackupRecord[] = [
  { id: '1', date: '2026-02-04 10:30', size: '2.4 MB', createdBy: 'Admin', filename: 'alpha-admin-backup-2026-02-04.json' },
  { id: '2', date: '2026-01-28 09:15', size: '2.1 MB', createdBy: 'Admin', filename: 'alpha-admin-backup-2026-01-28.json' },
  { id: '3', date: '2026-01-15 14:00', size: '1.9 MB', createdBy: 'System', filename: 'alpha-admin-backup-2026-01-15.json' },
]

export function BackupTab() {
  const [backups] = useState<BackupRecord[]>(sampleBackups)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportBackup = () => {
    // Mock export - in production would generate full backup
    const backupData = JSON.stringify({
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        gds: [],
        pccs: [],
        ptcs: [],
        corpIds: [],
        fareTypes: [],
        cabins: [],
        projects: [],
        airlines: [],
        airports: [],
      },
    }, null, 2)
    const blob = new Blob([backupData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `alpha-admin-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setShowImportConfirm(true)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImportConfirm = () => {
    // Mock import - in production would process backup file
    setShowImportConfirm(false)
    setSelectedFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Full Backup
          </CardTitle>
          <CardDescription>
            Download complete Alpha Admin data as a JSON bundle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportBackup}>
            <Download className="mr-2 h-4 w-4" />
            Export Backup
          </Button>
        </CardContent>
      </Card>

      {/* Import */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Backup
          </CardTitle>
          <CardDescription>
            Restore Alpha Admin data from a backup file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              Importing a backup will overwrite existing data. Make sure to export a backup first.
            </p>
          </div>

          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop file here or click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports .json backup files
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
          />
        </CardContent>
      </Card>

      {/* Recent Backups */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Backups</CardTitle>
          <CardDescription>Previously created backup files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Size</th>
                  <th className="px-3 py-2 text-left font-medium">Created By</th>
                  <th className="px-3 py-2 text-center font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-3 py-2">{backup.date}</td>
                    <td className="px-3 py-2">{backup.size}</td>
                    <td className="px-3 py-2">{backup.createdBy}</td>
                    <td className="px-3 py-2 text-center">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
                {backups.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                      No backups available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Import Confirmation */}
      <AlertDialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Backup</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to import &quot;{selectedFile?.name}&quot;. This will overwrite all existing data in Alpha Admin.
              This action cannot be undone. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImportConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Import & Overwrite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
