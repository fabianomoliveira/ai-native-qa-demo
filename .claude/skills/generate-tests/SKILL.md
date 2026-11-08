---
name: generate-tests
description: Generate Playwright tests (API, contract, E2E, a11y) for a feature from its acceptance criteria, following CLAUDE.md conventions, then run and prove they can fail. Use when asked to add tests for a story, ticket or acceptance-criteria file.
---

# Generate tests from acceptance criteria

Input: a path to acceptance criteria (e.g. `docs/acceptance-criteria/cancel-booking.md`), a ticket text, or a feature name.

## Steps
1. **Read the rules.** Read `CLAUDE.md` and the acceptance criteria. List every rule, including
   negative and boundary cases the criteria imply but don't spell out. Write this list in your reply first.
2. **Explore the real behavior.** Use the Playwright MCP server to open `http://localhost:3000`, walk the
   flow, and read the accessibility snapshot. Use it to pick role/label locators. If the app disagrees with
   the criteria, stop and report the mismatch as a possible defect instead of encoding the bug in a test.
3. **Place each check at the lowest layer** (see the pyramid table in `CLAUDE.md`): rules → `tests/api/`,
   response shape → `tests/contract/`, one or two journeys → `tests/e2e/` using page objects, new UI state → `tests/a11y/`.
   Extend existing page objects instead of adding raw locators to specs.
4. **Write the tests** using `tests/support/data.ts` builders. No hardcoded dates, no `waitForTimeout`, no CSS selectors.
5. **Run and fix:** `npm run typecheck`, then `npx playwright test <new files>`. Fix test code, never weaken an assertion to make it pass.
6. **Prove they can fail:** run `npm run test:catch-bugs`. For a new rule with no defect switch, temporarily break that
   rule in `app/server.js`, confirm the new test fails, then revert. Report what you broke and what failed.
7. **Report** in this format:
   - Rules covered → test name and layer
   - Gaps or ambiguities in the acceptance criteria (questions for the PO)
   - Evidence: pass run summary + failing run against the broken app

## Guardrails
- Never edit application code to make a test pass.
- Never delete or skip an existing test.
- If unsure whether behavior is a bug or intended, ask; don't guess.
