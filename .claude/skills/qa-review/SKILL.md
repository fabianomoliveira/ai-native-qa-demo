---
name: qa-review
description: Review a code change or pull request from a quality engineering angle - missing tests, risky areas, flaky patterns, and convention violations. Use for "review this PR for testing", "what tests are missing", or in the CI review workflow.
---

# QA review of a change

## Steps
1. Get the diff (`git diff origin/main...HEAD`, or the PR diff provided).
2. For each changed behavior, find the tests that cover it. Classify: covered / partially covered / not covered.
3. Check new or changed tests against `CLAUDE.md`:
   - CSS/XPath locators, `waitForTimeout`, hardcoded dates, shared state between tests
   - assertions that can't fail (e.g. only checking status 200 on a validation path)
   - checks placed at a higher layer than needed (E2E for a pure API rule)
4. Rate risk for the change: high (money, auth, data loss, booking state), medium, low.
5. Output, short and actionable:

```
## QA review
Risk: <high|medium|low> — <one line why>

### Missing coverage
- <behavior> → suggested test: <name> in <layer/folder>

### Test quality issues
- <file:line> <issue> → <fix>

### Looks good
- <what is well covered>
```

Do not rewrite code in the review; suggest. Keep it under 30 lines. If nothing is missing, say so in one line.
