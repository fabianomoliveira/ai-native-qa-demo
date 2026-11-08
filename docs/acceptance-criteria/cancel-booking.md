# Story: Customer cancels a booking

As a customer, I want to cancel a confirmed booking so that I am not charged for a visit I no longer need.

## Acceptance criteria
1. After booking, the confirmation card shows a **Cancel booking** button.
2. Clicking it changes the card to **Booking cancelled** and the button disappears.
3. A cancelled booking cannot be cancelled again (API returns 409).
4. Cancelling an unknown booking returns 404.

> Demo input for the `generate-tests` skill. API criteria 3–4 are already covered in
> `tests/api/`; the UI criteria 1–2 are intentionally **not** covered yet, so the skill has a real gap to fill.
