import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Search.css'

function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
      const apiKeyParam = apiKey ? `&key=${apiKey}` : ''
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query.trim(),
        )}${apiKeyParam}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch books. Please try again.')
      }

      const data = await response.json()
      setBooks(data.items || [])
    } catch (err) {
      setError(err.message || 'An error occurred while searching. Please try again.')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="search-page">
      <div className="search-header">
        <h1>Global Reading Tracker</h1>
        <p className="search-subtitle">
          Search for books by title or author to add to your reading list
        </p>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search query"
              required
            />
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="status-container" aria-live="polite">
          <div className="spinner"></div>
          <div>Searching for books...</div>
        </div>
      )}

      {error && (
        <div className="status-container" aria-live="assertive">
          <div className="error-message">{error}</div>
        </div>
      )}

      {!loading && !error && hasSearched && books.length === 0 && (
        <div className="status-container">
          <p>No books found for "{query}". Try another search term!</p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="results-grid">
          {books.map((book) => {
            const id = book.id
            const volumeInfo = book.volumeInfo || {}
            const title = volumeInfo.title || 'Untitled'
            const authors = volumeInfo.authors
              ? volumeInfo.authors.join(', ')
              : 'Unknown Author'
            const thumbnail = volumeInfo.imageLinks?.thumbnail

            return (
              <div
                key={id}
                className="book-card"
                onClick={() => navigate(`/book/${id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/book/${id}`)
                  }
                }}
              >
                <div className="book-cover-wrapper">
                  {thumbnail ? (
                    <img
                      src={thumbnail.replace(/^http:/, 'https:')}
                      alt={`Cover of ${title}`}
                      className="book-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="book-cover-placeholder">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span>No Cover</span>
                    </div>
                  )}
                </div>
                <div className="book-info">
                  <h3 className="book-title" title={title}>
                    {title}
                  </h3>
                  <p className="book-author" title={authors}>
                    {authors}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default Search
