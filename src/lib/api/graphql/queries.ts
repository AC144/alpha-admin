import { gql } from '@apollo/client'

// Dashboard queries
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalCompanies
      companiesThisMonth
      totalUsers
      usersThisMonth
      activeSubscriptions
      securityAlerts
      activeSessions
      trackedPnrs
      priceDropsToday
    }
  }
`

export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int) {
    recentActivity(limit: $limit) {
      id
      timestamp
      action
      description
      user {
        name
        avatar
      }
      company {
        name
      }
    }
  }
`

export const GET_PRICE_DROP_ALERTS = gql`
  query GetPriceDropAlerts($since: DateTime) {
    priceDropAlerts(since: $since) {
      id
      pnr
      oldPrice
      newPrice
      savings
      company {
        id
        name
      }
      createdAt
    }
  }
`

// Company queries
export const GET_COMPANIES = gql`
  query GetCompanies($search: String, $status: CompanyStatus) {
    companies(search: $search, status: $status) {
      id
      name
      email
      status
      subscription
      usersCount
      enabledTools
      createdAt
    }
  }
`

export const GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      name
      email
      status
      subscription
      usersCount
      enabledTools
      createdAt
      updatedAt
      contacts {
        id
        person
        position
        phone
        email
        whatsapp
        telegram
        isPrimary
      }
      pccs {
        id
        gds
        homePcc
        worksPccs
      }
    }
  }
`

export const GET_COMPANY_USERS = gql`
  query GetCompanyUsers($companyId: ID!) {
    companyUsers(companyId: $companyId) {
      id
      name
      email
      avatar
      role
      status
      createdAt
      lastLoginAt
    }
  }
`

// Mutations
export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      email
      status
    }
  }
`

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      email
      status
    }
  }
`

export const TOGGLE_COMPANY_TOOL = gql`
  mutation ToggleCompanyTool($companyId: ID!, $toolId: String!, $enabled: Boolean!) {
    toggleCompanyTool(companyId: $companyId, toolId: $toolId, enabled: $enabled) {
      id
      enabledTools
    }
  }
`

// Subscriptions (for real-time updates)
export const PRICE_DROP_SUBSCRIPTION = gql`
  subscription OnPriceDrop($companyId: ID) {
    priceDrop(companyId: $companyId) {
      id
      pnr
      oldPrice
      newPrice
      savings
      company {
        id
        name
      }
    }
  }
`

export const SESSION_UPDATE_SUBSCRIPTION = gql`
  subscription OnSessionUpdate {
    sessionUpdate {
      id
      userId
      userName
      companyId
      companyName
      status
      startedAt
    }
  }
`

export const SERVICE_HEALTH_SUBSCRIPTION = gql`
  subscription OnServiceHealthChange {
    serviceHealthChange {
      id
      name
      status
      latency
      lastCheck
    }
  }
`
