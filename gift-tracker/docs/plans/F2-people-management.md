# F2 — People Management

> Implementation plan for the Gift Tracker MVP.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F2 |
| **Section** | People Management |
| **Severity** | BLOCKER |
| **Markets** | Gift Tracker web application |
| **Status (today)** | MISSING |
| **Estimated effort** | S (≤1 week) |
| **Owner (proposed)** | Development team |
| **Depends on** | F1 — User Authentication |
| **Unblocks** | F3, F4, F8 |

---

## 1. Problem Statement

Gift Tracker needs a way for users to organize gift planning around the individual people in their lives. Without People Management, users cannot create separate gift lists, occasions, or gift histories for family members and friends.

## 2. Goals

- Allow users to add people they want to plan gifts for.
- Allow users to view all people they have added.
- Allow users to edit a person's information.
- Allow users to delete a person.
- Keep each person's information associated with the correct authenticated user.

## 3. Non-Goals

- Sharing a person's gift list with another user.
- Public gift lists.
- Adding user accounts for the people receiving gifts.
- Storing detailed contact information such as addresses or phone numbers.
- Sorting or filtering people beyond what is needed for the MVP.

## 4. Personas & User Stories

- **As a user**, I want to add a person so that I can begin saving gift ideas for them.
- **As a user**, I want to see the people I have added so that I can quickly choose whose gifts I want to plan.
- **As a user**, I want to edit a person's information so that I can correct or update it.
- **As a user**, I want to delete a person I no longer need to track.
- **As a user**, I want my people list to remain private to my account.

## 5. Functional Requirements

- **FR-1.** The system MUST allow an authenticated user to create a person.
- **FR-2.** Each person MUST contain a name and MAY contain notes.
- **FR-3.** Each person MUST be associated with the authenticated user's User ID.
- **FR-4.** The system MUST allow users to view the people associated with their account.
- **FR-5.** The system MUST allow users to edit a person's name and notes.
- **FR-6.** The system MUST allow users to delete a person.
- **FR-7.** Deleting a person MUST also delete the gifts, occasions, and gift history associated with that person.
- **FR-8.** The system MUST prevent a user from viewing, editing, or deleting another user's people.
- **FR-9.** Selecting a person MUST provide access to that person's individual Gift Tracker page.
- **FR-10.** The system SHOULD ask for confirmation before permanently deleting a person and their associated information.

## 6. Non-Functional Requirements

- **Performance** — People lists and CRUD operations SHOULD respond quickly during normal application use.
- **Security** — All People operations MUST require authentication and verify ownership using the authenticated User ID.
- **Privacy & Compliance** — A user's People data MUST not be visible to other users. No additional compliance requirements have been identified for the MVP.
- **Accessibility** — Forms and controls SHOULD be keyboard accessible and use clear labels.
- **Scalability** — The system SHOULD support multiple people per user. Large-scale optimization is outside the MVP scope.
- **Reliability** — Creating, editing, or deleting a person MUST either complete successfully or return a clear error without leaving inconsistent data.
- **Observability** — Failed People operations SHOULD be logged for development/debugging without exposing private information.
- **Maintainability** — People-related logic SHOULD remain separated from unrelated application features.
- **Internationalization** — N/A for the initial MVP; the application is currently planned for English.
- **Backward compatibility** — N/A because this is a new application.

## 7. Acceptance Criteria

- **AC-1.** *Given* an authenticated user enters a valid name, *when* they save a new person, *then* that person appears in their People list.
- **AC-2.** *Given* an authenticated user has saved people, *when* they open the People view, *then* only people belonging to their account are displayed.
- **AC-3.** *Given* a user selects one of their people, *when* they edit the person's information and save it, *then* the updated information is displayed.
- **AC-4.** *Given* a user chooses to delete a person, *when* they confirm the deletion, *then* that person and their associated gifts, occasions, and gift history are removed.
- **AC-5.** *Given* a user attempts to access a person belonging to another account, *when* the request is made, *then* access is denied.
- **AC-6.** *Given* a new user has not added anyone, *when* they open the People view, *then* an empty state is displayed with an option to add their first person.
- **AC-7.** *Given* a user selects a person from their People list, *when* the person's page opens, *then* the user can access that person's gift-planning information.

## 8. Data Model

### Person

- Person ID
- User ID
- Name
- Notes

### Relationships

- One User can have multiple People.
- Each Person belongs to one User.
- One Person can later have multiple Gifts and Occasions.

### Constraints

- Person ID MUST uniquely identify the person.
- User ID MUST reference the account that owns the person.
- Name MUST be required.
- Notes MAY be empty.

Deleting a Person MUST also remove associated gifts, occasions, and gift-history information.

The migration filename will follow the database convention selected during implementation. No backfill is required because this is a new application.

## 9. API Surface

Expected API interactions include:

- `GET /api/people` — Return the authenticated user's people.
- `GET /api/people/:id` — Return one person owned by the authenticated user.
- `POST /api/people` — Create a person.
- `PUT /api/people/:id` — Update a person.
- `DELETE /api/people/:id` — Delete a person and associated data.

Example create/update data:

```text
{
  name: string,
  notes?: string
}
```

All routes MUST require authentication and verify that the requested Person belongs to the authenticated user.

WebSockets are not required.

Special rate limiting is not required for the MVP.

OpenAPI documentation SHOULD be updated if OpenAPI is used by the project.

## 10. UI / UX

### Pages / Components

- People view
- Add Person form
- Edit Person form
- Delete confirmation
- Person/Gift List page

### Main Flow

1. The authenticated user opens the People view.
2. The user sees the people they have previously added.
3. The user can choose to add a new person.
4. The user enters the person's name and optional notes.
5. The person appears in the People view.
6. Selecting the person opens their individual Gift Tracker page.
7. The user can later edit or delete the person.

### States

- **Empty:** If no people exist, display a message explaining that the user has not added anyone yet and provide an Add Person action.
- **Loading:** Display a loading state while People data is being retrieved.
- **Error:** Display an understandable message if People data cannot be loaded or saved.
- **Offline:** Inform the user if an operation cannot be completed because the application cannot reach the server.

The interface SHOULD be responsive for desktop and mobile screens. Forms MUST use clear labels and keyboard-accessible controls. Delete confirmation SHOULD clearly explain that associated information will also be removed.

## 11. AI / ML Considerations

N/A — People Management does not use AI or machine learning.

## 12. Integration Points

People Management integrates with:

- F1 — User Authentication
- User data model
- Application database
- Gift Idea Management
- Occasion Management
- Gift History
- Dashboard

No external services are required for this feature.

## 13. Dependencies & Sequencing

- **Must ship after:** F1 — User Authentication.
- **Must ship before:** F3 — Gift Idea Management, F4 — Occasion Management, and F8 — Dashboard.
- **Shared infrastructure needed:** Application database and authenticated User ID.

People Management should be implemented immediately after authentication because gifts and occasions must belong to a person.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| User accesses another user's person record | M | H | Verify ownership on every People request. |
| Deleting a person leaves associated records behind | M | H | Use database relationships/cascade behavior or a controlled deletion process. |
| User accidentally deletes a person | M | M | Require confirmation and clearly explain what will be deleted. |
| Empty People list is confusing to new users | L | M | Provide a clear empty state with an Add Person action. |

## 15. Rollout Plan

A feature flag is not necessary for the student MVP.

The Person data model and database migration should be added before the People UI and CRUD routes. CRUD functionality should be tested before Gift and Occasion features depend on it.

Rollback consists of reverting the People-related application changes and database migration during development if necessary.

## 16. Test Plan

- **Unit** — Test Person validation and ownership logic.
- **Integration** — Test create, read, update, and delete operations against the database.
- **End-to-end** — Test adding a person, viewing them, editing them, opening their page, and deleting them.
- **Security** — Verify users cannot access, modify, or delete People records belonging to another user.
- **Accessibility** — Verify forms have labels, keyboard navigation, visible focus states, and accessible error messages.
- **Performance / load** — N/A for formal load testing because expected MVP usage is small.
- **Manual exploratory** — Test empty People lists, invalid names, editing notes, cancellation of deletion, confirmed deletion, and server/network errors.

### Acceptance Criteria Test Mapping

- **AC-1:** Create-Person integration and end-to-end test.
- **AC-2:** People-list ownership integration test.
- **AC-3:** Update-Person integration and end-to-end test.
- **AC-4:** Delete-Person integration test verifying associated data is removed.
- **AC-5:** Cross-user authorization/security test.
- **AC-6:** Empty-state UI test.
- **AC-7:** Person navigation end-to-end test.

## 17. Documentation & Training

- Add basic instructions for adding, editing, and deleting people to project documentation.
- Document People API routes if an API reference is maintained.
- Clearly document the cascading deletion behavior for developers.
- Admin/instructor documentation is N/A because the application does not have those roles.

## 18. Open Questions

1. Should duplicate person names be allowed? The current specification does not define a restriction, so they should be allowed unless the team decides otherwise.
2. What exact confirmation design should be used before deleting a person?
3. Should the person's notes appear directly on their page or only while editing? This is not specified and can be decided during UI implementation.

## 19. References

- Gift Tracker Project Specification — MVP Features: People
- Gift Tracker Project Specification — Main Views: People and Person/Gift List
- Gift Tracker Project Specification — Initial Data Models: Person
- Gift Tracker Project Specification — API Needs / Interactions
- Gift Tracker Project Specification — Important Edge Cases
- Related plans: `F1-user-authentication.md`, `F3-gift-idea-management.md`, `F4-occasion-management.md`, `F8-dashboard.md`