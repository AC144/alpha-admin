import React from 'react'
import { Link } from 'react-router-dom'
import { Flame, TrendingDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface CompanyToolsProps {
  companyId: string
}

const tools = [
  {
    id: 'price-tracker',
    name: 'Price Tracker',
    description: 'Automated PNR price monitoring and rule-based actions.',
    icon: TrendingDown,
    enabled: true,
    configPath: 'price-tracker',
  },
  {
    id: 'unifire',
    name: 'UniFire',
    description: 'Centralized setup for UniFire terminal.',
    icon: Flame,
    enabled: false,
    configPath: 'unifire',
  },
]

export function CompanyTools({ companyId }: CompanyToolsProps) {
  const [toolStates, setToolStates] = React.useState(
    tools.reduce((acc, tool) => ({ ...acc, [tool.id]: tool.enabled }), {} as Record<string, boolean>)
  )

  const handleToggle = (toolId: string) => {
    setToolStates((prev) => ({ ...prev, [toolId]: !prev[toolId] }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Tools & Subscriptions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage and configure tools enabled for this company.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <tool.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{tool.name}</h4>
                    <Switch
                      checked={toolStates[tool.id]}
                      onCheckedChange={() => handleToggle(tool.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {toolStates[tool.id] ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link
                  to={`/companies/${companyId}/tools/${tool.configPath}`}
                  className="gap-1"
                >
                  Configure
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
