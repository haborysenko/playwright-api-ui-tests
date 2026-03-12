# Conduit Test Framework

A production-style Playwright + TypeScript test framework built for [Conduit](https://conduit.bondaracademy.com/) — a RealWorld-spec app with a REST API and a React UI.

This project demonstrates how to architect a maintainable, scalable test suite from scratch: custom abstractions over Playwright's native API, JSON schema validation, data generation, hybrid API+UI test flows, and a CI pipeline.

---

## What this covers

| Area | What is tested |
|---|---|
| **API — happy path** | Full CRUD on articles: create, read, update, delete |
| **API — negative / data-driven** | User registration with invalid usernames → 422 + error message |
| **API — schema validation** | Every response validated against a generated Ajv JSON schema |
| **UI — form validation** | Article form: required field errors and submit behavior |
| **UI — full CRUD** | Create and delete an article end-to-end via the browser |
| **UI — hybrid flow** | Article created via API, then updated via UI — no redundant UI setup |

---

## Key design decisions

**Custom `RequestHandler` (fluent HTTP client)**
All API calls go through a single class that auto-injects auth, logs request/response per test, asserts the expected status code, and resets state between calls. Tests never call `request.get/post` directly.

**API-log-enriched assertions**
`expect` is extended with custom matchers (`shouldBe`, `shouldEqual`, `shouldMatchSchema`). On failure, the error includes the full recent API activity — no digging through logs.

**Schema generation + validation in one flag**
Pass `true` to `shouldMatchSchema` on the first run to auto-generate a schema file with `genson-js`. Flip it to `false` for ongoing validation. No manual schema writing.

**Page Object Model via `PageManager` facade**
UI specs never import page objects directly. One `PageManager(page)` instance per test exposes `navigateTo()`, `auth()`, `article()`. Locators live inside methods — no class-level `Locator` properties.

**Hybrid API+UI tests**
UI tests that need pre-existing data set it up via `RequestHandler` in `beforeEach` — no driving the UI to create prerequisites.

---

## Project structure

```
config/
  test-config.ts                 — URLs and credentials loaded from .env
support/
  api/
    request-objects/             — base JSON payloads (POST_article.json, POST_user.json)
    response-schemas/            — generated Ajv schemas by resource and method
  ui/
    page-objects/                — PageManager + NavigationPage, AuthPage, ArticlePage
tests/
  api-tests/
    utils/                       — RequestHandler, fixtures, logger, custom-expect, schema-validator, data-generator
    helpers/create-token.ts      — standalone login helper → "Token <jwt>"
    articles-list-and-crud.spec.ts
    users-registration-username-validation.spec.ts
  ui-tests/
    utils/                       — fixtures (pm), ui-expect helpers
    article-form-required-fields-validation.spec.ts
    article-create-delete-flow.spec.ts
    article-update-body-field-via-ui-with-api-setup.spec.ts
playwright.config.ts             — projects: api-testing, ui-testing
```

---

## Quick start

```bash
cp .env.example .env   # fill in credentials
npm install
npm run test:all       # run everything
npm run test:report    # open HTML report
```

## Run specific suites

| Command | What runs |
|---|---|
| `npm run api-test` | All API tests |
| `npm run ui-test` | All UI tests (headed) |
| `npm run ui-test:headless` | UI tests headless |
| `npm run ui-test:debug` | UI with Playwright Inspector |
| `npm run ui-test:slow` | UI with 500ms slow-mo |

---

## CI

GitHub Actions runs API and UI tests as separate parallel jobs on every push and pull request.

Required repository secrets (**Settings → Secrets and variables → Actions**):

| Secret | Value |
|---|---|
| `API_BASE_URL` | `https://conduit-api.bondaracademy.com/api` |
| `UI_BASE_URL` | `https://conduit.bondaracademy.com` |
| `USER_EMAIL` | Test account email |
| `USER_PASSWORD` | Test account password |
