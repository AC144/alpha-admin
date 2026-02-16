import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface RowSettingsPopoverProps {
  ndc: boolean
  onNdcChange: (value: boolean) => void
}

export function RowSettingsPopover({ ndc, onNdcChange }: RowSettingsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <p className="text-sm font-semibold">Row Settings</p>

          <div className="flex items-center justify-between">
            <Label htmlFor="ndc-toggle" className="text-sm cursor-pointer">NDC</Label>
            <Switch
              id="ndc-toggle"
              checked={ndc}
              onCheckedChange={onNdcChange}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            When enabled, this request uses NDC. Secondary PCCs and Corporate IDs are not applicable.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
