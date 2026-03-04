# Conduit Test Framework

Playwright + TypeScript test framework targeting [Conduit](https://conduit.bondaracademy.com/) — a RealWorld-style app. Covers API testing (CRUD, negative/data-driven, schema validation) and UI testing (Page Object Model, form validation, hybrid API+UI flows).

---

## Quick start

```bash
npm install
npx playwright test        # run all tests
npx playwright show-report # open HTML report
```

---

## Project structure

```
config/test-config.ts            — URLs and credentials (single source of truth)
request-objects/                 — base JSON payloads (POST_article.json, POST_user.json)
response-schemas/                — Ajv JSON schemas by resource
page-objects/                    — Page Object Model: PageManager + page classes
tests/api-tests/
  utils/                         — RequestHandler, fixtures, logger, custom-expect, schema-validator, data-generator
  helpers/create-token.ts        — standalone login helper → "Token <jwt>"
  smoke-test.spec.ts             — CRUD operations
  negative-tests.spec.ts         — data-driven validation cases
tests/ui-tests/
  article-form-validation.spec.ts       — form validation
  create-update-delete-flow.spec.ts     — full UI CRUD flow
  update-article-via-ui.spec.ts         — hybrid: API setup + UI interaction
playwright.config.ts             — projects: api-testing, api-testing-smoke, ui-testing
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
