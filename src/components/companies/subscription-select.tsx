import { UseFormReturn, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import {
  type CreateCompanyInput,
  type SubscriptionPlan,
  subscriptionPlans,
} from '@/lib/validations/company'

interface SubscriptionSelectProps {
  form: UseFormReturn<CreateCompanyInput>
}

export function SubscriptionSelect({ form }: SubscriptionSelectProps) {
  const { control, formState: { errors } } = form

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Subscription Plan</Label>

      <Controller
        control={control}
        name="subscription"
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={(value: SubscriptionPlan) => field.onChange(value)}
            className="grid grid-cols-2 gap-4"
          >
            {subscriptionPlans.map((plan) => (
              <label
                key={plan.value}
                className={cn(
                  'relative flex cursor-pointer flex-col rounded-lg border p-4 transition-colors hover:bg-muted/50',
                  field.value === plan.value
                    ? 'border-primary bg-primary/5'
                    : 'border-input'
                )}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={plan.value} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium">{plan.label}</span>
                      <span className="text-sm font-semibold text-primary">
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li
                          key={i}
                          className="text-xs text-muted-foreground flex items-center gap-1"
                        >
                          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </label>
            ))}
          </RadioGroup>
        )}
      />

      {errors.subscription && (
        <p className="text-sm text-destructive">{errors.subscription.message}</p>
      )}
    </div>
  )
}
