import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './BibleLockbox.css'

// Lockbox configurations with random 8-character IDs
const LOCKBOXES = {
  'a7b3c9d2': {
    id: 'a7b3c9d2',
    name: 'Lockbox 1',
    words: ['will', 'from', 'yields', 'are']
  },
  'e5f1g8h4': {
    id: 'e5f1g8h4',
    name: 'Lockbox 2',
    words: ['all', 'establishes', 'be', 'former']
  },
  'k2m6n9p3': {
    id: 'k2m6n9p3',
    name: 'Lockbox 3',
    words: ['called', 'the', 'travel']
  }
}

function BibleLockbox() {
  const { lockbox_id } = useParams()
  const navigate = useNavigate()
  const [inputs, setInputs] = useState([])
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [result, setResult] = useState(null) // 'success' | 'failure' | null

  const lockbox = LOCKBOXES[lockbox_id]

  useEffect(() => {
    if (lockbox) {
      setInputs(new Array(lockbox.words.length).fill(''))
      setResult(null)
    }
  }, [lockbox_id, lockbox])

  if (!lockbox) {
    return (
      <div className="lockbox-container">
        <div className="lockbox-card error-card">
          <div className="error-icon">🔒</div>
          <h1>Lockbox Not Found</h1>
          <p>The lockbox you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs]
    newInputs[index] = value.toLowerCase().trim()
    setInputs(newInputs)
    setResult(null) // Reset result when user types
  }

  const handleUnlock = async () => {
    setIsUnlocking(true)
    setResult(null)

    // Simulate processing with a delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check if all words match (order doesn't matter)
    const enteredWords = inputs.map(i => i.toLowerCase().trim()).filter(w => w !== '')
    const requiredWords = lockbox.words.map(w => w.toLowerCase())

    // Check if same length and all required words are present
    const isCorrect = 
      enteredWords.length === requiredWords.length &&
      requiredWords.every(word => enteredWords.includes(word))

    setResult(isCorrect ? 'success' : 'failure')
    setIsUnlocking(false)
  }

  const handleReset = () => {
    setInputs(new Array(lockbox.words.length).fill(''))
    setResult(null)
  }

  return (
    <div className="lockbox-container">
      <div className="lockbox-card">
        {/* Header */}
        <div className="lockbox-header">
          <div className="lockbox-badge">🔐 Bible Lockbox</div>
          <h1 className="lockbox-title">{lockbox.name}</h1>
          <p className="lockbox-subtitle">
            Enter the {lockbox.words.length} secret words to unlock
          </p>
        </div>

        {/* Input Fields */}
        {!result && (
          <div className="lockbox-inputs">
            {inputs.map((value, index) => (
              <div key={index} className="input-field">
                <label>Word {index + 1}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Enter word ${index + 1}`}
                  disabled={isUnlocking}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        )}

        {/* Unlock Button */}
        {!result && (
          <button 
            className="unlock-button" 
            onClick={handleUnlock}
            disabled={isUnlocking || inputs.some(i => i.trim() === '')}
          >
            {isUnlocking ? (
              <>
                <div className="unlock-spinner"></div>
                <span>Decrypting...</span>
              </>
            ) : (
              <>
                <span>🔓</span>
                <span>Unlock</span>
              </>
            )}
          </button>
        )}

        {/* Result Display */}
        {result === 'success' && (
          <div className="result-container success">
            <div className="result-animation">
              <div className="result-icon success-icon">✓</div>
              <div className="particles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="particle" style={{ '--i': i }}></div>
                ))}
              </div>
            </div>
            <h2>🎉 Unlocked Successfully!</h2>
            <p>The lockbox has been opened. You've proven your wisdom!</p>
            <button className="reset-button" onClick={handleReset}>
              Lock Again
            </button>
          </div>
        )}

        {result === 'failure' && (
          <div className="result-container failure">
            <div className="result-animation">
              <div className="result-icon failure-icon shake">✗</div>
            </div>
            <h2>❌ Incorrect Combination</h2>
            <p>Mission failed - the lockbox remains sealed.</p>
            <button className="reset-button" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}

        {/* Lockbox ID */}
        <div className="lockbox-id">
          <span>ID: {lockbox_id}</span>
        </div>
      </div>
    </div>
  )
}

export default BibleLockbox
