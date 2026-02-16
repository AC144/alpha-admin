import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/lib/hooks/use-toast'
import { ContactFormSection } from './contact-form-section'
import { GDSConfigSection } from './gds-config-section'
import { SubscriptionSelect } from './subscription-select'
import {
  createCompanySchema,
  type CreateCompanyInput,
} from '@/lib/validations/company'

interface AddCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCompanyInput) => void
}

export function AddCompanyModal({
  open,
  onOpenChange,
  onSubmit,
}: AddCompanyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
      contacts: [
        {
          id: uuidv4(),
          person: '',
          position: '',
          phone: '',
          email: '',
          whatsapp: '',
          telegram: '',
          isPrimary: true,
        },
      ],
      gdsConfigs: [
        {
          id: uuidv4(),
          provider: 'sabre',
          homePcc: '',
          worksPccs: [],
          credentials: {
            username: '',
            password: '',
          },
          thirdPartyApi: '',
        },
      ],
      subscription: 'trial',
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const handleFormSubmit = async (data: CreateCompanyInput) => {
    setIsSubmitting(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSubmit(data)
      toast({
        title: 'Company created successfully',
        description: `${data.name} has been added to the system.`,
      })
      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error creating company',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle>Create Company</DialogTitle>
          <DialogDescription>
            Add a new company with contacts, GDS configurations, and subscription plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6">
            <div className="py-4 space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Insert company name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <Separator />

              {/* Contacts Section */}
              <ContactFormSection form={form} />

              <Separator />

              {/* GDS Configuration Section */}
              <GDSConfigSection form={form} />

              <Separator />

              {/* Subscription Plan */}
              <SubscriptionSelect form={form} />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Company'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
