import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Signup.css'

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    whatsappPhone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [alreadySignedUp, setAlreadySignedUp] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Check if email already exists
      // Use maybeSingle() instead of single() - it returns null instead of throwing when no row is found
      const { data: existingUser, error: checkError } = await supabase
        .from('signups')
        .select('email, first_name')
        .eq('email', formData.email.toLowerCase().trim())
        .maybeSingle()

      // If there's a check error (not a "no rows" error), log it but continue
      if (checkError) {
        console.warn('Error checking existing user:', checkError)
      }

      if (existingUser) {
        setFormData(prev => ({ ...prev, firstName: existingUser.first_name }))
        setAlreadySignedUp(true)
        return
      }

      // Insert new signup
      const { error: supabaseError } = await supabase
        .from('signups')
        .insert([
          {
            email: formData.email.toLowerCase().trim(),
            first_name: formData.firstName,
            whatsapp_phone: formData.whatsappPhone
          }
        ])

      if (supabaseError) throw supabaseError

      setIsSuccess(true)
    } catch (err) {
      console.error('Signup error:', err)
      
      // Handle unique constraint violation (code 23505) - user already signed up
      // This is a fallback in case the initial check missed a concurrent signup
      if (err.code === '23505') {
        setAlreadySignedUp(true)
        return
      }
      
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Already signed up state
  if (alreadySignedUp) {
    return (
      <div className="signup-container">
        <div className="signup-card success-card">
          <div className="success-icon already-icon">👋</div>
          <h1>You're Already In!</h1>
          <p className="success-message">
            Hey <strong>{formData.firstName}</strong>, you've already signed up for this event!
          </p>
          <div className="email-reminder">
            <span className="reminder-icon">📧</span>
            <p>
              Keep an eye on your inbox! We'll email you your <strong>secret role</strong> before the event.
            </p>
          </div>
          <div className="event-recap">
            <p><strong>Saturday, January 17th, 2026</strong></p>
            <p>Starting at 10:00 AM</p>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="signup-container">
        <div className="signup-card success-card">
          <div className="success-icon">✓</div>
          <h1>You're In!</h1>
          <p className="success-message">
            Thank you for RSVPing, <strong>{formData.firstName}</strong>!
          </p>
          <div className="email-reminder">
            <span className="reminder-icon">📧</span>
            <p>
              Keep an eye on your inbox! We'll email you your <strong>secret role</strong> before the event.
            </p>
          </div>
          <div className="event-recap">
            <p><strong>Saturday, January 17th, 2026</strong></p>
            <p>Starting at 10:00 AM</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="signup-container">
      <div className="signup-card success-card">
        <div className="success-icon">�</div>
        <h1>Sign Ups are now closed</h1>
        <p className="success-message">
          Thank you for your interest in <strong>The Parable of the Mole</strong>!
        </p>
        <div className="event-recap">
          <p><strong>Saturday, January 17th, 2026</strong></p>
          <p>Starting at 11:15 AM</p>
        </div>
      </div>
    </div>
  )
}

export default Signup
