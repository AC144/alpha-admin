import { UseFormReturn, useFieldArray, Controller } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PCCTagInput } from '@/components/ui/pcc-tag-input'
import { Card, CardContent } from '@/components/ui/card'
import {
  type CreateCompanyInput,
  type GDSProvider,
  gdsProviders,
  thirdPartyApiOptions,
} from '@/lib/validations/company'

interface GDSConfigSectionProps {
  form: UseFormReturn<CreateCompanyInput>
}

export function GDSConfigSection({ form }: GDSConfigSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'gdsConfigs',
  })

  const { register, control, formState: { errors } } = form

  const handleAddGDS = () => {
    append({
      id: uuidv4(),
      provider: 'sabre',
      homePcc: '',
      worksPccs: [],
      credentials: {
        username: '',
        password: '',
      },
      thirdPartyApi: '',
    })
  }

  const formatHomePcc = (value: string): string => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">GDS Configuration</Label>

      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>

          <CardContent className="pt-6 space-y-4">
            {/* GDS Provider */}
            <div className="grid gap-2">
              <Label>GDS</Label>
              <Controller
                control={control}
                name={`gdsConfigs.${index}.provider`}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value: GDSProvider) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="Select GDS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {gdsProviders.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                          {provider.description && (
                            <span className="text-muted-foreground ml-2">
                              - {provider.description}
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gdsConfigs?.[index]?.provider && (
                <p className="text-sm text-destructive">
                  {errors.gdsConfigs[index]?.provider?.message}
                </p>
              )}
            </div>

            {/* PCC Configuration */}
            <div className="space-y-2">
              <Label>PCC Configuration</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Home PCC */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Home PCC</Label>
                  <Controller
                    control={control}
                    name={`gdsConfigs.${index}.homePcc`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => field.onChange(formatHomePcc(e.target.value))}
                        placeholder="e.g. U9XF"
                        className="font-mono uppercase"
                        maxLength={4}
                      />
                    )}
                  />
                  {errors.gdsConfigs?.[index]?.homePcc && (
                    <p className="text-xs text-destructive">
                      {errors.gdsConfigs[index]?.homePcc?.message}
                    </p>
                  )}
                </div>

                {/* Works PCCs */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Works PCC's</Label>
                  <Controller
                    control={control}
                    name={`gdsConfigs.${index}.worksPccs`}
                    render={({ field }) => (
                      <PCCTagInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Type PCC..."
                        error={!!errors.gdsConfigs?.[index]?.worksPccs}
                      />
                    )}
                  />
                  {errors.gdsConfigs?.[index]?.worksPccs && (
                    <p className="text-xs text-destructive">
                      {errors.gdsConfigs[index]?.worksPccs?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* API Credentials */}
            <div className="space-y-2">
              <Label>API Credentials</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Username</Label>
                  <Input
                    {...register(`gdsConfigs.${index}.credentials.username`)}
                    placeholder="Username"
                  />
                  {errors.gdsConfigs?.[index]?.credentials?.username && (
                    <p className="text-xs text-destructive">
                      {errors.gdsConfigs[index]?.credentials?.username?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Password</Label>
                  <Input
                    {...register(`gdsConfigs.${index}.credentials.password`)}
                    type="password"
                    placeholder="Password"
                  />
                  {errors.gdsConfigs?.[index]?.credentials?.password && (
                    <p className="text-xs text-destructive">
                      {errors.gdsConfigs[index]?.credentials?.password?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3rd Party API */}
            <div className="grid gap-2">
              <Label>USE 3rd party API</Label>
              <Controller
                control={control}
                name={`gdsConfigs.${index}.thirdPartyApi`}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {thirdPartyApiOptions.map((option) => (
                        <SelectItem key={option.value || 'none'} value={option.value || 'none'}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {errors.gdsConfigs?.message && (
        <p className="text-sm text-destructive">{errors.gdsConfigs.message}</p>
      )}
      {errors.gdsConfigs?.root?.message && (
        <p className="text-sm text-destructive">{errors.gdsConfigs.root.message}</p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={handleAddGDS}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add GDS
      </Button>
    </div>
  )
}
