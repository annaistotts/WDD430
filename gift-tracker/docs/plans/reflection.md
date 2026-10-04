# Feature Plan Portfolio Reflection

The hardest part of making these plans testable was thinking through all of the different situations that could happen instead of only thinking about the main user flow. Writing the acceptance criteria helped me think about things like missing prices, failed product information retrieval, and users trying to access data that does not belong to them.

One place where the scope could have easily grown was adding features like gift recommendations, notifications, sharing lists, or more advanced budget tools, so I made sure to keep those outside of the MVP.

Looking at the dependencies also changed how I thought about the implementation order because I realized that some features could not work until the data they depend on already existed. For example, Gift Status Tracking needs Gifts first, and Budget Tracking needs Gifts, Occasions, prices, and statuses.

One risk I had not thought much about before planning was how a changing product price could affect budget tracking. Separating the current product price from the price actually paid will help prevent future price changes from making previous budget totals inaccurate.