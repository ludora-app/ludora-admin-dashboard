# Admin Dashboard Metrics Feature PRP

## Goal
Implement a dynamic and secure Admin Dashboard that visualizes real-time business and application-level metrics aggregated by a Prometheus instance.

## Why
The Ludora administrative team needs a centralized, real-time view of platform activity (user growth, active sessions, terrain validations) to monitor platform health, make data-driven decisions, and react quickly to anomalies. Connecting to Prometheus allows us to leverage time-series data efficiently without overloading the transactional database.

## What
- **Next.js Proxy API**: A secure server-side route handler that communicates with the Prometheus HTTP API (using PromQL) to fetch aggregated metrics without exposing the Prometheus endpoint or credentials to the client.
- **Dynamic Metric Cards**: Replace hardcoded values in the dashboard with live data for Users, Sessions, Terrains, and Activity.
- **Interactive Charts**: Implement activity and growth charts using `recharts`.
- **Custom React Hooks**: Encapsulate the fetching logic (via TanStack Query) to retrieve metrics from the new Next.js proxy route.

### Scope Boundaries
- **Included**: 
  - `src/app/admin/dashboard/page.tsx` update.
  - Creation of `/api/metrics/prometheus/route.ts`.
  - Integration of `recharts`.
  - Fetching business/app-level metrics (e.g., total users, active sessions).
- **Excluded**:
  - Configuring the actual Prometheus server or modifying the backend's `/metrics` export (assumed to be exporting custom app metrics).
  - Infrastructure metrics (CPU, Memory) are excluded based on current scope.

## Technical Context

### Files to Reference (read-only)
- `src/components/metric-card.tsx` - Reusable component for displaying KPI numbers.
- `src/api/api.instance.ts` - For understanding the current `ky` HTTP client setup (though the proxy might use a standard fetch or ky directly).
- `GEMINI.md` - For project guidelines (Tailwind v4, React Query, shadcn/ui).
- `package.json` - To verify dependencies.

### Files to Implement/Modify
- `src/app/admin/dashboard/page.tsx` - Convert to use client-side fetching hooks and integrate charts.
- `src/app/api/metrics/prometheus/route.ts` - **New** Next.js Route Handler to proxy PromQL queries securely.
- `src/hooks/use-prometheus-metrics.ts` - **New** custom TanStack Query hook to fetch data from our proxy route.
- `src/components/charts/activity-chart.tsx` - **New** Recharts wrapper component.
- `package.json` - Add `recharts` dependency.
- `.env` and `.env.development` - Add `PROMETHEUS_URL` and `PROMETHEUS_API_KEY` (if applicable).

### Existing Patterns to Follow
- **Architecture**: Keep Next.js App Router conventions. Server components should be the default, but since we are polling metrics, the dashboard content (or its children) will likely be Client Components (`"use client"`) using TanStack Query.
- **Styling**: Use Tailwind utility classes (`text-text-primary`, `bg-surface-secondary`, etc.) as defined in `DESIGN.md`.
- **API Fetching**: While Orval handles the main backend API, the Next.js proxy route is internal. We should still use `ky` (or Next.js `fetch`) on the server and wrap the client call in a TanStack `useQuery`.

## Implementation Details

### API/Endpoints
**Next.js Route Handler: `GET /api/metrics/prometheus`**
- Accepts a query parameter `query` (the PromQL string) or predefined metric keys (e.g., `type=total_users` to abstract PromQL from the client).
- **Security**: Must verify the user session (check auth token) before proxying the request to Prometheus.
- **Response**: Standardized JSON format parsing the Prometheus `data.result` array.

### Components
- **`ActivityChart`**: A `recharts` AreaChart or LineChart displaying the number of active sessions or new users over the last 7/30 days. Uses the `surface-secondary` background and Ludora's primary colors (e.g., `violet-principal`).

### Environment Variables
```env
PROMETHEUS_URL="http://prometheus.internal:9090"
# PROMETHEUS_AUTH_TOKEN="..." (if required by the instance)
```

## Validation Criteria

### Functional Requirements
- [ ] Dashboard `MetricCard`s display real data fetched from the Prometheus proxy.
- [ ] A line/area chart successfully renders time-series data (e.g., activity over the last week) using `recharts`.
- [ ] The Next.js `/api/metrics/prometheus` route is protected and returns a 401 Unauthorized if accessed without a valid admin session.
- [ ] The dashboard gracefully handles loading states (skeletons) and errors (e.g., if Prometheus is down).

### Technical Requirements
- [ ] Prometheus URL is never exposed to the frontend browser network tab.
- [ ] TypeScript compiles without errors, with strict typing for the Prometheus response structure.
- [ ] Next.js Route Handler correctly parses PromQL query results into a flat JSON structure for Recharts.

### Testing Steps
1. Add mock `PROMETHEUS_URL` to local `.env`.
2. Login as Admin and navigate to `/admin/dashboard`.
3. Verify the loading skeletons appear while metrics are fetched.
4. Verify the MetricCards populate with the correct integers.
5. Verify the Activity Chart renders without console errors.
6. Attempt to access `/api/metrics/prometheus?type=users` directly in an incognito window and verify it returns a 401.