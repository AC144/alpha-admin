# Alpha Admin

Master admin dashboard for managing travel agencies, GDS tools, and services.

## Tech Stack

- **Framework**: React 18 + React Router 6
- **Language**: TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Data Fetching**: 
  - Apollo Client (GraphQL) - Complex queries, real-time subscriptions
  - TanStack Query (REST) - Auth, uploads, simple CRUD
- **Forms**: React Hook Form + Zod
- **State**: Zustand (global UI state)
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
VITE_GRAPHQL_URL=http://localhost:8080/graphql
```

## Project Structure

```
src/
├── app/                      # Pages/routes
│   ├── dashboard/
│   ├── companies/
│   └── ...
├── components/
│   ├── ui/                   # Shadcn components
│   ├── layout/               # Layout components
│   ├── dashboard/            # Dashboard-specific
│   ├── companies/            # Company-specific
│   └── ...
├── lib/
│   ├── api/                  # Apollo, Query client
│   ├── hooks/                # Custom hooks
│   └── utils/                # Utilities
└── types/                    # TypeScript types
```

## Navigation Structure

```
📊 Dashboard
🏢 Companies
   └── [Company Detail]
       ├── Overview
       ├── Users
       ├── Tools
       └── Settings
📁 Client Projects
   ├── UniFire (Roles, Permissions)
   ├── Price Tracker (Roles, Permissions)
   └── VipFinder (Roles, Permissions)
📊 Analytics
📋 Audit (Services, Projects, Users)
👥 Users
⚙️ Settings
🟢 Status
```

## GraphQL Setup

Generate TypeScript types from your GraphQL schema:

```bash
npm run codegen
```

## Backend Requirements

The frontend expects these endpoints:

### GraphQL (`/graphql`)
- Queries: dashboardStats, companies, company, companyUsers
- Mutations: createCompany, updateCompany, toggleCompanyTool
- Subscriptions: priceDrop, sessionUpdate, serviceHealthChange

### REST (`/api`)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/health`
- File uploads

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Generate GraphQL types
npm run codegen
```

## Deployment

```bash
npm run build
```

Output will be in `dist/` folder. Deploy to any static hosting.

## License

Proprietary - Internal use only.
