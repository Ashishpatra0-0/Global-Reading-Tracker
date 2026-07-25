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