# Conduit test framework

Playwright + TypeScript framework targeting the Conduit RealWorld app at `https://conduit.bondaracademy.com`.

## Naming conventions

| What | Convention |
|---|---|
| Files and folders | kebab-case |
| Classes and types | PascalCase |
| Functions, variables, methods | camelCase |
| JSON schema files | `METHOD_resource_schema.json` |
| JSON request object files | `METHOD_resource.json` |

## Hard rules

- **Never bypass `RequestHandler`.** All API calls go through it — no `request.get/post/...` directly in specs.
- **Never import `test` from `@playwright/test` in API specs.** Import from `./utils/fixtures`.
- **Never import `expect` from `@playwright/test` in API specs.** Import from `./utils/custom-expect`.
- **Never hardcode credentials or base URLs.** Use `config/test-config.ts`.
- **Never mutate imported request objects directly.** Use `structuredClone` or a data generator.
- **Never assign the result of `deleteRequest()`.** It returns nothing (204, no body).
- **Never add assertions in page objects.** Assertions stay in specs only.

## API tests

- Schema-validate every GET/POST/PUT response with `shouldMatchSchema` before field-level assertions.
- Auth token is injected automatically — only use `.headers({ Authorization: ... })` for a different token, `.clearAuth()` for unauthenticated requests.
- Slug may not change after PUT — always use the slug from the PUT response for subsequent calls.
- Article title must be unique — always use a data generator or `Date.now()`.

## UI tests

- Specs use `PageManager` only — never import page objects directly in specs.
- Locators are defined inside methods (not as class properties).
- Locator preference: `getByRole` → `getByLabel` → `getByText` → `getByTestId` → CSS (last resort).
- For tests needing pre-existing data, set it up via `RequestHandler` in `beforeEach`/`beforeAll` — do not drive the UI to create prerequisites.

## Schema workflow

1. Run test with `createSchemaFlag: true` → schema generated in `response-schemas/`.
2. Optionally tighten by hand (`"format": "email"`, etc.).
3. Set flag back to `false` for ongoing validation.
