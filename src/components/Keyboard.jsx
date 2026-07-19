// src/components/Keyboard.jsx
import './Keyboard.css'

const Keyboard = ({ onKeyPress, keyStatuses, gameOver }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ]

  const getKeyClass = (key) => {
    if (key === 'ENTER' || key === 'BACK') return 'special'
    return keyStatuses[key.toLowerCase()] || ''
  }

  return (
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
  )
}

export default Keyboard