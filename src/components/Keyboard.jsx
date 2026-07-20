// src/components/Keyboard.jsx
import './Keyboard.css'

const Keyboard = ({ 
  onKeyPress, 
  keyStatuses, 
  gameOver,
  onHint,
  showHint,
  hintUsed
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ]

  const getKeyClass = (key) => {
    if (key === 'ENTER' || key === 'BACK') return 'special'
    return keyStatuses[key.toLowerCase()] || ''
  }

  // Special row for hint button (appears below keyboard)
  const renderHintButton = () => {
    if (!showHint) return null
    
    return (
      <div className="hint-row">
        <button 
          className={`hint-btn ${hintUsed ? 'used' : ''}`}
          onClick={onHint}
          disabled={hintUsed}
        >
          💡 {hintUsed ? 'Hint Used' : 'Get Hint'}
        </button>
      </div>
    )
  }

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {rows.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className={`key ${getKeyClass(key)}`}
                onClick={() => onKeyPress(key)}
                disabled={gameOver}
              >
                {key === 'BACK' ? '⌫' : key === 'ENTER' ? '↵' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
      {renderHintButton()}
    </div>
  )
}

export default Keyboard