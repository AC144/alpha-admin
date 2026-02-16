import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { SearchRequestRow, type SearchRequest } from './search-request-row'

const mockSearchRequests: SearchRequest[] = [
  {
    id: 'sr-1',
    ptc: 'ADT',
    mainPcc: 'U9XF',
    secondaryPccs: ['F85J', 'VV6K', 'SW04', 'P1MJ'],
    corporateIds: ['ADB25', 'BKL18', 'CLA30', 'CLB30', 'CLD01', 'OVA04', 'OVA23', 'OVA24', 'QFA50'],
    currency: 'USD',
    ndc: false,
  },
  {
    id: 'sr-2',
    ptc: 'JCB',
    mainPcc: 'W4FF',
    secondaryPccs: ['VV6K', 'SW04', 'UE07', 'O77I'],
    corporateIds: [],
    currency: 'USD',
    ndc: false,
  },
  {
    id: 'sr-3',
    ptc: 'JCB',
    mainPcc: 'U9XF',
    secondaryPccs: ['F85J', '2GAC', 'T42I', 'P1MJ'],
    corporateIds: [],
    currency: 'USD',
    ndc: false,
  },
  {
    id: 'sr-4',
    ptc: 'ITX',
    mainPcc: 'L4FL',
    secondaryPccs: ['SW04', 'O77I', 'I8F4'],
    corporateIds: [],
    currency: 'USD',
    ndc: false,
  },
  {
    id: 'sr-5',
    ptc: 'SEA',
    mainPcc: 'L4FL',
    secondaryPccs: ['7AMG'],
    corporateIds: [],
    currency: 'USD',
    ndc: false,
  },
  {
    id: 'sr-6',
    ptc: 'PFA',
    mainPcc: 'L4FL',
    secondaryPccs: ['I8F4'],
    corporateIds: [],
    currency: 'USD',
    ndc: false,
  },
  {
    id: 'sr-7',
    ptc: 'ADT',
    mainPcc: 'U9XF',
    secondaryPccs: [],
    corporateIds: [],
    currency: 'USD',
    ndc: true,
  },
]

interface SearchRequestsTableProps {
  companyId: string
}

export function SearchRequestsTable({ companyId: _companyId }: SearchRequestsTableProps) {
  const [requests, setRequests] = useState<SearchRequest[]>(mockSearchRequests)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const addRequest = () => {
    const newRequest: SearchRequest = {
      id: String(Date.now()),
      ptc: '',
      mainPcc: '',
      secondaryPccs: [],
      corporateIds: [],
      currency: 'USD',
      ndc: false,
    }
    setRequests([...requests, newRequest])
  }

  const updateRequest = (updated: SearchRequest) => {
    setRequests(requests.map((r) => (r.id === updated.id ? updated : r)))
  }

  const confirmDelete = () => {
    if (deleteId) {
      setRequests(requests.filter((r) => r.id !== deleteId))
      setDeleteId(null)
    }
  }

  const deleteRow = requests.find((r) => r.id === deleteId)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Main PCC *</th>
              <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Secondary PCCs (max 4)</th>
              <th className="px-3 py-2 text-left font-medium whitespace-nowrap">PTC *</th>
              <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Corporate IDs (max 25)</th>
              <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Currency *</th>
              <th className="px-3 py-2 text-center font-medium w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <SearchRequestRow
                key={request.id}
                request={request}
                onChange={updateRequest}
                onDelete={() => {
                  if (requests.length <= 1) return
                  setDeleteId(request.id)
                }}
              />
            ))}

            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                  No search requests configured. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add button */}
      <Button variant="outline" className="w-full" onClick={addRequest}>
        <Plus className="mr-2 h-4 w-4" />
        Add Search Request
      </Button>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Search Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the search request
              {deleteRow ? ` (PTC: ${deleteRow.ptc || '—'}, PCC: ${deleteRow.mainPcc || '—'})` : ''}?
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
