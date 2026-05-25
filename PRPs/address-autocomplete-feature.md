# Address Autocomplete for Field Editing PRP

## Goal
Implement an address autocomplete feature in the field editing form that fetches suggestions from the geolocalisation API and populates related location fields (short address, latitude, longitude) upon selection.

## Why
To ensure data accuracy and improve admin experience by automating the retrieval of precise geolocalisation data when a field's address is modified.

## What
- Replace the standard address `Input` with an autocomplete component in `FieldDetailsForm`.
- Fetch address suggestions from `/geolocalisation/admin/list/collection` (using `useGeolocalisationGetAddressAutocomplete`).
- Trigger the search only when the input length is 15 characters or more.
- The input must respond to both typing and copy-pasting.
- Show only the `address` field in the suggestion list.
- On suggestion selection:
    - Update the `address` input value.
    - Update the displayed `shortAddress`, `latitude`, and `longitude` fields.
- The `shortAddress`, `latitude`, and `longitude` fields should remain read-only.

## Technical Context

### Files to Reference (read-only)
- `src/api/generated/api/geolocalisation/geolocalisation.api.ts` - Contains the `useGeolocalisationGetAddressAutocomplete` hook.
- `src/api/generated/model/addressAutocompleteResponseData.api.ts` - Defines the structure of an address suggestion.
- `src/api/generated/api/fields-admin/fields-admin.api.ts` - Contains the update mutation `useFieldsAdminUpdate`.

### Files to Implement/Modify
- `src/features/fields/components/field-details-form.tsx` - Modify to include the autocomplete logic and update the form state/UI for location fields.
- `src/features/fields/components/address-autocomplete.tsx` - (New) Create a reusable autocomplete component for address search.

### Existing Patterns to Follow
- Use `react-hook-form` for form management.
- Use `tanstack-query` (via Orval generated hooks) for API calls.
- Follow the existing styling using Tailwind CSS and `shadcn/ui` (or similar primitives).
- Use `zod` for form validation (may need to update the schema to include the read-only fields for UI reactivity).

## Implementation Details

### API/Endpoints
- **GET** `/geolocalisation/admin/list/collection`
    - Query param: `address` (string)
    - Response: `PaginationResponseAddressAutocompleteResponseData` containing `items` of type `AddressAutocompleteResponseData`.

### Components
- **AddressAutocomplete**:
    - An input that shows a dropdown of suggestions.
    - Uses `useGeolocalisationGetAddressAutocomplete` with a debounce (optional but recommended) or just the 15-char threshold.
    - Handles `onSelect` callback to pass the full `AddressAutocompleteResponseData` back to the parent form.

### Form State Update
- Update `FieldDetailsForm` to include `shortAddress`, `latitude`, and `longitude` in the `useForm` default values and state, even if they aren't sent in the final `PUT` request.
- Use `setValue` from `useForm` to update all four fields simultaneously when an address is selected.

## Validation Criteria

### Functional Requirements
- [ ] Suggestions only appear after typing/pasting 15+ characters.
- [ ] Selecting a suggestion updates the address input and the three read-only fields (short address, lat, long).
- [ ] The suggestion list only displays the `address` property.
- [ ] Suggestions are fetched correctly when pasting a long address.

### Technical Requirements
- [ ] No direct `fetch` calls; use the Orval-generated hook.
- [ ] TypeScript types are strictly followed (no `any`).
- [ ] The read-only fields in the UI are correctly synchronized with the selected address.

### Testing Steps
1. Navigate to a field's edit page.
2. Clear the address input.
3. Type a short address (e.g., "10 Rue de") -> No suggestions should appear.
4. Continue typing until 15 characters (e.g., "10 Rue de la Paix, Paris") -> Suggestions should appear.
5. Select a suggestion -> Address should update, and lat/long/short address should populate.
6. Paste an address of 20 characters -> Suggestions should appear immediately.
7. Save the form and verify that the update request is sent.
