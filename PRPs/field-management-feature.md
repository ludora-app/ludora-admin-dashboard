# Field Management Feature PRP

## Goal
Implement a comprehensive Field (Terrain) Management page that allows administrators to browse, filter, and navigate to detailed views of sports fields using the `/fields/admin/list/collection` endpoint.

## Why
Admins need an efficient way to oversee the inventory of sports fields, verify their status, and quickly find specific fields by name or sport.

## What
- **Field List Page:** A grid view of sports fields.
- **Field Filters:** A component to filter fields by search query, status, and sports.
- **Field Card:** A visually appealing card showing the field's image, name, address, and sports badges.
- **Navigation:** Redirection to the field detail page on click.

## Technical Context

### Files to Reference (read-only)
- `src/api/generated/api/fields/fields.api.ts` - For the `useFieldsFindAllFieldsAdmin` hook.
- `src/api/generated/model/fieldResponseDto.api.ts` - For the field data structure.
- `context/DESIGN.md` - For Soft UI implementation details (shadows, spacing, colors).

### Files to Implement/Modify
- `src/features/fields/components/field-card.tsx` - Individual field card component.
- `src/features/fields/components/field-filters.tsx` - Filter state management and UI.
- `src/features/fields/components/fields-list.tsx` - Grid component for fetching and displaying cards.
- `src/app/admin/fields/page.tsx` - Main page assembly.

### Existing Patterns to Follow
- Use `shadcn/ui` components for inputs and selects.
- Adhere to **Soft UI** guidelines: no visible borders, elevated surfaces with tinted shadows (`shadow-card`).
- Organize components within `src/features/fields`.

## Implementation Details

### API/Endpoints
- **Fetch Fields:** `GET /fields/admin/list/collection` via `useFieldsFindAllFieldsAdmin`.

### Components
- **FieldCard:**
  - Display the first image from `fieldImages`.
  - Show `name`, `shortAddress`, and badges for `sports`.
  - Style: `bg-white rounded-card shadow-card hover:shadow-card-hover transition-all`.
- **FieldFilters:**
  - Search input with debounce.
  - Status select (All, Pending, Approved, Rejected).
  - Sports selection.

## Validation Criteria

### Functional Requirements
- [ ] Fields are fetched and displayed on page load.
- [ ] Filtering by search, status, or sports updates the list.
- [ ] Clicking a card redirects to `/admin/fields/[id]`.

### Technical Requirements
- [ ] TypeScript compiles without errors.
- [ ] Soft UI styling correctly applied.
- [ ] Proper loading/empty states handled.
