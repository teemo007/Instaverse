# Kapsule

A time capsule for your moments. Kapsule (formerly Instaverse) is a
React + TypeScript + Vite frontend for a social platform with password and
Google sign-in, cookie-backed server sessions, comments, likes, and direct
ImageKit uploads. The backend is
[Instaverse-api](https://github.com/teemo007/Instaverse-api).

## Authentication boundary

The browser calls relative `/api` URLs. In local development Vite proxies those
requests to the API. In production the Render Static Site rewrites them to the
separate Render API service, so the browser still sees one origin.

- The session ID is a host-only `HttpOnly` cookie; JavaScript cannot read it.
- The CSRF token exists only in Redux memory and is attached to unsafe requests.
- No JWT, session token, Google credential, access token, or refresh token is
  stored in localStorage/sessionStorage.
- Refresh runs `GET /api/user/session` before rendering the application shell.
- Sign out calls the server before clearing local auth state.

The cookie has no `Expires` or `Max-Age`, so it is browser-session scoped.
Browsers configured to restore the previous session may restore session cookies
after restart; explicit sign-out always revokes the server session.

## Local development

Requires Node.js 20.9+, the API on `http://localhost:5001`, and a Google Web
OAuth client ID if Google sign-in is enabled.

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local` should contain:

```text
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=<Google Web client ID>
```

`VITE_GOOGLE_CLIENT_ID` is a public browser identifier, not a secret. The API
must receive the same value as `GOOGLE_CLIENT_ID`. The client intentionally uses
the relative `/api` boundary; do not replace it with the API's absolute Render
URL.

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite with the local `/api` proxy |
| `npm test` | Run Vitest |
| `npm run typecheck` | Check TypeScript |
| `npm run lint` | Run ESLint with zero warnings |
| `npm run build` | Type-check and build `dist/` |

## Google Cloud configuration

Create an OAuth 2.0 **Web application** client in Google Cloud. Under Authorized
JavaScript origins add exactly:

```text
http://localhost:5173
https://<frontend-static-site>.onrender.com
```

Use origins only—no paths, `/api`, callback URLs, or API service origin. This
implementation loads only `https://accounts.google.com/gsi/client`, renders the
button explicitly, and does not enable One Tap or automatic sign-in.

## Render Static Site

Create or update the frontend as a Render Static Site:

```text
Build Command: npm ci && npm run build
Publish Directory: dist
Environment: VITE_API_URL=/api
Environment: VITE_GOOGLE_CLIENT_ID=<same Google Web client ID as the API>
```

Add these rewrites in this exact order:

| Order | Source | Destination | Action |
|---:|---|---|---|
| 1 | `/api/*` | `https://<api-service>.onrender.com/*` | Rewrite |
| 2 | `/*` | `/index.html` | Rewrite |

The API rewrite must be above the SPA fallback. Otherwise `/api` requests return
`index.html`, session restoration fails, and JSON parsing errors appear in the
browser.

Add static response headers in Render:

| Path | Header | Value |
|---|---|---|
| `/*` | `X-Content-Type-Options` | `nosniff` |
| `/*` | `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `/*` | `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

If you add a Content Security Policy, test Google GIS and ImageKit before
enforcement. At minimum it must allow the Google GIS script/frame and the
configured ImageKit upload/delivery origins, plus Google Fonts
(`fonts.googleapis.com` styles and `fonts.gstatic.com` fonts) for the
wordmark; an untested restrictive policy can break sign-in or uploads.

## Release check

1. Deploy the API and frontend changes close together; their auth response
   contracts change as a pair.
2. Test password sign-up/sign-in and a new Google-only account.
3. Test Google linking for an existing password account, including a wrong
   password followed by the correct password.
4. Refresh and confirm `/api/user/session` returns JSON and restores the user.
5. In DevTools, confirm the cookie belongs to the frontend host and has
   `HttpOnly`, `Secure`, `SameSite=Lax`, no `Domain`, no `Expires`, and no
   `Max-Age`.
6. Confirm unsafe requests include `X-CSRF-Token` and that sign-out prevents
   subsequent restoration.

For rollback, first restore the last JWT-capable API release while its
`JWT_SECRET` is still configured, then immediately restore the matching legacy
frontend release. Remove `JWT_SECRET` only after the new rollout and rollback
window are complete.

## Project structure

```text
src/
├── api/          # same-origin Axios client and normalized errors
├── app/          # Redux store, startup restore, and router
├── components/   # shared layout components
└── features/     # auth, stories, and comments feature slices
```
