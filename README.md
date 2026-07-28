# Global Reading Tracker

A React app for tracking books you want to read or have read, with a twist: see how many people from different countries around the world have read or want to read the same book.

## Features

- **Sign up / Sign in** with Firebase Authentication (email and password), with a mandatory country field collected at signup
- **Search for books** using the Google Books API, by title or author
- **Book details** — view cover, author, publish date, and description for any book
- **Track your reading** — mark any book as "Want to Read" or "Have Read"
- **Country stats** — see a breakdown of how many users from each country have read or want to read a specific book
- **Sign out** and switch between accounts easily via the navbar



## Tech Stack

- **React** (built with Vite)
- **Firebase Authentication** — user signup/login
- **Firebase Firestore** — storing user profiles and reading status data
- **Google Books API** — book search and details



## Getting Started



### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Firebase](https://firebase.google.com/) project with Authentication (Email/Password) and Firestore enabled
- A [Google Books API key](https://console.cloud.google.com/)



### Setup

```bash
git clone https://github.com/<your-username>/global-reading-tracker.git
cd global-reading-tracker
npm install
```

Create a `.env` file in the project root with:

```env
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```



## Project Structure

```text
Global-Reading-Tracker/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── BookDetail.jsx
│   │   ├── BookDetail.css
│   │   ├── Search.jsx
│   │   ├── Search.css
│   │   ├── SignIn.jsx
│   │   ├── SignIn.css
│   │   ├── Signup.jsx
│   │   └── Signup.css
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── PROMPTS.md
```



## AI-Assisted Development

This project was built using AI as a development assistant (Cursor and Cline). All prompts used, along with an explanation of how AI helped and the manual corrections made after reviewing AI-generated code, are documented in [PROMPTS.md](./PROMPTS.md).