// src/components/GuessCounter.jsx
import './GuessCounter.css'

const GuessCounter = ({ guesses, error }) => {
  const guessesRemaining = 6 - guesses.length

  return (
    <div className={`guess-counter ${error ? 'error' : ''}`}>
      <div className="counter-box">
        <span className="counter-label">🎯 Guesses Remaining</span>
        <span 
          className={`counter-number ${
            guessesRemaining <= 2 ? 'danger' : 
            guessesRemaining <= 4 ? 'warning' : ''
          }`}
        >
          {guessesRemaining}
        </span>
      </div>
      <div className="counter-dots">
        {[...Array(6)].map((_, i) => (
          <span 
            key={i} 
            className={`dot ${i < guesses.length ? 'used' : 'remaining'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default GuessCounter