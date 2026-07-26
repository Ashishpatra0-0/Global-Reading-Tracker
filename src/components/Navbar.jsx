import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import { auth, db } from '../firebase'
import './Navbar.css'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          const userDocRef = doc(db, 'users', currentUser.uid)
          const userDocSnap = await getDoc(userDocRef)
          if (userDocSnap.exists()) {
            setName(userDocSnap.data().name || '')
          }
        } catch (error) {
          console.error('Error fetching user info for Navbar:', error)
        }
      } else {
        setUser(null)
        setName('')
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Only show this Navbar when a user is actually logged in
  if (!user) return null

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/search" className="navbar-brand">
          🌍 Global Reading Tracker
        </Link>
        <div className="navbar-user-section">
          {name && <span className="navbar-user-name">Hello, {name}</span>}
          <button onClick={handleSignOut} className="navbar-signout-btn">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
