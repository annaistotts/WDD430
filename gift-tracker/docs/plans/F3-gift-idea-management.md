# F3 — Gift Idea Management

> Implementation plan for the Gift Tracker MVP.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F3 |
| **Section** | Gift Idea Management |
| **Severity** | BLOCKER |
| **Markets** | Gift Tracker web application |
| **Status (today)** | MISSING |
| **Estimated effort** | S (≤1 week) |
| **Owner (proposed)** | Development team |
| **Depends on** | F1 — User Authentication, F2 — People Management |
| **Unblocks** | F5, F6, F7, F8 |

---

## 1. Problem Statement

The main purpose of Gift Tracker is to give users a place to save gift ideas when they think of them instead of trying to remember them later. Users need to be able to create, view, edit, and delete gift ideas for individual people while keeping useful product information such as the link, current price, image, and notes together.

## 2. Goals

- Allow users to save gift ideas for a specific person.
- Store useful gift information including name, link, price, image, and notes.
- Automatically retrieve the product image and current price from a provided product link when possible.
- Allow gift ideas to exist without being assigned to an occasion.
- Allow users to edit and delete saved gift ideas.

## 3. Non-Goals

- Automatically recommending gifts.
- Sorting or filtering gift ideas.
- Comparing prices between multiple retailers.
- Purchasing products through Gift Tracker.
- Sharing gift ideas with other users.
- Group gifts or contributions from multiple users.

## 4. Personas & User Stories

- **As a user**, I want to save a gift idea when I find one so that I do not forget it later.
- **As a user**, I want to save a gift idea for a specific person so that my ideas stay organized.
- **As a user**, I want to paste a product link and have the price and image retrieved when possible so that I do not have to enter everything manually.
- **As a user**, I want the product price to stay useful even when prices change over time.
- **As a user**, I want to include notes so that I can remember important details about the gift.
- **As a user**, I want to save a gift without assigning an occasion so that I can decide what it is for later.
- **As a user**, I want to edit or delete a saved idea when my plans change.

## 5. Functional Requirements

- **FR-1.** The system MUST allow an authenticated user to add a gift idea to a person they own.
- **FR-2.** Each gift MUST have a gift name.
- **FR-3.** A gift MAY include a product link.
- **FR-4.** A gift MAY include a manually entered price when an automatic price cannot be retrieved or no product link is provided.
- **FR-5.** A gift MAY include notes.
- **FR-6.** A gift MAY be associated with an occasion.
- **FR-7.** A gift MUST be allowed to exist without an associated occasion.
- **FR-8.** The system MUST store the gift's current status.
- **FR-9.** A newly created gift MUST default to the `Idea` status.
- **FR-10.** When a product link is provided, the system SHOULD attempt to retrieve the product image and current product price from that link.
- **FR-11.** Failure to retrieve a product image or price MUST NOT prevent the gift from being saved.
- **FR-12.** The system MUST allow a user to view gift ideas associated with one of their people.
- **FR-13.** The system MUST allow a user to edit an existing gift idea.
- **FR-14.** The system MUST allow a user to delete an existing gift idea.
- **FR-15.** The system MUST prevent users from viewing, editing, creating, or deleting gifts associated with another user's People records.
- **FR-16.** The system SHOULD support refreshing the product price so that the stored price can reflect price changes after a gift idea has been saved.
- **FR-17.** The system SHOULD allow the user to manually enter or correct a price when automatic price retrieval is unavailable or incorrect.

## 6. Non-Functional Requirements

- **Performance** — Gift lists and CRUD operations SHOULD respond quickly during normal application use. Product-data retrieval SHOULD NOT prevent the rest of the application from functioning if an external source is slow.
- **Security** — All Gift operations MUST require authentication and verify ownership through the gift's associated Person and User.
- **Privacy & Compliance** — Gift data MUST remain private to the account that owns the associated Person. No additional compliance requirements have been identified for the MVP.
- **Accessibility** — Gift forms and controls SHOULD have clear labels, keyboard navigation, and understandable validation messages.
- **Scalability** — Each person SHOULD support multiple saved gifts. Large-scale optimization is outside the MVP scope.
- **Reliability** — A gift MUST still be savable if optional information such as price, link, image, notes, or occasion is unavailable.
- **Observability** — Failed Gift operations and product-data retrieval errors SHOULD be logged for development/debugging.
- **Maintainability** — Gift CRUD and product-retrieval logic SHOULD be separated from status, budget, and gift-history logic where practical.
- **Internationalization** — N/A for the initial MVP; the application is currently planned for English and prices will use the application's selected currency format.
- **Backward compatibility** — N/A because this is a new application.

## 7. Acceptance Criteria

- **AC-1.** *Given* an authenticated user is viewing one of their people, *when* they enter a valid gift name and save it, *then* the gift appears on that person's gift list with an `Idea` status.
- **AC-2.** *Given* a user enters optional gift information such as a product link, price, or notes, *when* the gift is saved, *then* the provided information is stored with the gift.
- **AC-3.** *Given* a user does not select an occasion, *when* they save a gift, *then* the gift is successfully saved without an Occasion ID.
- **AC-4.** *Given* a valid product link is provided, *when* the product information is processed, *then* the application attempts to retrieve the product image and current price.
- **AC-5.** *Given* a product image or price cannot be retrieved, *when* the user saves the gift, *then* the gift is still saved and the missing information is handled gracefully.
- **AC-6.** *Given* automatic price retrieval is unavailable or incorrect, *when* the user enters a price manually, *then* that price can be stored with the gift.
- **AC-7.** *Given* a saved product's price has changed, *when* its product information is refreshed successfully, *then* the displayed/stored current price is updated.
- **AC-8.** *Given* a user edits one of their saved gifts, *when* they save the changes, *then* the updated information is displayed.
- **AC-9.** *Given* a user deletes one of their gift ideas, *when* the deletion is completed, *then* the gift no longer appears on that person's gift list.
- **AC-10.** *Given* a user attempts to access a gift belonging to another user's Person record, *when* the request is made, *then* access is denied.
- **AC-11.** *Given* a person has no saved gift ideas, *when* the person page is opened, *then* an empty state is displayed with an option to add a gift idea.

## 8. Data Model

### Gift

- Gift ID
- Person ID
- Optional Occasion ID
- Name
- Product link
- Price
- Product image
- Notes
- Status
- Date added
- Date given

### Relationships

- Each Gift belongs to one Person.
- One Person can have multiple Gifts.
- A Gift MAY belong to one Occasion.
- A Gift can exist without an Occasion.

### Constraints

- Gift ID MUST uniquely identify each gift.
- Person ID MUST be required.
- Name MUST be required.
- Occasion ID MAY be null.
- Product link MAY be null.
- Price MAY be null.
- Product image MAY be null.
- Notes MAY be null.
- Status MUST have a valid Gift Tracker status.
- Newly created gifts MUST default to `Idea`.

No data backfill is required because this is a new application.

## 9. API Surface

Expected API interactions include:

- `GET /api/people/:personId/gifts` — Retrieve gifts for a person.
- `GET /api/gifts/:id` — Retrieve one gift.
- `POST /api/people/:personId/gifts` — Create a gift.
- `PUT /api/gifts/:id` — Update a gift.
- `DELETE /api/gifts/:id` — Delete a gift.
- `POST /api/gifts/:id/refresh-product` — Attempt to refresh product information such as current price and image.

Example create/update data:

```text
{
  name: string,
  productLink?: string,
  price?: number,
  notes?: string,
  occasionId?: string
}
```

Gift responses MAY include:

```text
{
  id: string,
  personId: string,
  occasionId?: string,
  name: string,
  productLink?: string,
  price?: number,
  productImage?: string,
  notes?: string,
  status: string,
  dateAdded: string
}
```

All routes MUST require authentication and verify ownership.

WebSockets are not required.

Product-data retrieval SHOULD be limited to reasonable requests and SHOULD NOT continuously request retailer websites.

OpenAPI documentation SHOULD be updated if OpenAPI is used by the project.

## 10. UI / UX

### Pages / Components

- Person/Gift List page
- Add Gift form
- Edit Gift form
- Gift display/card or list item
- Delete Gift control
- Product-image display or fallback
- Product price display
- Product-data refresh control, if manual refresh is used

### Main Flow

1. The user opens a person's gift list.
2. The user chooses to add a gift idea.
3. The user enters the gift name.
4. The user can paste a product link.
5. When possible, the application retrieves the product's current price and image.
6. The user can manually enter or correct a price if needed.
7. The user can optionally enter notes and associate the gift with an occasion.
8. The user saves the gift.
9. The gift appears on the person's list with an `Idea` status.
10. The user can later edit, delete, or refresh product information for the gift.

### States

- **Empty:** If the person has no gifts, display an empty state with an Add Gift action.
- **Loading:** Display a loading state while gift or product information is being retrieved or saved.
- **Error:** Display an understandable message if gift data cannot be loaded or saved.
- **Product retrieval error:** If the product price or image cannot be retrieved, allow the user to continue and manually enter missing information.
- **Offline:** Inform the user if an operation cannot be completed because the application cannot reach the server.

The Gift form SHOULD be responsive on mobile and desktop. All inputs MUST have clear labels and keyboard-accessible controls.

## 11. AI / ML Considerations

N/A — Gift Idea Management does not use AI or machine learning. Automated gift suggestions are outside the MVP.

## 12. Integration Points

Gift Idea Management integrates with:

- F1 — User Authentication
- F2 — People Management
- F4 — Occasion Management for optional occasion assignment
- F5 — Gift Status Tracking
- F6 — Occasion Budget Tracking
- F7 — Gift History
- F8 — Dashboard
- Product-data retrieval from a provided product link

The exact method or external service used to retrieve product prices and images will be decided during implementation.

## 13. Dependencies & Sequencing

- **Must ship after:** F1 — User Authentication and F2 — People Management.
- **Must ship before:** F5 — Gift Status Tracking, F6 — Occasion Budget Tracking, F7 — Gift History, and F8 — Dashboard.
- **Shared infrastructure needed:** Application database, authenticated User/Person relationships, and a method for retrieving product information.

Gift Idea Management should be implemented after People Management because every gift belongs to a Person.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Some retailers do not allow reliable automatic price or image retrieval | H | M | Allow manual price entry and gracefully handle missing product data. |
| Product prices change or become unavailable | H | M | Support refreshing product information and allow manual correction. |
| User accesses another user's gift | M | H | Verify ownership through Person/User relationships on every request. |
| Optional fields incorrectly become required | M | M | Test gifts with no price, link, notes, image, or occasion. |
| Invalid product links cause errors | M | M | Validate links and handle retrieval failures without blocking gift creation. |
| Product-data retrieval adds too much complexity | M | M | Keep retrieval logic isolated and ensure the core Gift feature works without it. |

## 15. Rollout Plan

A feature flag is not necessary for the student MVP.

The Gift data model should be created first, followed by basic Gift CRUD functionality. Product price and image retrieval should then be added without making Gift creation dependent on successful retrieval. The Gift UI can then display both automatically retrieved and manually entered product information.

Rollback consists of disabling or removing automatic product retrieval while preserving normal Gift CRUD functionality if the retrieval feature causes problems.

## 16. Test Plan

- **Unit** — Test required gift-name validation, optional fields, default `Idea` status, and product-data handling.
- **Integration** — Test Gift CRUD operations, Person relationships, optional Occasion IDs, database persistence, and product-data retrieval behavior.
- **End-to-end** — Test creating, viewing, editing, refreshing, and deleting a gift from a person's page.
- **Security** — Verify users cannot access or modify gifts belonging to another user's Person records.
- **Accessibility** — Verify the Gift form has labels, keyboard navigation, visible focus states, and accessible error messages.
- **Performance / load** — Formal load testing is N/A because expected MVP usage is small. Product retrieval SHOULD NOT make the core Gift interface unusable.
- **Manual exploratory** — Test gifts without prices, links, images, notes, or occasions; invalid product links; changed prices; image-retrieval failures; price-retrieval failures; manual price entry; and empty gift lists.

### Acceptance Criteria Test Mapping

- **AC-1:** Create-Gift integration and end-to-end test.
- **AC-2:** Optional-fields integration test.
- **AC-3:** Gift-without-occasion integration test.
- **AC-4:** Product-data retrieval integration/manual test.
- **AC-5:** Failed-product retrieval integration/manual test.
- **AC-6:** Manual-price fallback test.
- **AC-7:** Product-price refresh integration/manual test.
- **AC-8:** Update-Gift integration and end-to-end test.
- **AC-9:** Delete-Gift integration and end-to-end test.
- **AC-10:** Cross-user authorization/security test.
- **AC-11:** Empty gift-list UI test.

## 17. Documentation & Training

- Add basic instructions for adding, editing, and deleting gift ideas to project documentation.
- Explain which Gift fields are optional.
- Explain that the application attempts to retrieve current price and image information from product links but that retrieval may not always succeed.
- Explain how users can manually enter or correct a price when needed.
- Document the Gift API routes if an API reference is maintained.
- Admin/instructor documentation is N/A because the application has no such roles.

## 18. Open Questions

1. What method or service will be used to retrieve product images and current prices from product links?
2. How often should product prices be refreshed: automatically, manually, or both?
3. What placeholder should appear when a product image cannot be retrieved?
4. What price/currency format and decimal handling will be used?
5. Should deletion require confirmation, or is immediate deletion acceptable for gift ideas?

## 19. References

- Gift Tracker Project Specification — MVP Features: Gift Ideas
- Gift Tracker Project Specification — Basic User Flow: Save a Gift Idea
- Gift Tracker Project Specification — Initial Data Models: Gift
- Gift Tracker Project Specification — API Needs / Interactions
- Gift Tracker Project Specification — Important Edge Cases
- Related plans: `F1-user-authentication.md`, `F2-people-management.md`, `F4-occasion-management.md`, `F5-gift-status-tracking.md`, `F6-occasion-budget-tracking.md`, `F7-gift-history.md`, `F8-dashboard.md`