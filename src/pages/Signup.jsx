import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import countries from 'world-countries'
import { auth, db } from '../firebase'
import './Signup.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

const COUNTRY_OPTIONS = countries
  .map((country) => country.name.common)
  .sort((a, b) => a.localeCompare(b))

function validateForm({ name, email, password, country }) {
  const errors = {}

  if (!name.trim()) {
    errors.name = 'Full name is required'
  }

  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }

  if (!country) {
    errors.country = 'Please select a country'
  }

  return errors
}

function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    default:
      return 'Something went wrong. Please try again.'
  }
}

function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    const errors = validateForm({ name, email, password, country })
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      )

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.trim(),
        country,
      })

      navigate('/signin')
    } catch (error) {
      setSubmitError(getFirebaseErrorMessage(error.code))
    } finally {
      setIsSubmitting(false)
    }
  }

  function clearFieldError(field) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-card">
        <h1>Create account</h1>
        <p className="signup-subtitle">Join the Global Reading Tracker</p>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearFieldError('name')
              }}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'signup-name-error' : undefined}
            />
            {fieldErrors.name && (
              <p id="signup-name-error" className="field-error" role="alert">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearFieldError('email')
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="signup-email-error" className="field-error" role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                clearFieldError('password')
              }}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? 'signup-password-error' : undefined
              }
            />
            {fieldErrors.password && (
              <p id="signup-password-error" className="field-error" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="signup-country">Country</label>
            <select
              id="signup-country"
              name="country"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value)
                clearFieldError('country')
              }}
              aria-invalid={Boolean(fieldErrors.country)}
              aria-describedby={
                fieldErrors.country ? 'signup-country-error' : undefined
              }
            >
              <option value="">Select a country</option>
              {COUNTRY_OPTIONS.map((countryName) => (
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              ))}
            </select>
            {fieldErrors.country && (
              <p id="signup-country-error" className="field-error" role="alert">
                {fieldErrors.country}
              </p>
            )}
          </div>

          {submitError && (
            <p className="form-error" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            className="signup-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Signup
