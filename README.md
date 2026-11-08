# AI-native QA demo

A small, working example of how I set up **AI-native quality engineering** for a team:
a real test pyramid in Playwright + TypeScript, plus Claude Code tooling that any engineer
can run on demand to **generate tests from acceptance criteria** and **review PRs for test gaps**,
with a guardrail that proves AI-generated tests can actually catch bugs.

The system under test is **YardBook**, a tiny lawn-care booking app (API + UI, zero dependencies).

## What's inside

| Piece | Where | Why |
|---|---|---|
| Test pyramid | `tests/contract`, `tests/api`, `tests/e2e`, `tests/a11y` | Contract (JSON Schema), API rules and boundaries, 2 E2E journeys on desktop + mobile emulation, WCAG 2.1 AA with axe |
| Team conventions for humans **and** agents | `CLAUDE.md` | One source of truth: layers, locators, data, definition of done |
| `generate-tests` skill | `.claude/skills/generate-tests/` | Acceptance criteria → explore app via Playwright MCP → tests at the right layer → run → prove they fail on a broken build |
| `qa-review` skill | `.claude/skills/qa-review/` | Reviews a diff for missing coverage, risky areas and flaky patterns |
| Playwright MCP | `.mcp.json` | Lets the agent drive a real browser and read the accessibility tree before writing locators |
| Quality gates | `.github/workflows/ci.yml` | Typecheck + API (fast, blocking) → sharded E2E/a11y → **tests-catch-bugs** trust check |
| AI PR review | `.github/workflows/ai-qa-review.yml` | Runs the same `qa-review` skill on every PR via `claude-code-action`; non-blocking, humans decide |
| Trust check | `scripts/verify-tests-catch-bugs.sh` | Runs the suite against the app with an injected defect (`BUGGY=1`) and fails if the suite still passes |

## Run it

```bash
npm ci
npx playwright install chromium   # first time only
npm test                          # 16 tests: contract, API, E2E (desktop + mobile), a11y
npm run test:catch-bugs           # proves the suite fails against a known-broken build
```

## Live demo (about 5 minutes)

1. Show the gap: `docs/acceptance-criteria/cancel-booking.md` — the UI cancel flow has no tests.
2. In Claude Code, run:
   `Use the generate-tests skill for docs/acceptance-criteria/cancel-booking.md`
3. Watch it: list the rules and the gaps in the criteria, open the app through Playwright MCP,
   extend the page object, add the E2E test, run it, then break the rule and show the test failing.
4. Open a PR and show the `AI QA review` comment next to the blocking quality gates.

## How I keep AI output trustworthy

- **Tests must be able to fail.** `test:catch-bugs` is a blocking CI job; the skill also breaks the rule it tests and shows the failure.
- **Conventions are enforced, not suggested.** `CLAUDE.md` is the same contract for people and agents; `qa-review` flags violations.
- **The agent may not change the app to make a test pass**, may not delete or skip tests, and must report ambiguities instead of encoding a bug.
- **AI review is advisory.** Blocking gates are deterministic (typecheck, tests, trust check); AI comments help humans prioritize.
