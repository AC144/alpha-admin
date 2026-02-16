import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { CreateCompanyInput } from '@/lib/validations/company'

interface ContactFormSectionProps {
  form: UseFormReturn<CreateCompanyInput>
}

export function ContactFormSection({ form }: ContactFormSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts',
  })

  const { register, watch, setValue, formState: { errors } } = form

  const contacts = watch('contacts')

  const handleAddContact = () => {
    append({
      id: uuidv4(),
      person: '',
      position: '',
      phone: '',
      email: '',
      whatsapp: '',
      telegram: '',
      isPrimary: fields.length === 0,
    })
  }

  const handleRemoveContact = (index: number) => {
    const wasRemovingPrimary = contacts[index]?.isPrimary
    remove(index)

    // If we removed the primary contact and there are still contacts, make the first one primary
    if (wasRemovingPrimary && fields.length > 1) {
      setTimeout(() => {
        setValue('contacts.0.isPrimary', true)
      }, 0)
    }
  }

  const handlePrimaryChange = (index: number) => {
    contacts.forEach((_, i) => {
      setValue(`contacts.${i}.isPrimary`, i === index)
    })
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Contacts</Label>

      {fields.length > 0 && (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Person *</th>
                  <th className="px-3 py-2 text-left font-medium">Position</th>
                  <th className="px-3 py-2 text-left font-medium">Phone</th>
                  <th className="px-3 py-2 text-left font-medium">Email *</th>
                  <th className="px-3 py-2 text-left font-medium">WhatsApp</th>
                  <th className="px-3 py-2 text-left font-medium">Telegram</th>
                  <th className="px-3 py-2 text-center font-medium">Primary</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="border-b last:border-0">
                    <td className="px-3 py-2">
                      <Input
                        {...register(`contacts.${index}.person`)}
                        placeholder="Name"
                        className="h-8 min-w-[120px]"
                      />
                      {errors.contacts?.[index]?.person && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.contacts[index]?.person?.message}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        {...register(`contacts.${index}.position`)}
                        placeholder="Title"
                        className="h-8 min-w-[100px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        {...register(`contacts.${index}.phone`)}
                        placeholder="Phone"
                        className="h-8 min-w-[110px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        {...register(`contacts.${index}.email`)}
                        type="email"
                        placeholder="Email"
                        className="h-8 min-w-[150px]"
                      />
                      {errors.contacts?.[index]?.email && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.contacts[index]?.email?.message}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        {...register(`contacts.${index}.whatsapp`)}
                        placeholder="WhatsApp"
                        className="h-8 min-w-[110px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        {...register(`contacts.${index}.telegram`)}
                        placeholder="Telegram"
                        className="h-8 min-w-[100px]"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <RadioGroup
                        value={contacts[index]?.isPrimary ? 'true' : 'false'}
                        onValueChange={() => handlePrimaryChange(index)}
                      >
                        <RadioGroupItem value="true" className="mx-auto" />
                      </RadioGroup>
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveContact(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {errors.contacts?.message && (
        <p className="text-sm text-destructive">{errors.contacts.message}</p>
      )}
      {errors.contacts?.root?.message && (
        <p className="text-sm text-destructive">{errors.contacts.root.message}</p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={handleAddContact}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add contact
      </Button>
    </div>
  )
}
