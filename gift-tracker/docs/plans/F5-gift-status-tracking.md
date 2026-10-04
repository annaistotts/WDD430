# F5 — Gift Status Tracking

> Implementation plan for the Gift Tracker MVP.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F5 |
| **Section** | Gift Status Tracking |
| **Severity** | MAJOR |
| **Markets** | Gift Tracker web application |
| **Status (today)** | MISSING |
| **Estimated effort** | S (≤1 week) |
| **Owner (proposed)** | Development team |
| **Depends on** | F1 — User Authentication, F2 — People Management, F3 — Gift Idea Management |
| **Unblocks** | F6, F7, F8 |

---

## 1. Problem Statement

Saving a gift idea is only the first step in planning a gift. Users need to track whether a gift is still an idea, has been purchased, has been wrapped, or has already been given so they can quickly understand their gift-planning progress.

## 2. Goals

- Give every gift a clear status.
- Allow users to update a gift as it moves through the gift-planning process.
- Clearly display the current status of each gift.
- Make Purchased status available to Occasion Budget Tracking.
- Make Given status available to Gift History.

## 3. Non-Goals

- Automatically purchasing gifts.
- Automatically changing a gift's status based on retailer activity.
- Tracking shipping or delivery status.
- Sending notifications when a status should change.
- Creating additional custom gift statuses.
- Implementing budget calculations or the Gift History interface within this feature.

## 4. Personas & User Stories

- **As a user**, I want a new gift to start as an Idea so that I know I have not purchased it yet.
- **As a user**, I want to mark a gift as Purchased so that I know I already bought it.
- **As a user**, I want to mark a gift as Wrapped so that I know it is ready to give.
- **As a user**, I want to mark a gift as Given so that I know the gift-planning process is complete.
- **As a user**, I want to see a gift's current status so that I can quickly understand my progress.

## 5. Functional Requirements

- **FR-1.** Every Gift MUST have one current status.
- **FR-2.** The supported statuses MUST be `Idea`, `Purchased`, `Wrapped`, and `Given`.
- **FR-3.** A newly created Gift MUST default to `Idea`.
- **FR-4.** The system MUST allow an authenticated user to update the status of a Gift they own.
- **FR-5.** The current Gift status MUST be displayed on the user's Gift List.
- **FR-6.** A Gift marked `Purchased` MUST be available to F6 — Occasion Budget Tracking when it is associated with an Occasion.
- **FR-7.** A Gift marked `Given` MUST be available to F7 — Gift History.
- **FR-8.** When a Gift is marked `Given`, the system MUST store the date it was given.
- **FR-9.** The system MUST prevent a user from changing the status of a Gift belonging to another user's Person record.
- **FR-10.** The system SHOULD allow a user to correct a status if it was selected accidentally.
- **FR-11.** Changing a Gift's status MUST NOT remove its name, product information, notes, price, Person association, or Occasion association.

## 6. Non-Functional Requirements

- **Performance** — Status changes SHOULD appear quickly during normal application use.
- **Security** — Status updates MUST require authentication and verify Gift ownership through the associated Person and User.
- **Privacy & Compliance** — Gift status information MUST remain private to the account that owns the Gift.
- **Accessibility** — Status controls MUST have clear labels and SHOULD be usable with a keyboard and assistive technology.
- **Scalability** — The status system SHOULD support all Gifts created within normal MVP usage without additional infrastructure.
- **Reliability** — Status updates MUST either save successfully or leave the previous status unchanged and show an error.
- **Observability** — Failed status updates SHOULD be logged for development/debugging.
- **Maintainability** — Gift statuses SHOULD use a consistent set of allowed values rather than arbitrary text.
- **Internationalization** — N/A for the initial MVP; the application is currently planned for English.
- **Backward compatibility** — N/A because this is a new application.

## 7. Acceptance Criteria

- **AC-1.** *Given* a user creates a new Gift, *when* the Gift is saved, *then* its status defaults to `Idea`.
- **AC-2.** *Given* a Gift currently has an `Idea` status, *when* the user changes it to `Purchased`, *then* the new status is saved and displayed.
- **AC-3.** *Given* a Gift has been purchased, *when* the user changes its status to `Wrapped`, *then* `Wrapped` becomes the current displayed status.
- **AC-4.** *Given* a Gift has been given to its recipient, *when* the user changes its status to `Given`, *then* the status and date given are stored.
- **AC-5.** *Given* a Gift is marked `Purchased` and associated with an Occasion, *when* budget information is calculated, *then* the Gift can be included in that Occasion's spending.
- **AC-6.** *Given* a Gift is marked `Given`, *when* Gift History is viewed, *then* the Gift can appear in that Person's history.
- **AC-7.** *Given* a user accidentally selects the wrong status, *when* they change the Gift to another valid status, *then* the corrected status is saved.
- **AC-8.** *Given* a user attempts to update a Gift belonging to another account, *when* the request is made, *then* access is denied.
- **AC-9.** *Given* a status update fails, *when* the user returns to the Gift, *then* the previously saved status remains intact and the user receives an error message.

## 8. Data Model

### Gift Status

The existing Gift model will contain:

- Status
- Date given

Allowed Status values:

- `Idea`
- `Purchased`
- `Wrapped`
- `Given`

### Constraints

- Status MUST NOT be null.
- New Gifts MUST default to `Idea`.
- Status MUST be one of the four allowed values.
- Date given MAY be null when the Gift has not been given.
- When a Gift is changed to `Given`, Date given MUST be recorded.
- If a Gift is changed from `Given` to another status, Date given SHOULD be cleared because the Gift is no longer considered given.

No separate Gift Status table is required for the MVP.

No backfill is required because this is a new application.

## 9. API Surface

The existing Gift API will be extended to support status updates.

Expected interaction:

- `PATCH /api/gifts/:id/status` — Update the status of an existing Gift.

Example request:

```text id="80usx5"
{
  status: "Purchased"
}
```

Example response:

```text id="b1q5jj"
{
  id: string,
  status: "Idea" | "Purchased" | "Wrapped" | "Given",
  dateGiven?: string
}
```

The API MUST reject unsupported status values.

The route MUST require authentication and verify that the Gift belongs to the authenticated user.

WebSockets are not required.

Special rate limiting is not required for the MVP.

OpenAPI documentation SHOULD be updated if OpenAPI is used by the project.

## 10. UI / UX

### Components

- Gift status display
- Status selector or status action control
- Status indicators on Gift cards/list items
- Error feedback for unsuccessful status updates

### Main Flow

1. The user opens a Person's Gift List.
2. Each Gift displays its current status.
3. The user selects a Gift or its status control.
4. The user changes the status to `Idea`, `Purchased`, `Wrapped`, or `Given`.
5. The application saves the new status.
6. The updated status appears in the UI.
7. If the Gift is marked `Given`, its Date Given is recorded for Gift History.

### States

- **Empty:** N/A for the status itself because status only exists when a Gift exists. A Person with no Gifts uses the empty state defined in F3.
- **Loading:** A status control SHOULD indicate when an update is being saved.
- **Error:** If a status change cannot be saved, display an understandable error and preserve the previous status.
- **Offline:** If the application cannot reach the server, the user SHOULD be informed that the status change could not be saved.

Status controls SHOULD be responsive on mobile and desktop. Status MUST NOT be communicated only through color; readable text such as `Purchased` or `Wrapped` must also be present.

## 11. AI / ML Considerations

N/A — Gift Status Tracking does not use AI or machine learning.

## 12. Integration Points

Gift Status Tracking integrates with:

- F1 — User Authentication
- F2 — People Management
- F3 — Gift Idea Management
- F6 — Occasion Budget Tracking
- F7 — Gift History
- F8 — Dashboard

No external services are required for this feature.

## 13. Dependencies & Sequencing

- **Must ship after:** F1 — User Authentication, F2 — People Management, and F3 — Gift Idea Management.
- **Must ship before:** F6 — Occasion Budget Tracking, F7 — Gift History, and F8 — Dashboard.
- **Shared infrastructure needed:** Existing Gift model and authenticated ownership checks.

Gift Status Tracking should be implemented after basic Gift CRUD because status belongs to an existing Gift.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Invalid status values are saved | L | M | Restrict status to the four supported values and validate API input. |
| User accidentally chooses the wrong status | M | L | Allow status to be changed to another valid value. |
| Given date becomes inconsistent when status changes | M | M | Set Date Given when entering Given and clear it when leaving Given. |
| Status changes fail but UI appears updated | M | M | Confirm successful persistence and restore the previous status on failure. |
| User updates another user's Gift | L | H | Verify Gift ownership before every status update. |

## 15. Rollout Plan

A feature flag is not necessary for the student MVP.

The allowed status values and Date Given behavior should be added to the Gift model first. Status-update API behavior should then be implemented and tested before adding status controls to the UI.

Gift status behavior should be complete before F6 and F7 rely on `Purchased` and `Given`.

Rollback consists of reverting the status-update UI/API changes while preserving existing Gift records during development.

## 16. Test Plan

- **Unit** — Test allowed status values, default `Idea` status, and Date Given behavior.
- **Integration** — Test status updates against stored Gifts and verify invalid statuses are rejected.
- **End-to-end** — Create a Gift and move it through `Idea`, `Purchased`, `Wrapped`, and `Given`.
- **Security** — Verify one user cannot change another user's Gift status.
- **Accessibility** — Verify status controls are keyboard accessible, clearly labeled, and do not rely only on color.
- **Performance / load** — N/A for formal load testing because expected MVP usage is small.
- **Manual exploratory** — Test changing statuses forward and backward, failed updates, marking a Gift Given, and correcting accidental status changes.

### Acceptance Criteria Test Mapping

- **AC-1:** Default-status unit/integration test.
- **AC-2:** Purchased-status integration/end-to-end test.
- **AC-3:** Wrapped-status end-to-end test.
- **AC-4:** Given-status and Date Given integration test.
- **AC-5:** Purchased-status/budget integration test.
- **AC-6:** Given-status/history integration test.
- **AC-7:** Status-correction end-to-end test.
- **AC-8:** Cross-user authorization/security test.
- **AC-9:** Failed-update integration/manual test.

## 17. Documentation & Training

- Document the four Gift statuses and what each represents.
- Explain that new Gifts begin as `Idea`.
- Explain that `Purchased` Gifts can affect Occasion budgets.
- Explain that `Given` Gifts become available in Gift History.
- Document the status-update API if an API reference is maintained.
- Admin/instructor documentation is N/A because the application has no such roles.

## 18. Open Questions

1. What UI control should be used for status changes: dropdown, buttons, or another component?
2. Should the UI visually show the statuses as a progression from Idea → Purchased → Wrapped → Given?
3. Should the Date Given be visible to the user or simply stored for Gift History?

## 19. References

- Gift Tracker Project Specification — MVP Features: Gift Status
- Gift Tracker Project Specification — MVP Features: Occasion Budgets
- Gift Tracker Project Specification — MVP Features: Gift History
- Gift Tracker Project Specification — Basic User Flow: Track a Gift
- Gift Tracker Project Specification — Initial Data Models: Gift
- Related plans: `F3-gift-idea-management.md`, `F6-occasion-budget-tracking.md`, `F7-gift-history.md`, `F8-dashboard.md`