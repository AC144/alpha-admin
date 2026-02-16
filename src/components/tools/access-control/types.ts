export type ContextType = 'any' | 'pnr' | 'ticketedPnr'

export type PermissionMode = 'allow-listed' | 'allow-all-except'

// Simplified context rules - commands only, no PCC filters
// PCC filtering is handled at the PccRuleSet level
export interface ContextRules {
  mode: PermissionMode
  allowExact: string[]      // Exact match commands to allow
  allowStartsWith: string[] // Prefix commands to allow
  denyExact: string[]       // Exact match commands to deny
  denyStartsWith: string[]  // Prefix commands to deny
}

// PCC Rule Set - groups PCCs with their permission rules
export interface PccRuleSet {
  id: string
  pccs: string[]            // PCCs this rule set applies to (["*"] for all/default)
  contexts: {
    any: ContextRules
    pnr: ContextRules
    ticketedPnr: ContextRules
  }
}

export interface Role {
  id: string
  name: string
  description: string
  pccRuleSets: PccRuleSet[]
}

export const contextLabels: Record<ContextType, string> = {
  any: 'Any Context',
  pnr: 'PNR Context',
  ticketedPnr: 'Ticketed PNR Context',
}

export const contextDescriptions: Record<ContextType, string> = {
  any: 'Commands available in any situation',
  pnr: 'Commands available when a PNR is active',
  ticketedPnr: 'Commands available when working with a ticketed PNR',
}

export const createEmptyContextRules = (mode: PermissionMode = 'allow-listed'): ContextRules => ({
  mode,
  allowExact: [],
  allowStartsWith: [],
  denyExact: [],
  denyStartsWith: [],
})

export const createEmptyContexts = (): PccRuleSet['contexts'] => ({
  any: createEmptyContextRules(),
  pnr: createEmptyContextRules(),
  ticketedPnr: createEmptyContextRules(),
})

export const createEmptyPccRuleSet = (pccs: string[] = ['*']): PccRuleSet => ({
  id: String(Date.now()),
  pccs,
  contexts: createEmptyContexts(),
})

export const isValidPcc = (pcc: string): boolean => {
  return /^[A-Z0-9]{4}$/.test(pcc) || pcc === '*'
}

// Legacy types for backwards compatibility during migration
export interface CommandRule {
  commands: string[]
  includePccs: string[]
  excludePccs: string[]
}

export const createEmptyCommandRule = (): CommandRule => ({
  commands: [],
  includePccs: [],
  excludePccs: [],
})
