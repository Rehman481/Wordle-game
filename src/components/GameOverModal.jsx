// src/components/GameOverModal.jsx
import './GameOverModal.css'

const GameOverModal = ({ solution, won, onRestart, timeLeft, guesses }) => {
  // Get the number of guesses used
  const guessCount = guesses?.length || 0

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="result-emoji">{won ? '🎉' : '💪'}</span>
        <h2>{won ? 'You Won!' : 'Game Over'}</h2>
        <p className="subtitle">The word was:</p>
        <div className="word-reveal">
          <strong>{solution}</strong>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <span className="number">{guessCount}</span>
            <span className="label">Attempts</span>
          </div>
          <div className="stat-item">
            <span className="number">{won ? '✅' : '❌'}</span>
            <span className="label">Result</span>
          </div>
          {timeLeft !== undefined && (
            <div className="stat-item">
              <span className="number">{timeLeft}s</span>
              <span className="label">Time Left</span>
            </div>
          )}
        </div>

        <div className="button-group">
          <button onClick={onRestart} className="restart-btn">
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal