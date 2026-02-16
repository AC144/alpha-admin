// PNR Tool Configuration Types

// Variable types that auto-fill at runtime
export enum VariableType {
  Agent = 1,   // Agent signature - "6FirstLastname or nickname"
  Date1 = 2,   // Date for 0OTH segment - auto-calculated
  Date2 = 3,   // AA ticketing time-limit - now + 2 days (Central Time)
}

export interface PnrCommand {
  id: string
  command: string              // The Sabre command text, may contain <> placeholder
  hasVariables: boolean        // True if command contains <>
  variableTypes: VariableType[] // Which variables to substitute (can be multiple)
  order: number                // Execution order (1-based)
}

export interface PccCommandGroup {
  id: string
  pccIds: string[]             // One or more PCCs sharing this command set
  commands: PnrCommand[]
}

// Full config for a company
export interface PnrToolConfig {
  pccGroups: PccCommandGroup[]
}

// Variable type display info
export const VARIABLE_TYPE_INFO: Record<VariableType, { label: string; description: string; example: string }> = {
  [VariableType.Agent]: {
    label: 'Agent',
    description: 'Agent signature (name/nickname)',
    example: '6<> → 6JOHNSMITH',
  },
  [VariableType.Date1]: {
    label: 'Date1',
    description: 'Auto-calculated date for 0OTH segment',
    example: '0OTHYYGK1MIA<> → 0OTHYYGK1MIA15MAR',
  },
  [VariableType.Date2]: {
    label: 'Date2',
    description: 'Ticketing time-limit (now + 2 days, Central Time)',
    example: '7TAC/<> → 7TAC/17MAR',
  },
}
