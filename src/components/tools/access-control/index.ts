// Table-based UI components
export { RoleSelector } from './role-selector'
export { PermissionsTable } from './permissions-table'
export { RuleCell } from './rule-cell'
export { RuleEditPanel } from './rule-edit-panel'
export { PccRuleSetCard } from './pcc-rule-set-card'

// Types and utilities
export type { Role, PccRuleSet, ContextType, ContextRules, PermissionMode, CommandRule } from './types'
export {
  contextLabels,
  contextDescriptions,
  createEmptyCommandRule,
  createEmptyContextRules,
  createEmptyContexts,
  createEmptyPccRuleSet,
  isValidPcc,
} from './types'
