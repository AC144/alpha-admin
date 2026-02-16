
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


interface CompanySettingsProps {
  companyId: string
}

export function CompanySettings({ companyId: _companyId }: CompanySettingsProps) {
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            General Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Basic company information and configuration.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input defaultValue="Travel Pelicans" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Email</label>
              <Input defaultValue="contact@travelpelicans.com" type="email" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base font-medium text-destructive">
            Danger Zone
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Irreversible and destructive actions.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
            <div>
              <p className="font-medium">Deactivate Company</p>
              <p className="text-sm text-muted-foreground">
                Temporarily disable all access for this company.
              </p>
            </div>
            <Button variant="outline">Deactivate</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
            <div>
              <p className="font-medium">Delete Company</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this company and all associated data.
              </p>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
