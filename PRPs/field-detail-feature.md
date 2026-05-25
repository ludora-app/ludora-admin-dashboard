# Field Detail & Administration PRP

## Goal
Implement a comprehensive field administration page at `/admin/fields/[id]` to display full details from the admin endpoint and provide an editable interface.

## Why
Administrators need a deep-dive view of each field to verify data accuracy (coordinates, full address), view all uploaded images, and see linked entities like the partner and creator.

## What
- **Data Fetching:** Fetch complete field data using `useFieldsFindOneForAdmin`.
- **Image Gallery:** Implement a responsive carousel using `embla-carousel-react` to display multiple field images.
- **Admin Form:**
    - Display and edit core information: Name, Address, Short Address, Latitude, Longitude.
    - Status management: Visual representation of the field's status (Vérifié, En attente, Rejeté).
    - Field type: Public or Private.
- **Contextual Data:** Display read-only info about the associated **Partner** and the **Creator**.
- **Soft UI Implementation:** Adhere to Design System guidelines using tinted shadows and card-based layouts.

## Technical Context

### Files to Reference (read-only)
- `src/api/generated/api/fields/fields.api.ts` - For `useFieldsFindOneForAdmin` hook.
- `src/api/generated/model/adminFindOneFieldResponseData.api.ts` - For the data schema.
- `src/features/fields/components/field-card.tsx` - For status badge consistency.
- `context/DESIGN.md` - For Soft UI tokens and patterns.

### Files to Implement/Modify
- `src/app/admin/fields/[id]/page.tsx` - Main page component for data orchestration.
- `src/features/fields/components/field-details-form.tsx` - Form component for field attributes.
- `src/features/fields/components/field-images-carousel.tsx` - Image gallery component using Embla.
- `src/features/fields/components/field-info-section.tsx` - Read-only sections for Partner and Creator.

### Existing Patterns to Follow
- Form validation with `react-hook-form` and `zod`.
- Responsive grid layout for form sections.
- `shadcn/ui` components for inputs, buttons, and badges.

## Implementation Details

### API/Endpoints
- **Fetch:** `GET /fields/admin/findOne/:uid` via `useFieldsFindOneForAdmin`.
- **Update:** Logic prepared in form (endpoint currently unavailable).

### Components
- **FieldImagesCarousel:**
  - Standard Embla setup with prev/next buttons.
  - Aspect-video container for images.
- **FieldDetailsForm:**
  - Grouped fields: Identification, Location, Status.
  - Soft UI Cards for each section.

## Validation Criteria

### Functional Requirements
- [ ] Field details are correctly populated from the API.
- [ ] Carousel allows navigation through all available field images.
- [ ] All field information (Name, Address, Lat/Lng) is visible.
- [ ] Partner and Creator details are displayed clearly.

### Technical Requirements
- [ ] TypeScript compiles without errors.
- [ ] No layout shifts during image loading.
- [ ] Correct use of Design System color tokens for status badges.
- [ ] Proper loading/error states handled for the fetch operation.
