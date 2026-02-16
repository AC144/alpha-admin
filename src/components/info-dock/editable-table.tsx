import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export interface ColumnDef<T> {
  key: keyof T
  header: string
  width?: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
  editable?: boolean
  placeholder?: string
  maxLength?: number
}

interface EditableTableProps<T extends { id: string }> {
  title: string
  columns: ColumnDef<T>[]
  data: T[]
  onAdd: (item: Omit<T, 'id'>) => void
  onUpdate: (item: T) => void
  onDelete: (id: string) => void
  emptyDefaults: Omit<T, 'id'>
  addLabel?: string
}

export function EditableTable<T extends { id: string }>({
  title,
  columns,
  data,
  onAdd,
  onUpdate,
  onDelete,
  emptyDefaults,
  addLabel = 'Add',
}: EditableTableProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<T | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newItem, setNewItem] = useState<Record<string, unknown>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const startEditing = (row: T) => {
    setEditingId(row.id)
    setEditingData({ ...row })
  }

  const saveEditing = () => {
    if (editingData) {
      onUpdate(editingData)
      setEditingId(null)
      setEditingData(null)
    }
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingData(null)
  }

  const startAdding = () => {
    setIsAdding(true)
    setNewItem({ ...emptyDefaults } as Record<string, unknown>)
  }

  const saveNewItem = () => {
    onAdd(newItem as Omit<T, 'id'>)
    setIsAdding(false)
    setNewItem({})
  }

  const cancelAdding = () => {
    setIsAdding(false)
    setNewItem({})
  }

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const deleteRow = data.find((r) => r.id === deleteId)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button variant="outline" size="sm" onClick={startAdding} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-3 py-2 text-left font-medium"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-3 py-2 text-center font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isEditing = editingId === row.id

              return (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-3 py-2">
                      {isEditing && col.editable !== false ? (
                        <Input
                          value={String(editingData?.[col.key] ?? '')}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData!,
                              [col.key]: e.target.value,
                            })
                          }
                          className="h-8"
                          placeholder={col.placeholder}
                          maxLength={col.maxLength}
                        />
                      ) : col.render ? (
                        col.render(row[col.key], row)
                      ) : (
                        String(row[col.key] ?? '')
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      {isEditing ? (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveEditing}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEditing}>
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditing(row)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(row.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}

            {/* Add new row */}
            {isAdding && (
              <tr className="border-b last:border-0 bg-muted/10">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-3 py-2">
                    {col.editable !== false ? (
                      <Input
                        value={String(newItem[String(col.key)] ?? '')}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            [String(col.key)]: e.target.value,
                          })
                        }
                        className="h-8"
                        placeholder={col.placeholder || col.header}
                        maxLength={col.maxLength}
                      />
                    ) : null}
                  </td>
                ))}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveNewItem}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelAdding}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </td>
              </tr>
            )}

            {data.length === 0 && !isAdding && (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-muted-foreground">
                  No records. Click &quot;{addLabel}&quot; to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete
              {deleteRow ? ` "${(deleteRow as Record<string, unknown>)['name'] || (deleteRow as Record<string, unknown>)['code'] || deleteRow.id}"` : ' this record'}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
