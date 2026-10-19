# Instaverse

Full-stack social media platform — share posts with images, comment, and like.

**Frontend** (this repo): React + TypeScript + Vite · Redux Toolkit · Ant Design · Vitest
**Backend**: [Instaverse-api](https://github.com/teemo007/Instaverse-api) — Express + TypeScript + MongoDB

## Features

- Post CRUD with image uploads through a signed direct-to-ImageKit flow (no secrets in the browser)
- Stories, comments, likes
- JWT authentication and unified frontend error handling
- Redux Toolkit state management, React Router navigation

## Getting started

Requires Node.js 20.9+ and the [API](https://github.com/teemo007/Instaverse-api) running.

```bash
npm install
npm run dev
```

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run test` | Run the Vitest suite |
| `npm run lint` | ESLint (zero-warning policy) |

## Project structure

```
src/
├── api/          # API client and shared request helpers
├── app/          # Redux store setup
├── components/   # reusable UI components
└── features/     # Redux Toolkit slices per domain
```
