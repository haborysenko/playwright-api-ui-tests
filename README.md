# Conduit Test Demo (Bondar Academy)

Demo project for **API** and **UI** tests against [Conduit](https://conduit.bondaracademy.com/) (RealWorld-style app). Uses Playwright for both.

## Where to start

1. **API tests** (`tests/api-tests/`)
   - **CRUD**: Create → GET to verify → Update → GET → Delete → 404.
   - **TDD**: Write failing assertion first, then make it pass (e.g. "GET /api/articles/:slug returns article with slug").
   - **JSON Schema**: Validate responses with AJV; compare **generated schema** (from real response) vs **hand-written schema** (strict contract); toggle `generateSchema: true/false` in config or helpers.
   - **Assertions**: After create, call GET and assert body matches created data (id, slug, title, etc.).

2. **UI tests** (`tests/ui-tests/`)
   - **Simple flow**: e.g. open home → sign in → assert user menu / feed.
   - **Complex flow**: Use API in `before`/`beforeEach` to set data (e.g. create user + article via API), then run UI flow (e.g. open article, add comment, favorite).

## Tech

- **Playwright** (API + UI)
- **AJV** for JSON Schema validation
- **TypeScript**

## Run

```bash
# Install
npm install

# API tests only
npx playwright test --project=api-testing

# UI tests only
npx playwright test --project=ui-testing

# All
npx playwright test
```

## Conduit API (RealWorld)

- Auth: `POST /api/users/login`, `POST /api/users` (register); header `Authorization: Token <jwt>`.
- User: `GET /api/user`, `PUT /api/user`.
- Articles: `GET/POST /api/articles`, `GET/PUT/DELETE /api/articles/:slug`, feed, favorite, comments.
- Profiles: `GET /api/profiles/:username`, follow/unfollow.

Ref: [RealWorld API spec](https://realworld-docs.netlify.app/specifications/backend/endpoints/).
