
import { Users, CreditCard, Wrench } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Company } from '@/types'

interface CompanyOverviewProps {
  company: Company
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <p className="mt-2 text-3xl font-semibold">{company.usersCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                members in this company
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Subscription Plan
              </p>
              <p className="mt-2 text-3xl font-semibold capitalize">
                {company.subscription}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="success">{company.status}</Badge>
              </div>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Enabled Tools
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {company.enabledTools.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {company.enabledTools.join(', ') || 'No tools enabled'}
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
