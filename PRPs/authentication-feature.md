# Authentication Feature PRP

## Goal
Implement a robust authentication system including a login page, global authentication state management, and automatic token refresh logic using `ky` hooks and `zustand`.

## Why
Secure access is required for the Admin Dashboard. A centralized authentication service ensures that the app can handle session persistence, protected routes, and seamless token renewal without interrupting the user experience.

## What
- **Login Page**: A dedicated page at `/login` with a form to authenticate users.
- **Auth Service (Store)**: A `zustand` store to manage `accessToken`, `refreshToken`, and user metadata.
- **Token Refresh Logic**: Middleware/Interceptors to automatically refresh the `accessToken` when it expires.
- **Protected Routes**: Next.js middleware to prevent unauthorized access to `/admin/*` routes.

### Scope Boundaries
- **Included**:
    - `src/services/auth-store.ts`: Global state for authentication.
    - `src/api/orval.instance.ts` refactor: Add authentication headers and refresh token logic.
    - `src/app/login/page.tsx`: The login route.
    - `src/features/auth`: Login form and local auth logic.
    - `src/middleware.ts`: Route protection.
- **Excluded**:
    - SSO/Social login implementation (unless already in API, but the task focuses on a login page).
    - Password reset flow (outside of immediate scope).

## Technical Context

### Files to Reference (read-only)
- `src/api/orval.instance.ts`: The current API client instance.
- `src/api/generated/api/auth-b2c/auth-b2c.api.ts`: Generated login and refresh endpoints.
- `src/app/admin/layout.tsx`: The layout that should be protected.
- `package.json`: For dependency management.

### Files to Implement/Modify
- `src/services/auth-store.ts`: Create the zustand store for auth state.
- `src/api/orval.instance.ts`: Modify to include `ky` hooks for auth.
- `src/app/login/page.tsx`: Create the login page.
- `src/features/auth/login-form.tsx`: Create the login form component.
- `src/middleware.ts`: Implement route protection and redirect logic.

### Existing Patterns to Follow
- Use **Tailwind CSS 4** for styling.
- Use **shadcn/ui** components for the form (input, button, card).
- Follow the **Feature-First** architecture described in `ARCHITECTURE.md`.
- Use the generated Orval hooks (`useAuthB2CLogin`, `useAuthB2CRefreshToken`).

## Implementation Details

### Dependencies to Add
- `zustand`: Global state management.
- `js-cookie`: Cookie management for token persistence.
- `react-hook-form`: Form handling.
- `zod`: Schema validation.
- `@hookform/resolvers`: Integration between react-hook-form and zod.

### Components
- **LoginForm**: A card-based form with email and password fields, including validation and error states.

### Auth Service Logic
- `login(email, password)`: Calls the API, stores tokens in the zustand store and cookies.
- `logout()`: Clears store and cookies, redirects to `/login`.
- `refresh()`: Calls the refresh endpoint, updates tokens.

### API Interceptor (ky hooks)
- `beforeRequest`: If a token exists in the store, add `Authorization: Bearer <token>` to the headers.
- `afterResponse`: If a 401 error occurs and a refresh token is available, attempt to refresh and retry the original request once.

## Validation Criteria

### Functional Requirements
- [ ] Users can log in with valid credentials and are redirected to `/admin/dashboard`.
- [ ] Unauthorized users attempting to access `/admin/*` are redirected to `/login`.
- [ ] If the `accessToken` expires, it is automatically refreshed using the `refreshToken` without a page reload.
- [ ] Logging out clears the session and redirects to `/login`.

### Technical Requirements
- [ ] TypeScript compiles without errors.
- [ ] No tokens are exposed in the browser console.
- [ ] Middleware correctly handles edge cases (e.g., trying to access login while already authenticated).

### Testing Steps
1. Navigate to `/admin/dashboard` while logged out; verify redirect to `/login`.
2. Enter invalid credentials; verify error message.
3. Enter valid credentials; verify redirect to dashboard and token storage in cookies/store.
4. Manually expire the `accessToken` (or wait for it to expire) and perform an action; verify it refreshes automatically.
5. Click logout; verify redirect to `/login` and session clearing.
