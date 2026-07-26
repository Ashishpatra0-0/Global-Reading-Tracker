import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function CountryStats({ bookId, refreshTrigger }) {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchStats() {
      try {
        setLoading(true)
        setError(null)
        const q = query(
          collection(db, 'userBooks'),
          where('bookId', '==', bookId)
        )
        const querySnapshot = await getDocs(q)
        
        if (!isMounted) return

        const countryGroups = {}

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          // Ensure we have a valid country name. Default to 'Unknown Country' if missing.
          const country = data.country ? data.country.trim() : 'Unknown Country'

          if (!countryGroups[country]) {
            countryGroups[country] = {
              country,
              haveRead: 0,
              wantToRead: 0,
              total: 0
            }
          }

          if (data.status === 'have-read') {
            countryGroups[country].haveRead += 1
            countryGroups[country].total += 1
          } else if (data.status === 'want-to-read') {
            countryGroups[country].wantToRead += 1
            countryGroups[country].total += 1
          }
        })

        // Convert to array and sort by total count descending
        const statsArray = Object.values(countryGroups).sort((a, b) => b.total - a.total)

        setStats(statsArray)
      } catch (err) {
        console.error('Error fetching country stats:', err)
        setError('Failed to fetch country statistics.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStats()

    return () => {
      isMounted = false
    }
  }, [bookId, refreshTrigger])

  if (loading) {
    return (
      <div className="country-stats-loading" aria-live="polite">
        <div className="stats-spinner"></div>
        <span>Loading country statistics...</span>
      </div>
    )
  }

  if (error) {
    return <p className="country-stats-error">{error}</p>
  }

  if (stats.length === 0) {
    return (
      <div className="country-stats-empty">
        <p>Be the first to mark this book!</p>
      </div>
    )
  }

  return (
    <div className="country-stats-container">
      <ul className="country-stats-list">
        {stats.map((stat) => {
          const haveReadText = stat.haveRead === 1 ? '1 has read' : `${stat.haveRead} have read`
          const wantToReadText = stat.wantToRead === 1 ? '1 wants to read' : `${stat.wantToRead} want to read`
          return (
            <li key={stat.country} className="country-stats-item">
              <span className="country-name">{stat.country}</span>
              {' — '}
              <span className="country-details">
                {haveReadText}, {wantToReadText}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
