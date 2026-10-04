# F4 — Occasion Management

> Implementation plan for the Gift Tracker MVP.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F4 |
| **Section** | Occasion Management |
| **Severity** | MAJOR |
| **Markets** | Gift Tracker web application |
| **Status (today)** | MISSING |
| **Estimated effort** | S (≤1 week) |
| **Owner (proposed)** | Development team |
| **Depends on** | F1 — User Authentication, F2 — People Management |
| **Unblocks** | F6, F8 |

---

## 1. Problem Statement

Gift planning is often connected to birthdays, holidays, anniversaries, and other important dates. Gift Tracker needs a way for users to create and manage occasions for each person so they can organize gifts around upcoming events and prepare ahead of time.

## 2. Goals

- Allow users to create occasions for individual people.
- Support common and custom occasion types.
- Store a date for each occasion.
- Allow occasions to repeat annually.
- Allow users to edit and delete occasions.
- Allow a budget value to be associated with an occasion for use by the budget-tracking feature.

## 3. Non-Goals

- Sending occasion reminders or notifications.
- Automatically purchasing gifts before an occasion.
- Automatically recommending gifts for an occasion.
- Sharing occasions with other users.
- Managing an overall holiday budget across multiple people.
- Calculating budget spending and remaining amounts; this is handled by F6 — Occasion Budget Tracking.

## 4. Personas & User Stories

- **As a user**, I want to add a birthday for someone so that I can plan their gifts ahead of time.
- **As a user**, I want to create occasions such as Christmas or an anniversary so that I can organize gifts by event.
- **As a user**, I want to create a custom occasion when the event does not fit one of the standard options.
- **As a user**, I want an annual occasion to recur so that I do not have to recreate it every year.
- **As a user**, I want to edit an occasion if its information changes.
- **As a user**, I want to delete an occasion I no longer need.

## 5. Functional Requirements

- **FR-1.** The system MUST allow an authenticated user to create an occasion for a Person they own.
- **FR-2.** Each occasion MUST have a name or type.
- **FR-3.** Each occasion MUST have a date.
- **FR-4.** The system MUST support Birthday, Christmas, Anniversary, Mother's Day, Father's Day, and custom occasions.
- **FR-5.** The system MUST allow a user to indicate whether an occasion repeats annually.
- **FR-6.** An annually recurring occasion MUST remain available for future years without requiring the user to recreate it manually.
- **FR-7.** An occasion MAY have a budget.
- **FR-8.** The system MUST allow a user to view occasions associated with one of their People records.
- **FR-9.** The system MUST allow a user to edit an occasion.
- **FR-10.** The system MUST allow a user to delete an occasion.
- **FR-11.** The system MUST prevent users from viewing, editing, creating, or deleting occasions belonging to another user's People records.
- **FR-12.** Deleting an occasion MUST NOT delete the Person associated with it.
- **FR-13.** If gifts are associated with a deleted occasion, the system MUST handle those gifts without deleting them.

## 6. Non-Functional Requirements

- **Performance** — Occasion lists and CRUD operations SHOULD respond quickly during normal application use.
- **Security** — Occasion operations MUST require authentication and verify ownership through the associated Person and User.
- **Privacy & Compliance** — Occasion data MUST remain private to the account that owns the associated Person. No additional compliance requirements have been identified for the MVP.
- **Accessibility** — Occasion forms and controls SHOULD use clear labels, keyboard-accessible inputs, and understandable validation messages.
- **Scalability** — Each Person SHOULD support multiple occasions. Large-scale optimization is outside the MVP scope.
- **Reliability** — Creating, editing, or deleting an occasion MUST either complete successfully or return a clear error without corrupting related data.
- **Observability** — Failed Occasion operations SHOULD be logged for development/debugging.
- **Maintainability** — Occasion CRUD and recurrence logic SHOULD be separated from budget-calculation and reminder functionality.
- **Internationalization** — N/A for the initial MVP. Dates SHOULD be displayed consistently throughout the application.
- **Backward compatibility** — N/A because this is a new application.

## 7. Acceptance Criteria

- **AC-1.** *Given* an authenticated user is viewing one of their People records, *when* they enter a valid occasion name/type and date and save it, *then* the occasion is associated with that Person.
- **AC-2.** *Given* a user selects a standard occasion type such as Birthday or Christmas, *when* they save the occasion, *then* the selected type and date are stored.
- **AC-3.** *Given* a user chooses a custom occasion, *when* they enter a custom name and date, *then* the custom occasion is saved.
- **AC-4.** *Given* an occasion is marked as annually recurring, *when* its date passes, *then* it remains available as a recurring occasion for the following year.
- **AC-5.** *Given* a user adds a budget while creating or editing an occasion, *when* the occasion is saved, *then* the budget value is stored with that occasion.
- **AC-6.** *Given* a user edits an existing occasion, *when* they save the changes, *then* the updated occasion information is displayed.
- **AC-7.** *Given* a user deletes an occasion, *when* deletion completes, *then* the occasion is removed without deleting its associated Person.
- **AC-8.** *Given* gifts are associated with an occasion, *when* the occasion is deleted, *then* those gifts remain saved and are no longer associated with that occasion.
- **AC-9.** *Given* a user attempts to access an occasion belonging to another user's Person record, *when* the request is made, *then* access is denied.
- **AC-10.** *Given* a Person has no upcoming occasions, *when* their page is opened, *then* an appropriate empty state is displayed.

## 8. Data Model

### Occasion

- Occasion ID
- Person ID
- Occasion name/type
- Date
- Budget
- Repeats annually

### Relationships

- Each Occasion belongs to one Person.
- One Person can have multiple Occasions.
- Multiple Gifts MAY be associated with an Occasion.
- Each Occasion MAY have its own budget.

### Constraints

- Occasion ID MUST uniquely identify each occasion.
- Person ID MUST be required.
- Occasion name/type MUST be required.
- Date MUST be required.
- Budget MAY be null.
- Repeats annually MUST store whether the occasion should recur each year.

If an Occasion is deleted, associated Gifts MUST remain and their Occasion association should be removed rather than deleting the Gifts.

No data backfill is required because this is a new application.

## 9. API Surface

Expected API interactions include:

- `GET /api/people/:personId/occasions` — Retrieve occasions for a Person.
- `GET /api/occasions/:id` — Retrieve one Occasion.
- `POST /api/people/:personId/occasions` — Create an Occasion.
- `PUT /api/occasions/:id` — Update an Occasion.
- `DELETE /api/occasions/:id` — Delete an Occasion.

Example create/update data:

```text
{
  name: string,
  date: string,
  budget?: number,
  repeatsAnnually: boolean
}
```

All routes MUST require authentication and verify ownership through the associated Person.

WebSockets are not required.

Special rate limiting is not required for the MVP.

OpenAPI documentation SHOULD be updated if OpenAPI is used by the project.

## 10. UI / UX

### Pages / Components

- Occasion list on the Person page
- Add Occasion form
- Edit Occasion form
- Occasion display/card
- Delete Occasion control
- Annual recurrence option
- Budget input

### Main Flow

1. The user opens a Person's page.
2. The user chooses to add an occasion.
3. The user selects a common occasion type or enters a custom occasion.
4. The user selects the occasion date.
5. The user chooses whether the occasion repeats annually.
6. The user can optionally enter a budget.
7. The user saves the occasion.
8. The occasion appears with that Person's upcoming occasions.
9. The user can later edit or delete the occasion.

### States

- **Empty:** If a Person has no occasions, display an empty state with an Add Occasion action.
- **Loading:** Display a loading state while occasions are being retrieved or saved.
- **Error:** Display an understandable message if an occasion cannot be loaded or saved.
- **Offline:** Inform the user if an operation cannot be completed because the application cannot reach the server.

The Occasion form SHOULD work on mobile and desktop screen sizes. Form fields MUST have clear labels and keyboard-accessible controls. Date inputs and recurrence options SHOULD be easy to understand.

## 11. AI / ML Considerations

N/A — Occasion Management does not use AI or machine learning.

## 12. Integration Points

Occasion Management integrates with:

- F1 — User Authentication
- F2 — People Management
- F3 — Gift Idea Management for optional Gift/Occasion associations
- F6 — Occasion Budget Tracking
- F8 — Dashboard for upcoming occasions

No external services are required for this feature.

## 13. Dependencies & Sequencing

- **Must ship after:** F1 — User Authentication and F2 — People Management.
- **Must ship before:** F6 — Occasion Budget Tracking and F8 — Dashboard.
- **Shared infrastructure needed:** Application database and authenticated User/Person relationships.

Occasion Management can be developed after People Management and does not require Gift Idea Management to be complete before basic Occasion CRUD is implemented.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Annual recurrence behaves incorrectly across years | M | M | Define recurrence behavior clearly and test dates before and after an occasion passes. |
| Deleting an occasion accidentally deletes associated gifts | L | H | Remove the Occasion association while preserving the Gift record. |
| User accesses another user's occasion | M | H | Verify ownership through the Person/User relationship on every request. |
| Date handling creates incorrect upcoming occasions | M | M | Use consistent date storage and display rules throughout the application. |
| Custom occasions create inconsistent names | L | L | Allow user-entered names while validating that the name is not empty. |

## 15. Rollout Plan

A feature flag is not necessary for the student MVP.

The Occasion data model and CRUD API should be implemented first, followed by the Occasion form and display. Annual recurrence behavior should be tested before the Dashboard relies on Occasion data.

Budget calculations will be implemented separately in F6.

Rollback consists of reverting Occasion-related application changes and database migrations during development if necessary.

## 16. Test Plan

- **Unit** — Test required Occasion fields, annual recurrence behavior, and date validation.
- **Integration** — Test Occasion CRUD operations, Person relationships, optional budget storage, and Gift associations.
- **End-to-end** — Test creating, viewing, editing, and deleting an Occasion from a Person's page.
- **Security** — Verify users cannot access or modify Occasions belonging to another user's People records.
- **Accessibility** — Verify Occasion forms have labels, keyboard navigation, visible focus states, and accessible error messages.
- **Performance / load** — N/A for formal load testing because expected MVP usage is small.
- **Manual exploratory** — Test custom occasions, annual and non-annual occasions, no budget, editing dates, deleting occasions with associated gifts, and empty occasion lists.

### Acceptance Criteria Test Mapping

- **AC-1:** Create-Occasion integration and end-to-end test.
- **AC-2:** Standard Occasion type test.
- **AC-3:** Custom Occasion test.
- **AC-4:** Annual recurrence unit/integration test.
- **AC-5:** Occasion budget storage test.
- **AC-6:** Update-Occasion integration and end-to-end test.
- **AC-7:** Delete-Occasion integration test.
- **AC-8:** Delete-Occasion-with-Gifts integration test.
- **AC-9:** Cross-user authorization/security test.
- **AC-10:** Empty Occasion state UI test.

## 17. Documentation & Training

- Add basic instructions for creating, editing, and deleting occasions to project documentation.
- Explain how annual recurrence works.
- Explain that budgets can be entered for occasions but spending calculations are handled by the Budget Tracking feature.
- Document Occasion API routes if an API reference is maintained.
- Admin/instructor documentation is N/A because the application has no such roles.

## 18. Open Questions

1. Exactly how should recurring occasions be represented in the database and advanced to the next year?
2. How should an occasion's date be displayed when only the month and day matter for an annually recurring event?
3. Should deleting an occasion require confirmation?
4. Should all custom occasions be allowed to repeat annually, or should recurrence depend on the user's selection?

## 19. References

- Gift Tracker Project Specification — MVP Features: Occasions
- Gift Tracker Project Specification — Main Views: Person / Gift List
- Gift Tracker Project Specification — Occasion Form
- Gift Tracker Project Specification — Initial Data Models: Occasion
- Gift Tracker Project Specification — API Needs / Interactions
- Gift Tracker Project Specification — Important Edge Cases
- Related plans: `F1-user-authentication.md`, `F2-people-management.md`, `F3-gift-idea-management.md`, `F6-occasion-budget-tracking.md`, `F8-dashboard.md`