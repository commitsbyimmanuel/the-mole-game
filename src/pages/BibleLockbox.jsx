import { useState, useEffect, useRef } from 'react'
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

// Sound effect functions using Web Audio API
const createAudioContext = () => {
  return new (window.AudioContext || window.webkitAudioContext)()
}

const playDecryptingSound = (audioCtx, stopRef) => {
  let beepCount = 0
  const maxBeeps = 10
  
  const playBeep = () => {
    if (stopRef.current || beepCount >= maxBeeps) return
    
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.frequency.value = 800 + Math.random() * 400
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)
    
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.1)
    
    beepCount++
    setTimeout(playBeep, 200)
  }
  
  playBeep()
}

const playSuccessSound = (audioCtx) => {
  const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
  
  notes.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.frequency.value = freq
    oscillator.type = 'sine'
    
    const startTime = audioCtx.currentTime + i * 0.15
    gainNode.gain.setValueAtTime(0.2, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
    
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.3)
  })
}

const playFailureSound = (audioCtx) => {
  // Dramatic descending tones
  const notes = [440, 370, 311, 233] // A4, F#4, D#4, A#3 - descending dramatic
  
  notes.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.frequency.value = freq
    oscillator.type = 'sawtooth'
    
    const startTime = audioCtx.currentTime + i * 0.2
    gainNode.gain.setValueAtTime(0.15, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)
    
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.25)
  })
  
  // Deep bass hit at the end
  const bassOsc = audioCtx.createOscillator()
  const bassGain = audioCtx.createGain()
  
  bassOsc.connect(bassGain)
  bassGain.connect(audioCtx.destination)
  
  bassOsc.frequency.value = 80
  bassOsc.type = 'sine'
  
  const bassStart = audioCtx.currentTime + 0.8
  bassGain.gain.setValueAtTime(0.3, bassStart)
  bassGain.gain.exponentialRampToValueAtTime(0.01, bassStart + 0.6)
  
  bassOsc.start(bassStart)
  bassOsc.stop(bassStart + 0.6)
}

function BibleLockbox() {
  const { lockbox_id } = useParams()
  const navigate = useNavigate()
  const [inputs, setInputs] = useState([])
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [result, setResult] = useState(null) // 'success' | 'failure' | null
  const stopSoundRef = useRef(false)

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
    stopSoundRef.current = false

    // Create audio context and play decrypting sounds
    const audioCtx = createAudioContext()
    playDecryptingSound(audioCtx, stopSoundRef)

    // Simulate processing with a delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Stop decrypting sound
    stopSoundRef.current = true

    // Check if all words match (order doesn't matter)
    const enteredWords = inputs.map(i => i.toLowerCase().trim()).filter(w => w !== '')
    const requiredWords = lockbox.words.map(w => w.toLowerCase())

    // Check if same length and all required words are present
    const isCorrect = 
      enteredWords.length === requiredWords.length &&
      requiredWords.every(word => enteredWords.includes(word))

    // Play result sound
    if (isCorrect) {
      playSuccessSound(audioCtx)
    } else {
      playFailureSound(audioCtx)
    }

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
            {/* <button className="reset-button" onClick={handleReset}>
              Lock Again
            </button> */}
          </div>
        )}

        {result === 'failure' && (
          <div className="result-container failure">
            <div className="result-animation">
              <div className="result-icon failure-icon shake">✗</div>
            </div>
            <h2>❌ Incorrect Combination</h2>
            <p>Mission failed - the lockbox remains sealed.</p>
            {/* <button className="reset-button" onClick={handleReset}>
              Try Again
            </button> */}
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
