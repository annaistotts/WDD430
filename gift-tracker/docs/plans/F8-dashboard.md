# F8 — Dashboard

> Implementation plan for the Gift Tracker MVP.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F8 |
| **Section** | Dashboard |
| **Severity** | MAJOR |
| **Markets** | Gift Tracker web application |
| **Status (today)** | MISSING |
| **Estimated effort** | S (≤1 week) |
| **Owner (proposed)** | Development team |
| **Depends on** | F1 — User Authentication, F2 — People Management, F3 — Gift Idea Management, F4 — Occasion Management, F5 — Gift Status Tracking, F6 — Occasion Budget Tracking |
| **Unblocks** | None |

---

## 1. Problem Statement

As users add more people, gifts, and occasions to Gift Tracker, they need a simple way to see the most important information without opening each Person individually. The Dashboard should provide an overview of gift-planning activity and quick access to the areas that need attention.

## 2. Goals

- Give authenticated users a useful overview of their Gift Tracker data.
- Display the user's People.
- Display upcoming Occasions.
- Provide an overview of Gift planning progress.
- Provide quick access to individual Person/Gift Lists.
- Help users identify upcoming gift-planning needs.

## 3. Non-Goals

- Providing advanced analytics or reports.
- Displaying Gift recommendations.
- Sending reminders or notifications.
- Creating calendar integrations.
- Displaying shared Gift Lists.
- Providing complex charts or data visualizations.
- Replacing the full People, Gift, Occasion, or Budget views.

## 4. Personas & User Stories

- **As a user**, I want to see my People from the Dashboard so that I can quickly open someone's Gift List.
- **As a user**, I want to see upcoming Occasions so that I know which events I should prepare for.
- **As a user**, I want to see Gift planning progress so that I know which Gifts still need attention.
- **As a user**, I want quick access to individual Gift Lists so that I do not have to navigate through several pages.
- **As a new user**, I want the Dashboard to guide me when I have not added any People yet.

## 5. Functional Requirements

- **FR-1.** The Dashboard MUST only be available to authenticated users.
- **FR-2.** The Dashboard MUST display People belonging to the authenticated user.
- **FR-3.** Each displayed Person MUST provide a way to navigate to that Person's Gift List.
- **FR-4.** The Dashboard MUST display upcoming Occasions belonging to the authenticated user's People.
- **FR-5.** Upcoming Occasions SHOULD display the Person, Occasion name/type, and date.
- **FR-6.** The Dashboard MUST provide an overview of Gift planning progress.
- **FR-7.** Gift planning progress SHOULD use existing Gift statuses to help users understand how far along their planning is.
- **FR-8.** Dashboard data MUST only include People, Gifts, Occasions, and budget information belonging to the authenticated user.
- **FR-9.** Annual recurring Occasions MUST use the appropriate upcoming occurrence when displayed on the Dashboard.
- **FR-10.** The Dashboard SHOULD prioritize upcoming Occasions so the nearest relevant dates are easiest to identify.
- **FR-11.** The Dashboard SHOULD provide useful empty states when the user has no People, no upcoming Occasions, or no Gifts.
- **FR-12.** The Dashboard MAY display Occasion budget progress when a budget has been set.
- **FR-13.** The Dashboard MUST use existing data from the other MVP features rather than creating duplicate Person, Gift, Occasion, or Budget records.

## 6. Non-Functional Requirements

- **Performance** — The Dashboard SHOULD load its overview data quickly enough for normal application use and SHOULD avoid unnecessary duplicate requests.
- **Security** — All Dashboard data MUST require authentication and be restricted to the authenticated user's records.
- **Privacy & Compliance** — The Dashboard MUST NOT expose another user's People, Gifts, Occasions, or budget information.
- **Accessibility** — Dashboard sections, links, statuses, and progress information SHOULD be keyboard accessible and understandable with assistive technology.
- **Scalability** — The Dashboard SHOULD support the expected number of People, Gifts, and Occasions in normal MVP usage.
- **Reliability** — Failure to load one section SHOULD be handled gracefully rather than making the entire Dashboard unusable where practical.
- **Observability** — Dashboard data-loading errors SHOULD be logged for development/debugging.
- **Maintainability** — The Dashboard SHOULD reuse existing data and business logic from People, Gifts, Occasions, Status Tracking, and Budget Tracking.
- **Internationalization** — The MVP is planned for English. Dates and currency SHOULD follow the same formatting rules used elsewhere in the application.
- **Backward compatibility** — N/A because this is a new application.

## 7. Acceptance Criteria

- **AC-1.** *Given* an authenticated user has People saved, *when* they open the Dashboard, *then* their People are displayed.
- **AC-2.** *Given* a Person is displayed on the Dashboard, *when* the user selects that Person, *then* they can navigate to that Person's Gift List.
- **AC-3.** *Given* the user's People have upcoming Occasions, *when* the Dashboard loads, *then* the upcoming Occasions are displayed with the associated Person and date.
- **AC-4.** *Given* multiple upcoming Occasions exist, *when* they are displayed, *then* the nearest upcoming Occasions are easy to identify.
- **AC-5.** *Given* the user has Gifts with different statuses, *when* the Dashboard loads, *then* Gift planning progress reflects the existing Gift status data.
- **AC-6.** *Given* an Occasion repeats annually, *when* its original date has passed for the current year, *then* the Dashboard can display its next relevant annual occurrence.
- **AC-7.** *Given* an Occasion has a budget, *when* budget progress is included on the Dashboard, *then* the displayed information uses the calculations defined by F6.
- **AC-8.** *Given* a new user has no People, *when* they open the Dashboard, *then* an empty state explains that no People have been added and provides a way to add one.
- **AC-9.** *Given* a user has People but no upcoming Occasions, *when* the Dashboard loads, *then* the Dashboard displays an appropriate no-upcoming-Occasions state.
- **AC-10.** *Given* a user attempts to access Dashboard data, *when* the data is retrieved, *then* only records owned by that authenticated user are returned.

## 8. Data Model

The Dashboard does not require its own primary data model.

It uses existing data from:

### User

- User ID

### Person

- Person ID
- User ID
- Name

### Gift

- Gift ID
- Person ID
- Occasion ID
- Name
- Price / Purchase price
- Status

### Occasion

- Occasion ID
- Person ID
- Name/type
- Date
- Budget
- Repeats annually

### Derived Dashboard Data

The Dashboard MAY derive values such as:

- Number of People
- Upcoming Occasions
- Gift counts by status
- Gift planning progress
- Occasion budget progress

Derived Dashboard values SHOULD NOT require duplicate permanent records unless later implementation needs justify them.

## 9. API Surface

The Dashboard may use existing APIs or a combined Dashboard endpoint.

Possible combined endpoint:

- `GET /api/dashboard` — Retrieve Dashboard overview data for the authenticated user.

Example response:

```text id="44u71c"
{
  people: [],
  upcomingOccasions: [],
  giftProgress: {
    idea: number,
    purchased: number,
    wrapped: number,
    given: number
  },
  budgetProgress?: []
}
```

Alternatively, the Dashboard MAY combine responses from existing People, Gift, Occasion, and Budget endpoints if that remains simple and performs well.

All Dashboard requests MUST require authentication.

The server MUST only return data owned by the authenticated user.

WebSockets are not required.

Special rate limiting is not required for the MVP.

OpenAPI documentation SHOULD be updated if OpenAPI is used by the project.

## 10. UI / UX

### Main Dashboard Sections

- People
- Upcoming Occasions
- Gift Planning Progress
- Quick links to Person/Gift Lists
- Optional budget progress where useful

### Main Flow

1. The authenticated user opens Gift Tracker.
2. The Dashboard loads their overview information.
3. The user sees their People.
4. The user sees upcoming Occasions.
5. The user sees Gift planning progress.
6. The user can select a Person to open their Gift List.
7. The user can use the overview to determine what Gift planning still needs attention.

### People Section

Each Person SHOULD be clearly selectable and provide quick access to their Gift List.

### Upcoming Occasions Section

Each upcoming Occasion SHOULD display:

- Occasion name/type
- Associated Person
- Date

The closest upcoming Occasions SHOULD be easiest to identify.

### Gift Planning Progress

Gift progress SHOULD be based on the four existing statuses:

- Idea
- Purchased
- Wrapped
- Given

The UI MAY use counts, labels, or simple progress indicators.

### States

- **New user:** Display a useful welcome/empty state with an action to add the first Person.
- **No upcoming Occasions:** Display a message that no upcoming Occasions are currently available.
- **No Gifts:** Display a useful state rather than empty progress information.
- **Loading:** Display a loading state while Dashboard data is retrieved.
- **Partial error:** If one section fails, show an error for that section while preserving other successfully loaded information where practical.
- **Full error:** Display an understandable message if Dashboard data cannot be loaded.
- **Offline:** Inform the user when current Dashboard information cannot be retrieved.

The Dashboard SHOULD be responsive on mobile and desktop. Information hierarchy SHOULD make upcoming planning needs easy to scan.

Progress information MUST NOT rely only on color.

## 11. AI / ML Considerations

N/A — The MVP Dashboard does not use AI or machine learning.

Gift recommendations or AI-generated planning suggestions are outside the MVP scope.

## 12. Integration Points

The Dashboard integrates with:

- F1 — User Authentication
- F2 — People Management
- F3 — Gift Idea Management
- F4 — Occasion Management
- F5 — Gift Status Tracking
- F6 — Occasion Budget Tracking

Gift History is available from the Person view and is not required for the main Dashboard overview.

No external services are required specifically for the Dashboard.

## 13. Dependencies & Sequencing

- **Must ship after:** F1, F2, F3, F4, F5, and F6.
- **Must ship before:** Nothing; this is the final planned MVP feature.
- **Shared infrastructure needed:** Authentication, database access, People, Gifts, Occasions, statuses, and budget calculations.

The Dashboard should be implemented last because it depends on information and business logic created by the other core MVP features.

Implementing it last also reduces the risk of building Dashboard logic around data structures that later change.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Dashboard becomes too crowded | M | M | Limit the MVP to People, upcoming Occasions, Gift progress, and quick navigation. |
| Dashboard duplicates business logic | M | M | Reuse existing Gift, Occasion, status, and budget logic. |
| Upcoming Occasion calculations are incorrect | M | M | Reuse and test annual recurrence logic from F4. |
| Too many separate API requests slow loading | M | M | Consider a combined Dashboard endpoint if needed. |
| Progress information is unclear | M | M | Use simple status labels/counts and avoid overly complex visualizations. |
| User sees another user's information | L | H | Filter all Dashboard data by the authenticated User ID. |

## 15. Rollout Plan

A feature flag is not necessary for the student MVP.

The Dashboard should be implemented after the underlying People, Gift, Occasion, Status, and Budget features are stable.

Implementation should begin with People and upcoming Occasions, followed by Gift planning progress and optional budget information.

Rollback consists of removing the Dashboard view while leaving all underlying feature data and functionality intact.

## 16. Test Plan

- **Unit** — Test derived Gift progress and upcoming Occasion calculations.
- **Integration** — Test Dashboard data retrieval across People, Gifts, Occasions, statuses, and budgets.
- **End-to-end** — Log in, create People/Gifts/Occasions, update Gift statuses, and verify the Dashboard reflects the saved information.
- **Security** — Verify Dashboard results only contain data belonging to the authenticated user.
- **Accessibility** — Verify Dashboard sections, links, progress information, and empty states are keyboard and screen-reader accessible.
- **Performance / load** — Verify normal Dashboard data loads without excessive duplicate requests. Formal large-scale load testing is not required for the MVP.
- **Manual exploratory** — Test new users, multiple People, multiple upcoming Occasions, recurring Occasions, no Gifts, different Gift statuses, budgets, and partial loading errors.

### Acceptance Criteria Test Mapping

- **AC-1:** People Dashboard integration/end-to-end test.
- **AC-2:** Person navigation end-to-end test.
- **AC-3:** Upcoming Occasion integration test.
- **AC-4:** Upcoming Occasion ordering/display test.
- **AC-5:** Gift progress calculation test.
- **AC-6:** Recurring Occasion Dashboard test.
- **AC-7:** Budget progress integration test.
- **AC-8:** New-user empty-state UI test.
- **AC-9:** No-upcoming-Occasions UI test.
- **AC-10:** Dashboard authorization/security test.

## 17. Documentation & Training

- Explain the purpose of the Dashboard.
- Explain how to access individual Person/Gift Lists from the Dashboard.
- Explain what Gift planning progress represents.
- Explain how upcoming Occasions are determined.
- Document the Dashboard API endpoint if one is created.
- Admin/instructor documentation is N/A because the application has no such roles.

## 18. Open Questions

1. Exactly how should Gift planning progress be displayed: counts, a progress bar, or another simple visual?
2. How far into the future should an Occasion count as "upcoming"?
3. How many upcoming Occasions should appear before the user needs to view more?
4. Should Occasion budget progress appear directly on the Dashboard or only on the Occasion/Person view?
5. Should the Dashboard use one combined API endpoint or existing individual feature endpoints?

## 19. References

- Gift Tracker Project Specification — Main Views: Dashboard
- Gift Tracker Project Specification — Main Views: People
- Gift Tracker Project Specification — Main Views: Person / Gift List
- Gift Tracker Project Specification — MVP Features: People
- Gift Tracker Project Specification — MVP Features: Occasions
- Gift Tracker Project Specification — MVP Features: Gift Status
- Gift Tracker Project Specification — MVP Features: Occasion Budgets
- Related plans: `F1-user-authentication.md`, `F2-people-management.md`, `F3-gift-idea-management.md`, `F4-occasion-management.md`, `F5-gift-status-tracking.md`, `F6-occasion-budget-tracking.md`