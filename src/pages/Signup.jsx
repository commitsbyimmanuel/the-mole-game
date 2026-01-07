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
      const { error: supabaseError } = await supabase
        .from('signups')
        .insert([
          {
            email: formData.email,
            first_name: formData.firstName,
            whatsapp_phone: formData.whatsappPhone
          }
        ])

      if (supabaseError) throw supabaseError

      setIsSuccess(true)
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
            <p><strong>Saturday, January 10th, 2026</strong></p>
            <p>Starting at 10:00 AM</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="card-header">
          <span className="event-badge">You're Invited</span>
          <h1 className="event-title">The Parable of the Mole</h1>
          <p className="event-subtitle">A Mystery Game Experience</p>
        </div>

        <div className="event-details">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <div>
              <p className="detail-label">Date</p>
              <p className="detail-value">Saturday, January 10th, 2026</p>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">⏰</span>
            <div>
              <p className="detail-label">Time</p>
              <p className="detail-value">10:00 AM</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsappPhone">WhatsApp Phone Number</label>
            <input
              type="tel"
              id="whatsappPhone"
              name="whatsappPhone"
              value={formData.whatsappPhone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                RSVP Now
                <span className="button-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <p className="privacy-note">
          Your information is safe and will only be used for this event.
        </p>
      </div>
    </div>
  )
}

export default Signup
