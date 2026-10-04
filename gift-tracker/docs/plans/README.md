# Gift Tracker — Feature Plan Portfolio

This folder contains the implementation plans for the Gift Tracker MVP. The features are ordered based on their dependencies so that the foundational features are completed before the features that rely on them.

## Feature Inventory

| Feature | Name | Classification | Depends On |
|---|---|---|---|
| F1 | User Authentication | Infrastructure / Supporting | None |
| F2 | People Management | Blocked | F1 |
| F3 | Gift Idea Management | Blocked | F1, F2 |
| F4 | Occasion Management | Blocked | F1, F2 |
| F5 | Gift Status Tracking | Blocked | F1, F2, F3 |
| F6 | Occasion Budget Tracking | Blocked | F1, F2, F3, F4, F5 |
| F7 | Gift History | Blocked | F1, F2, F3, F5 |
| F8 | Dashboard | Blocked | F1, F2, F3, F4, F5, F6 |

## Proposed Implementation Order

1. **F1 — User Authentication**
2. **F2 — People Management**
3. **F3 — Gift Idea Management**
4. **F4 — Occasion Management**
5. **F5 — Gift Status Tracking**
6. **F6 — Occasion Budget Tracking**
7. **F7 — Gift History**
8. **F8 — Dashboard**

This order starts with the features that provide the foundation for the rest of the application. Authentication needs to come first because all of the user's People, Gifts, Occasions, budgets, and history need to belong to a specific account.

People Management comes next because both Gifts and Occasions belong to a Person. Once People exist, Gift Idea Management and Occasion Management can be built. Gift Status Tracking comes after Gifts because a Gift must exist before its status can be changed.

Budget Tracking depends on Gifts, Occasions, Gift prices, and Gift statuses, so it should come later. Gift History also depends on Gift Status Tracking because a Gift becomes part of history when it is marked `Given`.

The Dashboard should be implemented last because it brings together information from most of the other features.

## Dependency Map

```text
F1 — User Authentication
│
└── F2 — People Management
    │
    ├── F3 — Gift Idea Management
    │   │
    │   └── F5 — Gift Status Tracking
    │       │
    │       ├── F6 — Occasion Budget Tracking
    │       └── F7 — Gift History
    │
    └── F4 — Occasion Management
        │
        └── F6 — Occasion Budget Tracking

F2 + F3 + F4 + F5 + F6
              │
              └── F8 — Dashboard
```

## First Feature to Implement

I would implement **F1 — User Authentication** first. Authentication is the foundation for keeping each user's Gift Tracker information private and separate. Nearly every other feature needs to know which user owns the data being created or retrieved.

Starting with authentication also makes it easier to build ownership checks into People, Gifts, and Occasions from the beginning instead of adding security after those features have already been developed.

After authentication, I would immediately implement People Management because People are the main organizational structure for the rest of the application.

## Cross-Feature Risks

One major cross-feature risk is keeping ownership and authorization consistent. People, Gifts, Occasions, budgets, and Gift History must always be connected back to the authenticated user so that one user cannot access another user's information.

Another risk is keeping Gift status behavior consistent across features. A Gift marked `Purchased` affects Occasion Budget Tracking, while a Gift marked `Given` affects Gift History. If the meaning of a status is implemented differently in different parts of the application, calculations and history could become inaccurate.

Price handling is another cross-feature risk. Gift Idea Management attempts to retrieve current product prices, while Budget Tracking needs to preserve the price that was actually paid. Current price and purchase price need to remain separate so later retailer price changes do not change historical spending.

Occasion recurrence also affects multiple features. Occasion Management determines how annual occasions repeat, while the Dashboard needs that same logic to determine which occasions are upcoming.

Finally, deleting records could affect several features at once. Deleting a Person removes their related Gifts, Occasions, and Gift History, while deleting only an Occasion should preserve the Gifts that were associated with it. These relationships need to be handled consistently to prevent accidental data loss.

## Plan Files

- `F1-user-authentication.md`
- `F2-people-management.md`
- `F3-gift-idea-management.md`
- `F4-occasion-management.md`
- `F5-gift-status-tracking.md`
- `F6-occasion-budget-tracking.md`
- `F7-gift-history.md`
- `F8-dashboard.md`