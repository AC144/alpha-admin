import { z } from 'zod'

export const contactSchema = z.object({
  id: z.string(),
  person: z.string().min(2, 'Name must be at least 2 characters'),
  position: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address'),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
  isPrimary: z.boolean(),
})

export const gdsConfigSchema = z.object({
  id: z.string(),
  provider: z.enum(['sabre', 'amadeus', 'travelport_galileo', 'travelport_apollo', 'travelport_worldspan']),
  homePcc: z.string()
    .length(4, 'PCC must be exactly 4 characters')
    .regex(/^[A-Z0-9]{4}$/, 'PCC must contain only uppercase letters and numbers'),
  worksPccs: z.array(
    z.string()
      .length(4, 'PCC must be exactly 4 characters')
      .regex(/^[A-Z0-9]{4}$/, 'Invalid PCC format')
  ),
  credentials: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
  thirdPartyApi: z.string().optional(),
})

export const createCompanySchema = z.object({
  name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  contacts: z.array(contactSchema)
    .min(1, 'At least one contact is required')
    .refine(
      (contacts) => contacts.some(c => c.isPrimary),
      'One contact must be marked as primary'
    ),
  gdsConfigs: z.array(gdsConfigSchema)
    .min(1, 'At least one GDS configuration is required'),
  subscription: z.enum(['trial', 'basic', 'pro', 'enterprise']),
})

export type ContactInput = z.infer<typeof contactSchema>
export type GDSConfigInput = z.infer<typeof gdsConfigSchema>
export type CreateCompanyInput = z.infer<typeof createCompanySchema>

export type GDSProvider = 'sabre' | 'amadeus' | 'travelport_galileo' | 'travelport_apollo' | 'travelport_worldspan'
export type SubscriptionPlan = 'trial' | 'basic' | 'pro' | 'enterprise'

export const gdsProviders = [
  { value: 'sabre' as const, label: 'Sabre', description: 'Primary GDS' },
  { value: 'amadeus' as const, label: 'Amadeus', description: '' },
  { value: 'travelport_galileo' as const, label: 'Travelport - Galileo', description: '' },
  { value: 'travelport_apollo' as const, label: 'Travelport - Apollo', description: '' },
  { value: 'travelport_worldspan' as const, label: 'Travelport - Worldspan', description: '' },
]

export const thirdPartyApiOptions = [
  { value: '', label: 'None (Direct GDS)' },
  { value: 'travelport_uapi', label: 'Travelport Universal API' },
  { value: 'sabre_rest', label: 'Sabre REST APIs' },
  { value: 'amadeus_self_service', label: 'Amadeus Self-Service' },
  { value: 'amadeus_enterprise', label: 'Amadeus Enterprise' },
  { value: 'duffel', label: 'Duffel' },
  { value: 'kiwi', label: 'Kiwi.com' },
  { value: 'travelpayouts', label: 'Travelpayouts' },
  { value: 'custom', label: 'Custom Integration' },
]

export const subscriptionPlans = [
  {
    value: 'trial' as const,
    label: 'Trial',
    description: '14-day free trial',
    price: 'Free',
    features: ['1 user', '1 PCC', 'Basic support'],
  },
  {
    value: 'basic' as const,
    label: 'Basic',
    description: 'For small agencies',
    price: '$99/mo',
    features: ['5 users', '2 PCCs', 'Email support'],
  },
  {
    value: 'pro' as const,
    label: 'Pro',
    description: 'For growing agencies',
    price: '$299/mo',
    features: ['15 users', '5 PCCs', 'Priority support', 'Price Tracker'],
  },
  {
    value: 'enterprise' as const,
    label: 'Enterprise',
    description: 'For large agencies',
    price: 'Custom',
    features: ['Unlimited users', 'Unlimited PCCs', '24/7 support', 'All tools', 'Custom integrations'],
  },
]
