import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PriorityMaskTable, type PriorityItem } from '@/components/tools/unifire/priority-mask-table'

const mockPccList: PriorityItem[] = [
  { id: '1', code: '72BG', mask: 'OVA01' },
  { id: '2', code: 'F85J', mask: 'VIP3' },
  { id: '3', code: 'JE6L', mask: 'BIT' },
  { id: '4', code: 'SP9L', mask: null },
  { id: '5', code: 'VV6K', mask: 'VIP' },
  { id: '6', code: '5CJJ', mask: 'OVA04' },
  { id: '7', code: 'U9XF', mask: 'VIP3' },
  { id: '8', code: 'S3YL', mask: null },
  { id: '9', code: 'T42I', mask: null },
  { id: '10', code: 'W4FF', mask: 'BIT' },
  { id: '11', code: '8GII', mask: null },
  { id: '12', code: 'U7JK', mask: 'VIP' },
  { id: '13', code: '17RI', mask: null },
  { id: '14', code: 'D0TJ', mask: null },
  { id: '15', code: 'UE07', mask: null },
  { id: '16', code: 'KN6G', mask: null },
  { id: '17', code: '2GAC', mask: null },
  { id: '18', code: 'SW04', mask: null },
  { id: '19', code: 'O77I', mask: null },
  { id: '20', code: 'I8F4', mask: null },
]

const mockPtcList: PriorityItem[] = [
  { id: 'p1', code: 'PUB', mask: null },
  { id: 'p2', code: 'ADT', mask: 'VIP' },
  { id: 'p3', code: 'JCB', mask: null },
  { id: 'p4', code: 'ITX', mask: 'BIT' },
  { id: 'p5', code: 'PFA', mask: null },
  { id: 'p6', code: 'SEA', mask: null },
]

interface PccPriorityTabProps {
  companyId: string
}

export function PccPriorityTab({ companyId: _companyId }: PccPriorityTabProps) {
  const [pccList, setPccList] = useState<PriorityItem[]>(mockPccList)
  const [ptcList, setPtcList] = useState<PriorityItem[]>(mockPtcList)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PCC Configuration</CardTitle>
          <CardDescription>
            Set priority order and masking for PCCs. Position 1 has the highest priority and is searched first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PriorityMaskTable
            items={pccList}
            onChange={setPccList}
            codeMaxLength={4}
            codePlaceholder="XXXX"
            addLabel="Add PCC"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PTC Configuration</CardTitle>
          <CardDescription>
            Set priority order and masking for Passenger Type Codes. Position 1 has the highest priority and is used first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PriorityMaskTable
            items={ptcList}
            onChange={setPtcList}
            codeMaxLength={3}
            codePlaceholder="XXX"
            addLabel="Add PTC"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
