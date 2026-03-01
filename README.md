# Conduit Test Framework

A custom **API and UI test framework** built with Playwright and TypeScript, targeting [Conduit](https://conduit.bondaracademy.com/) (a RealWorld-style app). The framework wraps Playwright's raw API into a fluent, reusable layer with built-in logging, schema validation, and custom assertions.

---

## Table of contents

- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Configuration](#configuration)
- [Running tests](#running-tests)
- [Framework overview](#framework-overview)
- [How to add an API test](#how-to-add-an-api-test)
- [How to add a UI test](#how-to-add-a-ui-test)
- [Schema validation](#schema-validation)
- [Custom assertions](#custom-assertions)
- [Conduit API reference](#conduit-api-reference)

---

## Quick start

```bash
# Install dependencies
npm install

# Copy env template and fill in credentials
cp .env.example .env     # or create .env manually (see Configuration)

# Run all tests
npx playwright test

# Open the HTML report
npx playwright show-report
```

---

## Project structure

```
.
├── config/
│   └── test-config.ts            # Central config: URLs, credentials by environment
│
├── request-objects/
│   ├── POST-article.json         # Base payload for article creation
│   └── POST-user.json            # Base payload for user registration
│
├── response-schemas/
│   ├── articles/                 # JSON schemas for article responses
│   └── users/                   # JSON schemas for user responses
│
├── tests/
│   ├── api-tests/
│   │   ├── utils/
│   │   │   ├── request-handler.ts   # Fluent HTTP client (core of the API layer)
│   │   │   ├── fixtures.ts          # Playwright fixtures: api, config, authToken, attachApiLogs
│   │   │   ├── logger.ts            # APILogger: captures request/response per test
│   │   │   ├── custom-expect.ts     # Custom matchers: shouldBe, shouldEqual, shouldMatchSchema
│   │   │   ├── schema-validator.ts  # Ajv-based schema validator + genson-js generator
│   │   │   └── data-generator.ts   # Faker-powered payload generators
│   │   ├── helpers/
│   │   │   └── createToken.ts      # Standalone login helper → returns "Token <jwt>"
│   │   ├── smokeTest.spec.ts        # Smoke: GET articles, full CRUD article flow
│   │   └── negativeTests.spec.ts   # Data-driven negative cases (username validation)
│   │
│   └── ui-tests/
│       └── smokeUItest.spec.ts     # UI smoke: sign in + navigate
│
├── playwright.config.ts            # Projects: api-testing, api-testing-smoke, ui-testing
└── .env                            # Credentials (not committed)
```

---

## Configuration

Tests read credentials and URLs from `config/test-config.ts`, which reads env vars.

**Create a `.env` file in the project root:**

```env
# Default environment is "dev" — set TEST_ENV to switch
TEST_ENV=dev

DEV_USERNAME=your@email.com
DEV_PASSWORD=yourpassword

# QA environment (TEST_ENV=qa)
QA_USERNAME=qa@email.com
QA_PASSWORD=qapassword

# Production (TEST_ENV=prod)
PROD_USERNAME=prod@email.com
PROD_PASSWORD=prodpassword
```

**Switch environments:**
```bash
TEST_ENV=qa npx playwright test
```

The config object is injected into specs via the `config` fixture — no need to import `test-config.ts` in test files.

---

## Running tests

```bash
# All tests
npx playwright test

# API tests only
npx playwright test --project=api-testing

# Smoke tests only (files matching "smoke*")
npx playwright test --project=api-testing-smoke

# UI tests only
npx playwright test --project=ui-testing

# Single spec file
npx playwright test tests/api-tests/smokeTest.spec.ts

# Headed mode (watch the browser for UI tests)
npx playwright test --project=ui-testing --headed

# Open HTML report
npx playwright show-report
```

| Mode | Workers | Retries |
|------|---------|---------|
| Local | 4 | 0 |
| CI (`CI=true`) | 1 | 2 |

---

## Framework overview

### RequestHandler — fluent HTTP client

The core of the API layer. Build a request by chaining methods, then call one of the HTTP methods to send it.

```ts
// GET with query params
const articles = await api
  .path('/articles')
  .params({ limit: 10, offset: 0 })
  .getRequest(200)

// POST with body
const created = await api
  .path('/articles')
  .body(articlePayload)
  .postRequest(201)

// PUT, DELETE
await api.path(`/articles/${slug}`).body(update).putRequest(200)
await api.path(`/articles/${slug}`).deleteRequest(204)
```

Every method:
1. Builds the URL (`defaultBaseUrl` + `path` + query string)
2. Injects the auth token automatically (from the worker fixture)
3. Logs the request and response
4. Asserts the status code — throws with request/response detail on mismatch
5. Wraps in `test.step()` for the HTML report
6. Resets internal state (`cleanupFields`) so the same instance can be reused

**`clearAuth()`** — use before a call to skip the default auth token (for testing unauthenticated access):
```ts
await api.path('/articles').clearAuth().getRequest(401)
```

---

### Fixtures

All fixtures are in `tests/api-tests/utils/fixtures.ts`. Import `test` from there instead of `@playwright/test`.

| Fixture | Scope | What it provides |
|---------|-------|-----------------|
| `authToken` | worker | JWT token (logs in once per worker via `createToken`) |
| `api` | test | `RequestHandler` instance wired with logger + default auth |
| `config` | test | The central config object (URLs, credentials) |
| `attachApiLogs` | test (auto) | Attaches request/response log to every test in the HTML report |

```ts
import { test } from './utils/fixtures'
import { expect } from './utils/custom-expect'

test('example', async ({ api, config }) => {
  const response = await api.path('/articles').getRequest(200)
})
```

---

### APILogger

Each test gets its own `APILogger` (created in the `api` fixture). It records every request and response. On a status code mismatch the error message includes the full log so you see exactly what was sent and received — without opening the report.

The `attachApiLogs` auto fixture also attaches the same log to the HTML report after every test.

**Manual attach (optional):**
```ts
test.info().attach('API request/response', {
  body: api.getRecentLogs(),
  contentType: 'text/plain',
})
```

---

### Data generators

`tests/api-tests/utils/data-generator.ts` generates unique payloads using Faker:

```ts
import { getNewRandomArticle, getNewRandomUser } from './utils/data-generator'

const article = getNewRandomArticle()  // cloned from POST-article.json, Faker fields
const user    = getNewRandomUser()     // cloned from POST-user.json, Faker fields
```

Both functions use `structuredClone` so the base `request-objects/` files are never mutated.

---

## How to add an API test

1. Create a new spec file in `tests/api-tests/` (e.g. `profileTests.spec.ts`).
2. Import `test` from `./utils/fixtures` and `expect` from `./utils/custom-expect`.
3. Use the `api` fixture — chain `.path()`, `.body()`, `.params()`, then call the HTTP method.
4. Use custom matchers for assertions.

```ts
import { test } from './utils/fixtures'
import { expect } from './utils/custom-expect'

test('should get a user profile', async ({ api }) => {
  const response = await api
    .path('/profiles/testuser')
    .getRequest(200)

  expect(response.profile.username).shouldBe('testuser')
  await expect(response).shouldMatchSchema('profiles', 'GET_profile_schema', false)
})
```

**To generate a schema** for a new endpoint, run the test once with the last arg as `true`:

```ts
await expect(response).shouldMatchSchema('profiles', 'GET_profile_schema', true)
```

This writes `response-schemas/profiles/GET_profile_schema.json`. Switch back to `false` for ongoing validation.

---

## How to add a UI test

1. Create (or edit) a spec in `tests/ui-tests/`.
2. For complex flows, use the API layer in `test.beforeEach` to set up state, then run the UI steps.
3. Page objects will live in `tests/ui-tests/pages/` — one class per page, each method represents a user action.

```ts
import { test, expect } from '@playwright/test'

test('user can create an article', async ({ page }) => {
  // API setup: login, create prerequisite data
  // UI flow: navigate, fill form, submit, assert
  await page.goto('/')
  // ...
})
```

> **Coming next:** Page Object Model — `tests/ui-tests/pages/` directory with page classes.

---

## Schema validation

Schemas are JSON files in `response-schemas/<resource>/`. They are validated with **Ajv** and support **ajv-formats** for `"format": "email"`, `"format": "uri"`, `"format": "date-time"`, etc.

**Validate in a test:**
```ts
await expect(response).shouldMatchSchema('articles', 'GET_article_schema', false)
```

**Generate from a live response** (run once, then revert to `false`):
```ts
await expect(response).shouldMatchSchema('articles', 'GET_article_schema', true)
```

**Tighten a generated schema manually** — open the JSON file and add `"format"` keywords:
```json
{
  "type": "object",
  "properties": {
    "email": { "type": "string", "format": "email" },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

---

## Custom assertions

Import `expect` from `./utils/custom-expect`. All custom matchers include **Recent API Activity** (last request + response) in the failure message.

| Matcher | Equivalent |
|---------|------------|
| `expect(val).shouldBe(x)` | `toBe` (strict equality) |
| `expect(val).shouldEqual(x)` | `toEqual` (deep equality) |
| `expect(val).shouldBeLessThanOrEqual(n)` | `toBeLessThanOrEqual` |
| `await expect(val).shouldMatchSchema(dir, file, flag)` | Ajv schema validation |

---

## Conduit API reference

Base URL: `https://conduit-api.bondaracademy.com/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users` | — | Register user |
| POST | `/users/login` | — | Login → returns JWT |
| GET | `/user` | ✓ | Current user |
| PUT | `/user` | ✓ | Update current user |
| GET | `/articles` | — | List articles (`limit`, `offset`, `tag`, `author`) |
| POST | `/articles` | ✓ | Create article |
| GET | `/articles/:slug` | — | Get article by slug |
| PUT | `/articles/:slug` | ✓ | Update article |
| DELETE | `/articles/:slug` | ✓ | Delete article (204, no body) |
| GET | `/profiles/:username` | — | Get profile |
| POST | `/profiles/:username/follow` | ✓ | Follow user |
| GET | `/tags` | — | Get tags |

**Auth header:** `Authorization: Token <jwt>`

Full spec: [RealWorld API documentation](https://realworld-docs.netlify.app/specifications/backend/endpoints/)
