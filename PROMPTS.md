## 1. Signup Page

**Prompt:**
​
Create a Signup page component at src/pages/Signup.jsx for a React app using Firebase Authentication (email/password sign-up).

Requirements:
- Fields: full name, email, password, and country (dropdown, use a free npm package like "world-countries" or a simple static list of countries)
- On submit: create the Firebase Auth user with email/password, then save a document in Firestore under a "users" collection with fields: uid, name, email, country
- Show inline validation errors (empty fields, invalid email, password too short)
- Accessibility: proper labels, aria-invalid and aria-describedby for error messages
- After successful signup, redirect to a "/search" route

## 2. Search Page

**Prompt:**

Create a Search page component at src/pages/Search.jsx.

Requirements:
- A search input where the user types a book title or author
- On submit, call the Google Books API to fetch matching books
- Display results as a grid of cards, each showing: book cover image, title, and author
- Clicking a book card navigates to a book detail page at /book/:bookId
- Handle loading state and empty state
- Handle errors gracefully

## 3. Sign In Page

**Prompt:**

Create a Sign In page component at src/pages/SignIn.jsx for a React app using Firebase Authentication (email/password sign-in).

Requirements:
- Fields: email, password
- On submit: sign in the user using Firebase Auth's signInWithEmailAndPassword function
- Show inline validation errors (empty fields, invalid email format, wrong credentials error from Firebase)
- Accessibility: proper labels, aria-invalid and aria-describedby for error messages
- After successful sign in, redirect to the "/search" route
- Add a link at the bottom: "Don't have an account? Sign up" that navigates to "/signup"

Also updated:
- Signup.jsx: changed redirect after signup from "/search" to "/signin", and added a "Already have an account? Sign in" link
- Routing: added a "/signin" route and made it the default/home route

## 4. Book Detail Page

**Prompt:**

Create a Book Detail page component at src/pages/BookDetail.jsx.

Requirements:
- This page is reached via route /book/:bookId (bookId is the Google Books volume ID)
- On load, fetch the book's full details from the Google Books API using this ID: https://www.googleapis.com/books/v1/volumes/{bookId}
- Display: cover image, title, author, publish date, description
- Show two buttons: "Want to Read" and "Have Read"
- Clicking either button saves a record to Firestore in a collection called "userBooks", with fields: userId (current logged-in user's uid), bookId, bookTitle, status ("want-to-read" or "have-read"), country (the logged-in user's country, fetched from their "users" document), createdAt (timestamp)
- If the user already has a status saved for this book, show which one is currently selected (e.g., highlight the active button), and clicking the other one should update the status, not create a duplicate entry
- Handle loading and error states
- Require the user to be logged in to access this page; redirect to /signin if not authenticated

## 5. Country Stats

**Prompt:**

Create a Country Stats section within src/pages/BookDetail.jsx (or as a separate component src/components/CountryStats.jsx, imported into BookDetail).

Requirements:
- Query Firestore's "userBooks" collection for all documents matching the current book's bookId
- Group the results by country, counting how many have status "want-to-read" and how many have "have-read" for each country
- Display this as a simple list, sorted by total count (descending)
- If no one has marked this book yet, show a friendly message like "Be the first to mark this book!"
- Handle loading state while the stats are being fetched

## 6. Navbar with Sign Out

**Prompt:**

Create a Navbar component at src/components/Navbar.jsx, and include it at the top of every authenticated page (Search, BookDetail).

Requirements:
- Show the current logged-in user's name (fetched from their Firestore "users" document) on the right
- Add a "Sign Out" button next to the user's name that calls Firebase Auth's signOut function, then redirects to /signin
- Only show this Navbar when a user is actually logged in (hide it on Signup/SignIn pages)
- Keep it simple and clean, sticky to the top of the page

## How AI helped throughout

AI assistance was central to building each feature of this app. For every component — Signup, Sign In, Search, Book Detail, Country Stats, and the Navbar — I wrote detailed prompts specifying exact file locations, required fields, data structure, validation rules, and accessibility requirements, rather than vague one-line requests. This meant the generated code was usually functionally correct on the first pass.

AI was especially useful for:
- Scaffolding Firebase Authentication (signup/login) and Firestore read/write logic, which I was unfamiliar with beforehand.
- Building the Google Books API integration, including handling loading and error states cleanly.
- Structuring Firestore data (the "users" and "userBooks" collections) in a way that supported querying and grouping by country for the stats feature.
- Quickly producing consistent, accessible form components (labels, aria-invalid, aria-describedby) across multiple pages without me having to write repetitive boilerplate each time.

Overall, AI significantly sped up development, but every generated feature still required manual testing and, in several cases, debugging before it actually worked correctly (see Manual Corrections below).

## Manual corrections

1. **Fixed a malformed API URL causing 429 errors.** In BookDetail.jsx, the AI-generated Google Books API fetch call was built as `${bookId}&key=${apiKey}` instead of `${bookId}?key=${apiKey}`. Since this endpoint has no existing query string before the key parameter, the missing `?` meant my API key was never actually being sent — every request was hitting Google's shared anonymous rate limit instead of using my own quota, even though a key was configured. I found this by inspecting the actual failing request URL in the browser's Network tab, noticed the incorrect character, and corrected it manually.

3. **Fixed unreadable text color on the Book Detail page.** The AI-generated styling for the book title and description used a light gray/white color that was nearly invisible against the white card background — likely copied from styles meant for a dark background elsewhere in the app. I inspected the elements in the browser, identified the CSS classes responsible, and corrected the color values to a dark color for proper readability.

4. **Adjusted spacing on the Search page header.** The main heading ("Global Reading Tracker") and subtitle text were rendering too close together, making the page feel cramped. I identified the relevant CSS classes and added spacing between them for better visual separation.
