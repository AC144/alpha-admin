import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchRequestsTable } from '@/components/tools/unifire/search-requests-table'
import { LimitsGrid, type LimitValue, type LimitRowConfig } from '@/components/tools/limits-grid'

const searchLimitRows: LimitRowConfig[] = [
  { key: 'basic', label: 'Basic' },
  { key: 'withFlex', label: 'With Flex' },
  { key: 'alternateCity', label: 'Alternate City' },
  { key: 'perJourney', label: 'Per Journey' },
]

const mockSearchLimits: Record<string, LimitValue> = {
  basic: { perUser: 40, perCompany: 1000 },
  withFlex: { perUser: 40, perCompany: 1000 },
  alternateCity: { perUser: 30, perCompany: 1000 },
  perJourney: { perUser: 20, perCompany: 1000 },
}

interface SearchSetupTabProps {
  companyId: string
}

export function SearchSetupTab({ companyId }: SearchSetupTabProps) {
  const [searchLimits, setSearchLimits] = useState<Record<string, LimitValue>>(mockSearchLimits)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Requests Configuration</CardTitle>
          <CardDescription>
            Configure search requests. Each row represents an independent search request configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchRequestsTable companyId={companyId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Limits</CardTitle>
          <CardDescription>
            Set the maximum number of search requests allowed per user and per company for each search type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LimitsGrid
            rows={searchLimitRows}
            values={searchLimits}
            onChange={setSearchLimits}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
