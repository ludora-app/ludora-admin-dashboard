# Field Creation Feature PRP

## Goal
Implement a "Create Field" functionality in the admin dashboard, allowing administrators to add new sports fields via a dedicated creation page.

## Why
Administrators need to manually add fields to the platform. Providing a consistent UI for creation that matches the editing experience ensures a smooth workflow and data integrity.

## What
- **Add Button:** A new "Ajouter un terrain" button on the `/admin/fields` list page.
- **Creation Page:** A new route at `/admin/fields/create`.
- **Creation Form:** A form that reuses the UI components and logic from the field detail page (`FieldPhotosSection`, `FieldSportsSection`, `AddressAutocomplete`).
- **API Integration:** Use the `POST /fields/admin` endpoint via the `useFieldsAdminCreateField` hook.
- **Success Flow:** Redirect the user to the newly created field's detail page (`/admin/fields/[id]`) upon successful creation.

## Technical Context

### Files to Reference (read-only)
- `src/app/admin/fields/[id]/page.tsx` - Layout and orchestration of the field editor.
- `src/features/fields/components/field-details-form.tsx` - Reference for form structure and logic.
- `src/api/generated/api/fields-admin/fields-admin.api.ts` - For `useFieldsAdminCreateField`.
- `src/api/generated/model/createPublicFieldFormDto.api.ts` - Data schema for field creation.

### Files to Implement/Modify
- `src/app/admin/fields/page.tsx` - Add the "Ajouter un terrain" button.
- `src/app/admin/fields/create/page.tsx` - New page for field creation.
- `src/features/fields/components/field-create-form.tsx` - New form component for creation (reusing UI patterns from `FieldDetailsForm`).

### Existing Patterns to Follow
- Form validation with `react-hook-form` and `zod`.
- Reusable sections: `FieldPhotosSection` for images and `FieldSportsSection` for sports selection.
- `AddressAutocomplete` for location data.
- "Soft UI" design with `Card` components and consistent spacing.

## Implementation Details

### API/Endpoints
- **Endpoint:** `POST /fields/admin`
- **Hook:** `useFieldsAdminCreateField`
- **DTO Mapping:**
  - `name`: string
  - `address`: string
  - `shortAddress`: string (optional)
  - `lat`: number (from form `latitude`)
  - `lng`: number (from form `longitude`)
  - `sports`: `CreatePublicFieldFormDtoSportsItem[]`
  - `images`: `Blob[]` (from `FieldPhotosSection`)

### Components
- **FieldCreateForm:**
  - Initialize with empty defaults.
  - Handle image uploads and sports selection.
  - Use `useForm` with `fieldCreateSchema`.
  - On success, use `router.push(`/admin/fields/${newFieldUid}`)`.

## Validation Criteria

### Functional Requirements
- [ ] "Ajouter un terrain" button is visible and navigable on the fields list.
- [ ] The creation form correctly handles all fields: Name, Address (with autocomplete), Sports, and Photos.
- [ ] Submitting the form calls the correct API endpoint with properly mapped data.
- [ ] Successful creation redirects to the field's detail page.
- [ ] Errors from the API are displayed to the user via alerts or toasts.

### Technical Requirements
- [ ] TypeScript compiles without errors.
- [ ] Form validation prevents submission with missing required fields (Name, Address, Sports).
- [ ] Images are correctly handled as `Blob` objects.
- [ ] Design consistency with the field editor page.

### Testing Steps
1. Navigate to `/admin/fields`.
2. Click "Ajouter un terrain".
3. Fill in the name, select an address via autocomplete.
4. Select at least one sport.
5. Add one or more photos.
6. Click "Créer le terrain".
7. Verify redirection to `/admin/fields/[id]` and that the data is correctly displayed.
