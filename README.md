# Conduit Test Framework

Playwright + TypeScript test framework targeting [Conduit](https://conduit.bondaracademy.com/) — a RealWorld-style app. Covers API testing (CRUD, negative/data-driven, schema validation) and UI testing (Page Object Model, form validation, hybrid API+UI flows).

---

## Quick start

```bash
cp .env.example .env   # fill in your credentials
npm install
npx playwright test        # run all tests
npx playwright show-report # open HTML report
```

## CI

Tests run automatically on every push and pull request via GitHub Actions (`.github/workflows/playwright.yml`). API and UI tests run as separate parallel jobs.

Add these secrets to your GitHub repo under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `API_BASE_URL` | `https://conduit-api.bondaracademy.com/api` |
| `UI_BASE_URL` | `https://conduit.bondaracademy.com` |
| `USER_EMAIL` | Test account email |
| `USER_PASSWORD` | Test account password |

---

## Project structure

```
config/
  test-config.ts                 — URLs and credentials loaded from .env
.env.example                     — required environment variables (copy to .env and fill in)
support/
  ui/
    page-objects/                — Page Object Model: PageManager + page classes
  api/
    request-objects/             — base JSON payloads (POST_article.json, POST_user.json)
    response-schemas/            — Ajv JSON schemas by resource
tests/
  api-tests/
    utils/                       — RequestHandler, fixtures, logger, custom-expect, schema-validator, data-generator
    helpers/create-token.ts      — standalone login helper → "Token <jwt>"
    article-crud.spec.ts         — article CRUD
    user-registration-negative.spec.ts — registration negative cases (invalid username → 422)
  ui-tests/
    utils/
      fixtures.ts                — pm fixture (PageManager)
      ui-expect.ts               — UI assertion helpers
    article-form-validation.spec.ts       — form validation (required fields)
    article-crud-flow.spec.ts            — full CRUD via UI
    article-update-with-api-setup.spec.ts — update via UI (article created via API)
playwright.config.ts             — projects: api-testing, ui-testing
```

---

## Running tests

| Command | What runs |
|---|---|
| `npm run api-test` | All API tests |
| `npm run api-test:smoke` | API smoke only |
| `npm run ui-test` | All UI tests (headed) |
| `npm run ui-test:headless` | UI tests headless |
| `npm run ui-test:debug` | UI with Playwright Inspector |
| `npm run test:all` | Everything |

---

## Framework overview

### RequestHandler — fluent HTTP client

```ts
const articles = await api.path('/articles').params({ limit: 10 }).getRequest(200)
const created  = await api.path('/articles').body(payload).postRequest(201)
await api.path(`/articles/${slug}`).deleteRequest(204)
```

Each call auto-injects auth, logs request/response, asserts status, and wraps in `test.step()`.

### Custom assertions

Import `expect` from `./utils/custom-expect`. All matchers attach the last API call to failure messages.

```ts
await expect(response).shouldMatchSchema('articles', 'GET_article_schema', false)
expect(response.title).shouldBe('expected value')
expect(response.count).shouldBeLessThanOrEqual(10)
```

### Schema validation

Run once with `true` to generate a schema file, then switch back to `false`:
```ts
await expect(response).shouldMatchSchema('articles', 'GET_article_schema', true)  // generates
await expect(response).shouldMatchSchema('articles', 'GET_article_schema', false) // validates
```

### Data generators

```ts
const article = getNewRandomArticle() // cloned from POST_article.json + Faker fields
const user    = getNewRandomUser()    // cloned from POST_user.json + Faker fields
```

### Page Object Model

```
PageManager(page) → .navigateTo()  → NavigationPage
                  → .auth()        → AuthPage
                  → .article()     → ArticlePage
```

All UI specs use `PageManager` only — never import page objects directly.

---

## Naming conventions

| What | Convention |
|---|---|
| Files and folders | kebab-case |
| Classes and types | PascalCase |
| Functions, variables, methods | camelCase |
| JSON schema files | `METHOD_resource_schema.json` |
