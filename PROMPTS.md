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
​