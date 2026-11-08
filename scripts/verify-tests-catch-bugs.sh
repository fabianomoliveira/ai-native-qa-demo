#!/usr/bin/env bash
# Trust check for AI-generated (or any) tests: a test that never fails is not a test.
# Runs the suite against the app with a known injected defect (BUGGY=1: past dates
# accepted) and FAILS if the suite still passes. Run it in CI next to the normal suite.
set -uo pipefail

echo "Running suite against BUGGY app (past dates accepted)..."
if BUGGY=1 PORT=3100 npx playwright test --reporter=line > /tmp/buggy-run.log 2>&1; then
  echo "FAIL: the suite passed against a known-broken app. Tests are not catching the defect."
  exit 1
fi

failed=$(grep -c "past date" /tmp/buggy-run.log || true)
echo "OK: suite failed against the broken app ($failed failing checks mention the past-date rule)."
