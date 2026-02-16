
import { Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AdminLayout } from '@/components/layout/admin-layout'

// Pages
import { DashboardPage } from '@/app/dashboard/page'
import { CompaniesPage } from '@/app/companies/page'
import { CompanyDetailPage } from '@/app/companies/[companyId]/page'
import { UniFireConfigPage } from '@/app/companies/[companyId]/tools/unifire/page'
import {
  UniFireProjectPage,
  PriceTrackerProjectPage,
  BitFinderProjectPage,
  AnalyticsPage,
  AuditPage,
  UsersPage,
  SettingsPage,
  StatusPage,
} from '@/app/pages'
import { InfoDockPage } from '@/app/info-dock/page'

function App() {
  return (
    <TooltipProvider>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Admin routes with layout */}
        <Route element={<AdminLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Companies */}
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/new" element={<CompaniesPage />} />
          <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
          <Route path="/companies/:companyId/tools/unifire" element={<UniFireConfigPage />} />
          <Route path="/companies/:companyId/tools/:toolId" element={<CompanyDetailPage />} />

          {/* Client Projects */}
          <Route path="/projects/unifire" element={<UniFireProjectPage />} />
          <Route path="/projects/unifire/access-control" element={<UniFireProjectPage />} />
          <Route path="/projects/price-tracker" element={<PriceTrackerProjectPage />} />
          <Route path="/projects/price-tracker/access-control" element={<PriceTrackerProjectPage />} />
          <Route path="/projects/bit-finder" element={<BitFinderProjectPage />} />
          <Route path="/projects/bit-finder/access-control" element={<BitFinderProjectPage />} />

          {/* Analytics */}
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Audit */}
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/audit/services" element={<AuditPage />} />
          <Route path="/audit/projects" element={<AuditPage />} />
          <Route path="/audit/users" element={<AuditPage />} />

          {/* Users */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/invite" element={<UsersPage />} />

          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Info Dock */}
          <Route path="/info-dock" element={<InfoDockPage />} />

          {/* Status */}
          <Route path="/status" element={<StatusPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </TooltipProvider>
  )
}

export default App
