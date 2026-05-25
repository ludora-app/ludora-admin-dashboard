# Field Sports Editing PRP

## Goal
Enable administrators to add, remove, and modify the practiced sports (tags) on the field editing page.

## Why
Currently, the sports practiced on a field are displayed but cannot be modified through the admin dashboard. Admins need to be able to update this information to keep the field data accurate.

## What
- Add sport selection/modification capability to the Field Detail page (`/admin/fields/[id]`).
- Use the existing `UpdateFieldAdminFormDtoSportsItem` enum for available sports.
- Implementation should allow toggling sports as "tags" (badges).
- Ensure the updated sports list is correctly sent to the backend via the `useFieldsAdminUpdate` hook.

## Technical Context

### Files to Reference (read-only)
- `src/features/fields/components/field-filters.tsx` - Reference for the toggleable badge UI pattern.
- `src/api/generated/model/updateFieldAdminFormDtoSportsItem.api.ts` - Definition of the sports enum.
- `src/api/generated/api/fields-admin/fields-admin.api.ts` - The update hook definition.

### Files to Implement/Modify
- `src/features/fields/components/field-details-form.tsx` - Manage `selectedSports` state and include it in the `mutate` call.
- `src/features/fields/components/field-sports-section.tsx` - Convert to an interactive component that accepts `selectedSports` and `onChange`.

### Existing Patterns to Follow
- Use the `Badge` component with sport-specific variants (already defined in `badge.tsx`).
- Follow the toggle logic found in `FieldFilters.tsx` for selecting/deselecting sports.
- Use `zod` for form validation if needed (though sports is an array of enums).

## Implementation Details

### API/Endpoints
- Endpoint: `PUT /fields/admin/{uid}`
- Hook: `useFieldsAdminUpdate`
- Data Structure: `sports: UpdateFieldAdminFormDtoSportsItem[]`

### Components
- **FieldDetailsForm**: 
    - Initialize `selectedSports` state with `field.sports`.
    - Update `onSubmit` to include `selectedSports` in the `data` object sent to `mutate`.
- **FieldSportsSection**:
    - Add `selectedSports: UpdateFieldAdminFormDtoSportsItem[]` and `onSportsChange: (sports: UpdateFieldAdminFormDtoSportsItem[]) => void` to props.
    - Render all available sports from `UpdateFieldAdminFormDtoSportsItem`.
    - Highlight selected sports using their specific variants.
    - Use `secondary` or `outline` variant for unselected sports.
    - Implement `toggleSport` logic.

## Validation Criteria

### Functional Requirements
- [ ] All available sports from the enum are displayed in the "Sports pratiqués" section.
- [ ] Clicking a sport badge toggles its selection state.
- [ ] Selected sports are visually distinct from unselected ones.
- [ ] Saving the form sends the correct array of sport enums to the backend.
- [ ] After a successful save, the UI reflects the updated sports.

### Technical Requirements
- [ ] TypeScript compiles without errors.
- [ ] No regressions in image management or other form fields.
- [ ] The `UpdateFieldAdminFormDtoSportsItem` type is used correctly.

### Testing Steps
1. Navigate to a field detail page (`/admin/fields/[id]`).
2. In the "Sports pratiqués" section, click on an unselected sport to add it.
3. Click on a selected sport to remove it.
4. Click "Enregistrer les modifications".
5. Verify the "Terrain mis à jour avec succès !" alert appears.
6. Refresh the page and verify the changes persisted.
