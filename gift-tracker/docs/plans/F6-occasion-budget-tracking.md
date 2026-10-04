# F6 — Occasion Budget Tracking

> Implementation plan for the Gift Tracker MVP.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F6 |
| **Section** | Occasion Budget Tracking |
| **Severity** | MAJOR |
| **Markets** | Gift Tracker web application |
| **Status (today)** | MISSING |
| **Estimated effort** | S (≤1 week) |
| **Owner (proposed)** | Development team |
| **Depends on** | F1 — User Authentication, F2 — People Management, F3 — Gift Idea Management, F4 — Occasion Management, F5 — Gift Status Tracking |
| **Unblocks** | F8 — Dashboard |

---

## 1. Problem Statement

Users often want to control how much they spend on gifts for a particular birthday, holiday, anniversary, or other occasion. Gift Tracker needs to compare an occasion's budget with the prices of gifts purchased for that occasion so users can see how much they have spent and how much remains.

## 2. Goals

- Allow each occasion to have its own optional budget.
- Calculate how much has been spent on purchased gifts for an occasion.
- Show how much of the occasion budget remains.
- Update budget totals as gifts are purchased or changed.
- Handle gifts without prices without breaking the budget calculation.

## 3. Non-Goals

- Creating one overall holiday budget across multiple people.
- Automatically limiting or preventing purchases when a budget is exceeded.
- Connecting to bank accounts or credit cards.
- Processing payments or purchases.
- Sharing budgets with other users.
- Providing financial advice.
- Tracking expenses unrelated to gifts.

## 4. Personas & User Stories

- **As a user**, I want to set a budget for an occasion so that I can control how much I plan to spend.
- **As a user**, I want to see how much I have already spent so that I know where I stand.
- **As a user**, I want to see how much money remains in the budget so that I can plan additional gifts.
- **As a user**, I want only purchased gifts to count toward spending so that ideas I have not bought do not affect my budget.
- **As a user**, I want gifts without known prices to be handled clearly so that my budget total is not misleading.

## 5. Functional Requirements

- **FR-1.** The system MUST allow an Occasion to have an optional budget amount.
- **FR-2.** The system MUST display the budget for an Occasion when one has been set.
- **FR-3.** The system MUST calculate the amount spent using Gifts associated with the Occasion and marked `Purchased`, `Wrapped`, or `Given`.
- **FR-4.** Gifts with an `Idea` status MUST NOT count toward the amount spent.
- **FR-5.** Gifts that are not associated with the Occasion MUST NOT count toward that Occasion's budget.
- **FR-6.** The system MUST calculate the remaining budget as the Occasion budget minus the amount spent.
- **FR-7.** The system MUST update the budget calculation when a Gift's status changes in or out of a purchased state.
- **FR-8.** The system MUST update the calculation when a Gift's price changes.
- **FR-9.** The system MUST update the calculation when a Gift is assigned to or removed from an Occasion.
- **FR-10.** A Gift without a price MUST NOT cause the budget calculation to fail.
- **FR-11.** The system SHOULD clearly indicate when one or more purchased Gifts do not have a known price.
- **FR-12.** The system MUST support a remaining amount below zero when spending exceeds the Occasion budget.
- **FR-13.** The system MUST prevent users from viewing or changing budget information belonging to another user's Occasion.
- **FR-14.** The system SHOULD preserve the price paid for a Gift when it is purchased so later retailer price changes do not incorrectly change historical spending.

## 6. Non-Functional Requirements

- **Performance** — Budget totals SHOULD update quickly when Gift prices, statuses, or Occasion associations change.
- **Security** — Budget data MUST require authentication and verify ownership through the Occasion, Person, and User relationships.
- **Privacy & Compliance** — Budget and spending information MUST remain private to the owning account. No additional compliance requirements have been identified for the MVP.
- **Accessibility** — Budget information MUST be communicated with readable text and MUST NOT rely only on visual indicators such as color or progress bars.
- **Scalability** — Calculations SHOULD support the expected number of Gifts and Occasions in normal MVP usage.
- **Reliability** — Missing Gift prices MUST NOT cause calculation errors.
- **Observability** — Calculation or data-loading errors SHOULD be logged for development/debugging.
- **Maintainability** — Budget calculation logic SHOULD be centralized so the same rules are used throughout the application.
- **Internationalization** — The MVP will use the application's selected currency format consistently.
- **Backward compatibility** — N/A because this is a new application.

## 7. Acceptance Criteria

- **AC-1.** *Given* an Occasion has a $100 budget and no purchased Gifts, *when* the Occasion is viewed, *then* the system displays $0 spent and $100 remaining.
- **AC-2.** *Given* an Occasion has a $100 budget and a $30 Gift associated with it, *when* that Gift is marked `Purchased`, *then* the system displays $30 spent and $70 remaining.
- **AC-3.** *Given* a $30 Gift is associated with a $100 Occasion but remains an `Idea`, *when* the budget is calculated, *then* that Gift does not count toward the amount spent.
- **AC-4.** *Given* multiple purchased Gifts are associated with an Occasion, *when* the budget is viewed, *then* their applicable prices are added together.
- **AC-5.** *Given* a purchased Gift is changed to a status indicating it has not yet been purchased, *when* the budget recalculates, *then* that Gift no longer counts toward the amount spent.
- **AC-6.** *Given* a purchased Gift has no known price, *when* the budget is calculated, *then* the calculation still succeeds and the UI indicates that a Gift has an unknown price.
- **AC-7.** *Given* spending exceeds an Occasion's budget, *when* the budget is viewed, *then* the remaining amount is displayed as below zero or otherwise clearly indicates that the user is over budget.
- **AC-8.** *Given* a Gift is moved from one Occasion to another, *when* the change is saved, *then* the budget totals for both Occasions update appropriately.
- **AC-9.** *Given* a purchased Gift's stored purchase price is $30 and the retailer later changes the current price to $40, *when* the Occasion budget is viewed, *then* the spending calculation continues to use the $30 purchase price.
- **AC-10.** *Given* a user attempts to access budget information belonging to another user's Occasion, *when* the request is made, *then* access is denied.

## 8. Data Model

### Occasion

Existing Occasion fields include:

- Occasion ID
- Person ID
- Occasion name/type
- Date
- Budget
- Repeats annually

### Gift

Relevant Gift fields include:

- Gift ID
- Person ID
- Occasion ID
- Current price
- Purchase price
- Status

### Budget Calculation

For an Occasion:

`Amount Spent = Sum of known purchase prices for Gifts associated with the Occasion that have been purchased`

`Amount Remaining = Occasion Budget - Amount Spent`

`Purchase Price` SHOULD capture the applicable Gift price when the Gift first moves to `Purchased`.

A Gift without a known price contributes no numeric amount to the total but SHOULD be identified to the user as having an unknown price.

No separate Budget table is required for the MVP because each Occasion has its own budget.

## 9. API Surface

Existing Occasion and Gift APIs will provide most required data.

Expected interactions may include:

- `GET /api/occasions/:id/budget` — Retrieve calculated budget information for an Occasion.
- `PUT /api/occasions/:id` — Set or update the Occasion budget.
- Existing Gift status and Gift update routes trigger recalculation as needed.

Example budget response:

```text id="5a0ydp"
{
  occasionId: string,
  budget: number,
  spent: number,
  remaining: number,
  unknownPriceCount: number
}
```

The API MUST require authentication and verify ownership.

Budget totals MAY be calculated dynamically rather than permanently stored.

WebSockets are not required.

Special rate limiting is not required for the MVP.

OpenAPI documentation SHOULD be updated if OpenAPI is used by the project.

## 10. UI / UX

### Pages / Components

- Occasion budget display
- Budget amount input
- Amount spent display
- Amount remaining display
- Over-budget state
- Unknown-price notice

### Main Flow

1. The user creates or edits an Occasion and enters a budget.
2. The user assigns Gift ideas to the Occasion.
3. Gifts that remain `Idea` do not affect spending.
4. When the user purchases a Gift, its applicable purchase price begins counting toward the Occasion budget.
5. The application totals purchased Gifts.
6. The Occasion displays the total budget, amount spent, and amount remaining.
7. If a purchased Gift has no known price, the user is informed that the total may be incomplete.

### States

- **No budget:** If no budget has been set, display an option to add one rather than showing misleading totals.
- **No purchased Gifts:** Display $0 spent and the full budget remaining.
- **Loading:** Display a loading state while budget information is being calculated or retrieved.
- **Error:** Display an understandable message if budget information cannot be calculated or loaded.
- **Unknown price:** Clearly indicate that one or more purchased Gifts have no known price.
- **Over budget:** Clearly indicate when spending exceeds the set budget.
- **Offline:** Inform the user when updated budget information cannot be saved or retrieved.

Budget information SHOULD work on mobile and desktop. Amounts MUST be available as readable text even if visual progress indicators are also used.

## 11. AI / ML Considerations

N/A — Occasion Budget Tracking does not use AI or machine learning.

## 12. Integration Points

Occasion Budget Tracking integrates with:

- F1 — User Authentication
- F2 — People Management
- F3 — Gift Idea Management for Gift prices and Occasion assignments
- F4 — Occasion Management for Occasion budgets
- F5 — Gift Status Tracking to determine which Gifts count toward spending
- F8 — Dashboard if budget/progress information is displayed there

No external financial or payment services are required.

## 13. Dependencies & Sequencing

- **Must ship after:** F1, F2, F3, F4, and F5.
- **Must ship before:** F8 — Dashboard if the Dashboard displays budget-related planning progress.
- **Shared infrastructure needed:** Gift, Occasion, Person, and User data models.

Budget Tracking should be implemented after Gift Status Tracking because the calculation depends on knowing whether a Gift has been purchased.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Current retailer price differs from what the user actually paid | H | M | Store a purchase price when a Gift is marked Purchased. |
| Gifts without prices make totals incomplete | M | M | Exclude unknown amounts from the numeric total and clearly notify the user. |
| Incorrect statuses affect budget totals | M | M | Centralize the definition of which statuses count as purchased. |
| Moving Gifts between Occasions creates stale totals | M | M | Calculate totals from current Gift data or recalculate after changes. |
| User accesses another user's budget | L | H | Verify Occasion ownership before returning budget information. |
| Decimal/currency calculations produce rounding errors | M | M | Store monetary values using an appropriate decimal or smallest-currency-unit representation. |

## 15. Rollout Plan

A feature flag is not necessary for the student MVP.

Occasion budget storage should already exist through F4. Purchase-price handling and budget calculation logic should then be implemented, followed by the budget display UI.

The calculation should be tested with known prices, missing prices, and over-budget situations before being used by the Dashboard.

Rollback consists of removing the budget calculation/display while preserving Gift and Occasion records if the feature causes problems during development.

## 16. Test Plan

- **Unit** — Test spent/remaining calculations, missing prices, over-budget totals, and which statuses count as purchased.
- **Integration** — Test budget calculations using stored Occasion, Gift, price, and status data.
- **End-to-end** — Set a budget, add Gifts, purchase Gifts, and verify that spent and remaining totals update.
- **Security** — Verify users cannot access another user's Occasion budgets.
- **Accessibility** — Verify totals and budget states are communicated through text and are keyboard/screen-reader accessible.
- **Performance / load** — N/A for formal load testing because expected MVP usage is small.
- **Manual exploratory** — Test no budget, $0 budget, no purchased Gifts, multiple Gifts, unknown prices, price changes, Gift status changes, Gift reassignment, and over-budget spending.

### Acceptance Criteria Test Mapping

- **AC-1:** Empty-spending calculation test.
- **AC-2:** Single purchased-Gift calculation test.
- **AC-3:** Idea-status exclusion test.
- **AC-4:** Multiple-Gift calculation test.
- **AC-5:** Status-change recalculation test.
- **AC-6:** Missing-price test.
- **AC-7:** Over-budget calculation/UI test.
- **AC-8:** Occasion reassignment integration test.
- **AC-9:** Purchase-price/current-price separation test.
- **AC-10:** Cross-user authorization/security test.

## 17. Documentation & Training

- Explain how Occasion budgets are set.
- Explain which Gift statuses count toward spending.
- Explain that Gifts without known prices cannot contribute a numeric amount to the total.
- Explain the difference between a current retailer price and the stored purchase price.
- Document budget-related API behavior if an API reference is maintained.
- Admin/instructor documentation is N/A because the application has no such roles.

## 18. Open Questions

1. Should the purchase price automatically use the current retrieved price when a Gift is first marked `Purchased`, while still allowing the user to correct it?
2. Should the budget UI use a progress bar in addition to dollar amounts?
3. How should an unknown-price Gift be visually indicated?
4. Should the user receive a warning when a purchase puts them over budget?

## 19. References

- Gift Tracker Project Specification — MVP Features: Occasion Budgets
- Gift Tracker Project Specification — MVP Features: Gift Status
- Gift Tracker Project Specification — Basic User Flow: Prepare for an Occasion
- Gift Tracker Project Specification — Initial Data Models: Gift and Occasion
- Gift Tracker Project Specification — Important Edge Cases
- Related plans: `F3-gift-idea-management.md`, `F4-occasion-management.md`, `F5-gift-status-tracking.md`, `F8-dashboard.md`