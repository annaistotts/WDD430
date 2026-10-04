# F7 — Gift History

> Implementation plan for the Gift Tracker MVP.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F7 |
| **Section** | Gift History |
| **Severity** | MAJOR |
| **Markets** | Gift Tracker web application |
| **Status (today)** | MISSING |
| **Estimated effort** | S (≤1 week) |
| **Owner (proposed)** | Development team |
| **Depends on** | F1 — User Authentication, F2 — People Management, F3 — Gift Idea Management, F5 — Gift Status Tracking |
| **Unblocks** | None |

---

## 1. Problem Statement

After giving a gift, users may want to remember what they previously gave someone so they do not accidentally repeat gifts and can reference past gift ideas. Gift Tracker needs to preserve Gifts marked `Given` and make them available as Gift History for each Person.

## 2. Goals

- Preserve Gifts after they are marked `Given`.
- Allow users to view previously given Gifts for each Person.
- Show useful information about previous Gifts.
- Preserve the Occasion associated with a Gift when applicable.
- Keep Gift History private to the owning user.

## 3. Non-Goals

- Automatically recommending new Gifts based on Gift History.
- Analyzing Gift-giving trends.
- Sharing Gift History with other users.
- Creating reports or charts about previous Gifts.
- Importing Gifts given before the user began using Gift Tracker.
- Restoring deleted Gifts.

## 4. Personas & User Stories

- **As a user**, I want to see Gifts I have previously given someone so that I can remember what I bought them.
- **As a user**, I want a Gift to remain available after I mark it `Given` so that I do not lose that information.
- **As a user**, I want to see which Occasion a previous Gift was associated with so that I have context about why I gave it.
- **As a user**, I want to see when a Gift was given so that I can tell how recent it was.
- **As a user**, I want Gift History to remain organized by Person so that I can quickly find past Gifts for a specific individual.

## 5. Functional Requirements

- **FR-1.** A Gift marked `Given` MUST remain stored in the application.
- **FR-2.** Gifts with a `Given` status MUST be available in the associated Person's Gift History.
- **FR-3.** Gift History MUST only display Gifts associated with the selected Person.
- **FR-4.** Gift History MUST display the Gift name.
- **FR-5.** Gift History SHOULD display the Date Given when available.
- **FR-6.** Gift History SHOULD display the associated Occasion when one exists.
- **FR-7.** Gift History MAY display additional stored Gift information such as price, product image, product link, or notes.
- **FR-8.** Gifts that have not been marked `Given` MUST NOT appear in Gift History.
- **FR-9.** The system MUST allow a user to delete a Gift from Gift History.
- **FR-10.** Deleting a Gift from Gift History MUST permanently remove that Gift record.
- **FR-11.** The system MUST prevent users from viewing or deleting Gift History belonging to another user's Person record.
- **FR-12.** If a Gift's status changes from `Given` to another valid status, it MUST no longer appear in Gift History.

## 6. Non-Functional Requirements

- **Performance** — Gift History SHOULD load quickly during normal application use.
- **Security** — Gift History MUST require authentication and verify ownership through the Gift, Person, and User relationships.
- **Privacy & Compliance** — Gift History MUST remain private to the owning account. No additional compliance requirements have been identified for the MVP.
- **Accessibility** — Gift History content and controls SHOULD be accessible through keyboard navigation and assistive technology.
- **Scalability** — Each Person SHOULD support multiple historical Gifts without requiring a separate storage system for the MVP.
- **Reliability** — Marking a Gift as `Given` MUST preserve its stored information.
- **Observability** — Failed Gift History retrieval or deletion operations SHOULD be logged for development/debugging.
- **Maintainability** — Gift History SHOULD use existing Gift records rather than creating duplicate copies of the same Gift.
- **Internationalization** — N/A for the initial MVP. Dates and currency SHOULD use the same formatting rules as the rest of the application.
- **Backward compatibility** — N/A because this is a new application.

## 7. Acceptance Criteria

- **AC-1.** *Given* a Gift has been marked `Given`, *when* the user views that Person's Gift History, *then* the Gift appears in the history.
- **AC-2.** *Given* a Gift has not been marked `Given`, *when* the user views Gift History, *then* the Gift does not appear.
- **AC-3.** *Given* a historical Gift has an associated Occasion, *when* the Gift is displayed in Gift History, *then* the Occasion is displayed with the Gift.
- **AC-4.** *Given* a Gift has a Date Given, *when* the Gift appears in Gift History, *then* that date is available to the user.
- **AC-5.** *Given* a Gift does not have an associated Occasion, *when* it appears in Gift History, *then* it is still displayed successfully without an Occasion.
- **AC-6.** *Given* a user deletes a Gift from Gift History, *when* deletion completes, *then* the Gift no longer appears and its Gift record is removed.
- **AC-7.** *Given* a Gift previously marked `Given` is changed back to another valid status, *when* Gift History is viewed, *then* that Gift no longer appears in history.
- **AC-8.** *Given* a user attempts to view Gift History belonging to another user's Person record, *when* the request is made, *then* access is denied.
- **AC-9.** *Given* a Person has no Gifts marked `Given`, *when* the user views Gift History, *then* an appropriate empty state is displayed.

## 8. Data Model

Gift History will use the existing Gift model rather than creating a separate Gift History model.

### Relevant Gift Fields

- Gift ID
- Person ID
- Optional Occasion ID
- Name
- Product link
- Price / Purchase price
- Product image
- Notes
- Status
- Date added
- Date given

### History Rule

A Gift belongs in Gift History when:

`Status = Given`

The `Date Given` field records when the Gift was marked as given.

### Relationships

- Each historical Gift belongs to one Person.
- A historical Gift MAY remain associated with an Occasion.
- One Person can have multiple historical Gifts.

No separate Gift History table is required for the MVP.

## 9. API Surface

Gift History can use the existing Gift data with a filtered endpoint.

Expected interaction:

- `GET /api/people/:personId/gifts/history` — Retrieve Gifts marked `Given` for a Person.
- `DELETE /api/gifts/:id` — Delete a historical Gift using the existing Gift deletion endpoint.

Example response:

```text id="g9ufn2"
{
  gifts: [
    {
      id: string,
      personId: string,
      occasionId?: string,
      name: string,
      price?: number,
      productImage?: string,
      status: "Given",
      dateGiven: string
    }
  ]
}
```

The API MUST require authentication and verify ownership through the Person/User relationship.

WebSockets are not required.

Special rate limiting is not required for the MVP.

OpenAPI documentation SHOULD be updated if OpenAPI is used by the project.

## 10. UI / UX

### Pages / Components

- Gift History section on the Person/Gift List page
- Historical Gift card/list item
- Date Given display
- Occasion display when applicable
- Delete Gift control

### Main Flow

1. The user opens a Person's page.
2. The user navigates to or views the Gift History section.
3. The application retrieves Gifts for that Person with a `Given` status.
4. Previous Gifts are displayed with relevant historical information.
5. If available, the Date Given and associated Occasion are displayed.
6. The user can delete a historical Gift if they no longer want it saved.

### States

- **Empty:** If the Person has no Gifts marked `Given`, display a message indicating that there is no Gift History yet.
- **Loading:** Display a loading state while Gift History is being retrieved.
- **Error:** Display an understandable message if Gift History cannot be loaded.
- **Missing Occasion:** Display the Gift normally without Occasion information.
- **Missing image:** Display the same image fallback used by Gift Idea Management.
- **Offline:** Inform the user if Gift History cannot be retrieved or changed because the application cannot reach the server.

Gift History SHOULD be responsive on mobile and desktop. Historical Gift information and deletion controls SHOULD be keyboard accessible and clearly labeled.

## 11. AI / ML Considerations

N/A — Gift History does not use AI or machine learning.

## 12. Integration Points

Gift History integrates with:

- F1 — User Authentication
- F2 — People Management
- F3 — Gift Idea Management
- F4 — Occasion Management for historical Occasion information
- F5 — Gift Status Tracking

No external services are required for this feature.

## 13. Dependencies & Sequencing

- **Must ship after:** F1 — User Authentication, F2 — People Management, F3 — Gift Idea Management, and F5 — Gift Status Tracking.
- **Must ship before:** Nothing required for the current MVP.
- **Shared infrastructure needed:** Existing Gift, Person, Occasion, and User data.

Gift History depends on Gift Status Tracking because a Gift becomes part of history when its status changes to `Given`.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Given Gifts are accidentally deleted instead of preserved | L | H | Keep the existing Gift record when status changes to Given. |
| Non-Given Gifts appear in history | M | M | Filter Gift History using the `Given` status. |
| Date Given is missing or incorrect | M | M | Record Date Given when status changes to Given. |
| Historical Occasion information is lost | M | M | Preserve Occasion association when possible and allow history to work without one. |
| User accidentally deletes historical Gift | M | M | Use clear deletion wording and consider a confirmation step. |
| User accesses another user's Gift History | L | H | Verify Person/User ownership before returning history data. |

## 15. Rollout Plan

A feature flag is not necessary for the student MVP.

Gift History should be implemented after Gift Status Tracking. The history query/filter should be implemented first, followed by the Gift History UI and deletion behavior.

Existing Gift records should be reused rather than copied into a separate history table.

Rollback consists of removing the Gift History display while preserving the underlying Gift records.

## 16. Test Plan

- **Unit** — Test Gift History filtering using the `Given` status and Date Given behavior.
- **Integration** — Test retrieving historical Gifts for a Person and deleting a historical Gift.
- **End-to-end** — Create a Gift, mark it `Given`, verify it appears in Gift History, and delete it.
- **Security** — Verify users cannot view or delete another user's Gift History.
- **Accessibility** — Verify Gift History and its controls are keyboard accessible and properly labeled.
- **Performance / load** — N/A for formal load testing because expected MVP usage is small.
- **Manual exploratory** — Test history with and without Occasions, missing images, multiple previous Gifts, status corrections, deletion, and an empty history.

### Acceptance Criteria Test Mapping

- **AC-1:** Given-Gift history integration/end-to-end test.
- **AC-2:** Non-Given Gift filtering test.
- **AC-3:** Historical Occasion display test.
- **AC-4:** Date Given display test.
- **AC-5:** Gift-without-Occasion history test.
- **AC-6:** Historical Gift deletion test.
- **AC-7:** Status-correction/history-removal test.
- **AC-8:** Cross-user authorization/security test.
- **AC-9:** Empty-history UI test.

## 17. Documentation & Training

- Explain that Gifts marked `Given` remain available in Gift History.
- Explain where users can find a Person's previous Gifts.
- Explain that historical Gifts can be deleted.
- Explain that Gift History may include the Occasion and Date Given.
- Document the Gift History API route if an API reference is maintained.
- Admin/instructor documentation is N/A because the application has no such roles.

## 18. Open Questions

1. Should Gift History appear directly below the active Gift List or in a separate tab/section?
2. Should historical Gifts be ordered by Date Given with the newest first?
3. Should deleting a historical Gift require confirmation?
4. How much Gift information should be displayed in the history view beyond name, Occasion, and Date Given?

## 19. References

- Gift Tracker Project Specification — MVP Features: Gift History
- Gift Tracker Project Specification — Main Views: Person / Gift List
- Gift Tracker Project Specification — Basic User Flow: Track a Gift
- Gift Tracker Project Specification — Initial Data Models: Gift
- Related plans: `F2-people-management.md`, `F3-gift-idea-management.md`, `F4-occasion-management.md`, `F5-gift-status-tracking.md`