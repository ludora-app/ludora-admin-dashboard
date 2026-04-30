# Ludora Admin Dashboard Skeleton & Routing PRP

## Goal
Establish the foundational routing structure and core layout for the Ludora Admin Dashboard, ensuring a professional and consistent navigation experience for administrators.

## Why
A solid application skeleton is crucial for:
- Providing a consistent user experience across different admin modules.
- Facilitating parallel development of individual features (Users, Terrains, etc.).
- Ensuring proper access control and layout inheritance using Next.js App Router conventions.

## What
Implement the base layout and routing hierarchy as defined in the project's technical specifications.

### Scope Boundaries
- **Included**:
    - `app/admin` directory structure.
    - Shared admin layout (`app/admin/layout.tsx`) with a responsive sidebar.
    - Sidebar navigation component with links to all major sections.
    - Placeholder pages for all routes to verify navigation.
    - Mobile-responsive navigation (hamburger menu).
- **Excluded**:
    - Actual data fetching (will use static placeholders for now).
    - Final UI design of individual pages (shells only).
    - Authentication logic (will be handled in a separate PRP/step).

### Route Structure to Implement
- `/admin/dashboard`: Global statistics (Home)
- `/admin/users`: User management list
- `/admin/users/[id]`: User profile detail
- `/admin/terrains`: Terrain management
- `/admin/terrains/pending`: Validation queue
- `/admin/terrains/[id]`: Terrain editor
- `/admin/sessions`: Sports sessions overview
- `/admin/reports`: Moderation/Signalements center

## Technical Context

### Files to Reference (read-only)
- `GEMINI.md`: Primary source for routing and feature specifications.
- `app/layout.tsx`: Root layout for global styles.

### Files to Implement/Modify
- `app/admin/layout.tsx`: Main admin shell with sidebar/navbar.
- `components/admin/sidebar.tsx`: Navigation sidebar component.
- `app/admin/dashboard/page.tsx`
- `app/admin/users/page.tsx` & `app/admin/users/[id]/page.tsx`
- `app/admin/terrains/page.tsx`, `app/admin/terrains/pending/page.tsx`, & `app/admin/terrains/[id]/page.tsx`
- `app/admin/sessions/page.tsx`
- `app/admin/reports/page.tsx`

### Existing Patterns to Follow
- Next.js 15/16 App Router conventions (nested layouts).
- Tailwind CSS 4 utility classes for styling.
- Standard Radix/shadcn-like component structures for accessibility.

## Implementation Details

### Dependencies to Add
The following libraries are required for the skeleton:
- `lucide-react`: For navigation icons.
- `clsx` & `tailwind-merge`: For dynamic class management.

### Components
- **Sidebar**: A vertical navigation bar that remains persistent on desktop and toggles on mobile.
- **AdminHeader**: A top bar for breadcrumbs, search, and user profile (placeholder).
- **PageShell**: A wrapper for pages to ensure consistent padding and title formatting.

## Validation Criteria

### Functional Requirements
- [ ] Navigating to any `/admin/*` route displays the Admin Sidebar.
- [ ] All links in the sidebar point to the correct routes.
- [ ] The sidebar highlights the "active" route correctly.
- [ ] Mobile navigation is functional (drawer or toggle).
- [ ] Nested routes (e.g., `/admin/users/123`) correctly inherit the admin layout.

### Technical Requirements
- [ ] TypeScript compiles without errors.
- [ ] Tailwind CSS 4 used for all styling.
- [ ] No layout shifts when navigating between admin pages.
- [ ] Responsive design (Mobile, Tablet, Desktop).

### Testing Steps
1. Start the development server.
2. Visit `/admin/dashboard` and verify the sidebar is present.
3. Click through each sidebar link to ensure all pages load correctly.
4. Resize the browser window to verify the mobile navigation behavior.
5. Manually enter a nested URL (e.g., `/admin/terrains/pending`) and verify the layout.
