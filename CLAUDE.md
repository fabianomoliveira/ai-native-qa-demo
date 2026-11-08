# YardBook — quality engineering conventions

This file is the contract between the team and any AI agent working in this repo.
Generated tests must follow it; reviewers reject tests that don't.

## System under test
- `app/server.js`: booking API (node:http, no deps). `app/index.html`: booking UI.
- `BUGGY=1` injects a known defect (past dates accepted). Use it to prove tests can fail.

## Test pyramid and where things go
| Layer | Folder | Tool | Use it for |
|---|---|---|---|
| Contract | `tests/contract/` | Playwright `request` + Ajv JSON Schema | Response shapes the UI depends on |
| API | `tests/api/` | Playwright `request` | Business rules, validation, status codes, boundaries |
| E2E | `tests/e2e/` | Playwright + page objects in `tests/pages/` | A few critical user journeys only |
| Accessibility | `tests/a11y/` | `@axe-core/playwright`, WCAG 2.1 AA | Every new page or major UI state |

Rule of thumb: push each check to the lowest layer that can prove it. A validation rule
is an API test; E2E only proves the user sees the result.

## Conventions
- Locators: `getByRole` / `getByLabel` first, `getByTestId` only for non-semantic containers. Never CSS/XPath.
- Data: build it with `tests/support/data.ts`. Never hardcode dates; use `isoDate(offset)`.
- Every test is independent: create its own data, no ordering between tests.
- One behavior per test, named as the user-visible outcome ("rejects past date with 422").
- Assert on behavior and contract, not on implementation details or timing. No `waitForTimeout`.
- Cover negative and boundary cases for every rule (e.g. today = allowed, yesterday = rejected).

## Definition of done for any new or AI-generated test
1. `npm run typecheck` passes.
2. `npm test` passes.
3. `npm run test:catch-bugs` passes: the suite still fails against the BUGGY app.
4. If you add a new rule, add a matching defect switch or explain in the PR how the test was seen failing.
