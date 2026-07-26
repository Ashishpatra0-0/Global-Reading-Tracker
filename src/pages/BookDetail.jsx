import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import CountryStats from '../components/CountryStats'
import './BookDetail.css'

function BookDetail() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  const [book, setBook] = useState(null)
  const [bookLoading, setBookLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [status, setStatus] = useState(null) // "want-to-read" or "have-read" or null
  const [userCountry, setUserCountry] = useState('')
  const [userDocId, setUserDocId] = useState(null)
  const [savingStatus, setSavingStatus] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/signin')
      } else {
        setUser(currentUser)
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [navigate])

  // Fetch book and user status details
  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function fetchData() {
      try {
        setBookLoading(true)
        setError('')

        // 1. Fetch user's country
        const userDocRef = doc(db, 'users', user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists() && isMounted) {
          setUserCountry(userDocSnap.data().country || '')
        }

        // 2. Fetch book details from Google Books API
        const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
        const apiKeyParam = apiKey ? `?key=${apiKey}` : ''
        const bookResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}${apiKeyParam}`,
        )
        if (!bookResponse.ok) {
          throw new Error('Failed to fetch book details. Please try again.')
        }
        const bookData = await bookResponse.json()
        if (isMounted) {
          setBook(bookData)
        }

        // 3. Fetch existing saved status for this book by this user
        const q = query(
          collection(db, 'userBooks'),
          where('userId', '==', user.uid),
          where('bookId', '==', bookId),
        )
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty && isMounted) {
          const docSnap = querySnapshot.docs[0]
          setUserDocId(docSnap.id)
          setStatus(docSnap.data().status)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred while fetching book details.')
        }
      } finally {
        if (isMounted) {
          setBookLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [user, bookId])

  async function handleSaveStatus(newStatus) {
    if (!user || savingStatus) return
    setSavingStatus(true)
    setError('')

    try {
      const bookTitle = book?.volumeInfo?.title || 'Untitled'
      let country = userCountry

      if (!country) {
        const userDocRef = doc(db, 'users', user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          country = userDocSnap.data().country || ''
          setUserCountry(country)
        }
      }

      if (userDocId) {
        // Update existing record
        const docRef = doc(db, 'userBooks', userDocId)
        await updateDoc(docRef, {
          status: newStatus,
          createdAt: serverTimestamp(),
        })
        setStatus(newStatus)
        setRefreshTrigger((prev) => prev + 1)
      } else {
        // Create a new record
        const userBooksRef = collection(db, 'userBooks')
        const newDocRef = doc(userBooksRef)
        const record = {
          userId: user.uid,
          bookId,
          bookTitle,
          status: newStatus,
          country: country || '',
          createdAt: serverTimestamp(),
        }
        await setDoc(newDocRef, record)
        setUserDocId(newDocRef.id)
        setStatus(newStatus)
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (err) {
      console.error('Error saving reading status:', err)
      setError('Failed to save reading status. Please try again.')
    } finally {
      setSavingStatus(false)
    }
  }

  if (authLoading) {
    return (
      <div className="status-container" aria-live="polite">
        <div className="spinner"></div>
        <div>Checking authentication...</div>
      </div>
    )
  }

  if (bookLoading) {
    return (
      <div className="status-container" aria-live="polite">
        <div className="spinner"></div>
        <div>Loading book details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="status-container" aria-live="assertive">
        <div className="error-message">{error}</div>
        <Link to="/search" className="back-link">
          Back to Search
        </Link>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="status-container">
        <p>Book not found.</p>
        <Link to="/search" className="back-link">
          Back to Search
        </Link>
      </div>
    )
  }

  const volumeInfo = book.volumeInfo || {}
  const title = volumeInfo.title || 'Untitled'
  const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'
  const publishedDate = volumeInfo.publishedDate || 'Unknown publish date'
  const thumbnail = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.medium || volumeInfo.imageLinks?.large
  const description = volumeInfo.description || 'No description available.'

  return (
    <main className="book-detail-page">
      <div className="back-header">
        <Link to="/search" className="back-link">
          ← Back to Search
        </Link>
      </div>

      <div className="book-detail-card">
        <div className="book-detail-layout">
          <div className="book-detail-aside">
            <div className="detail-cover-wrapper">
              {thumbnail ? (
                <img
                  src={thumbnail.replace(/^http:/, 'https:')}
                  alt={`Cover of ${title}`}
                  className="detail-cover"
                />
              ) : (
                <div className="detail-cover-placeholder">
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
                  <span>No Cover Available</span>
                </div>
              )}
            </div>

            <div className="status-actions">
              <button
                type="button"
                className={`status-btn want-to-read-btn ${status === 'want-to-read' ? 'selected' : ''}`}
                disabled={savingStatus}
                onClick={() => handleSaveStatus('want-to-read')}
              >
                {savingStatus && status === 'want-to-read' ? 'Saving...' : 'Want to Read'}
              </button>
              <button
                type="button"
                className={`status-btn have-read-btn ${status === 'have-read' ? 'selected' : ''}`}
                disabled={savingStatus}
                onClick={() => handleSaveStatus('have-read')}
              >
                {savingStatus && status === 'have-read' ? 'Saving...' : 'Have Read'}
              </button>
            </div>
          </div>

          <div className="book-detail-main">
            <h1 className="detail-title">{title}</h1>
            <p className="detail-author">By {authors}</p>
            <p className="detail-date">Published: {publishedDate}</p>

            <div className="detail-description-section">
              <h2>Description</h2>
              <div
                className="detail-description"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            <div className="country-stats-section">
              <h2>Country Stats</h2>
              <CountryStats bookId={bookId} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default BookDetail
