
Switching from Firebase to standard Google OAuth (Identity Services) and fixing local storage logic.

- [ ] **Infrastructure**: Update `.env.local` template for Google Client ID.
- [ ] **Authentication**: Rewrite `AuthContext.tsx` to use `@react-oauth/google`.
    - Implement `loginGoogle` flow.
    - Fetch user profile via Google UserInfo endpoint.
    - Remove all Firebase dependencies.
- [ ] **Storage**: Ensure `Services/storageService.ts` handles uploads safely (using DataURL fallback for client-side demo).
- [ ] **Validation**: Verify build and clean up unused files.
