// src/components/RulesModal.jsx
import './RulesModal.css'

const RulesModal = ({ isOpen, onClose, onPlay }) => {
  if (!isOpen) return null

  const handlePlay = () => {
    if (onPlay) {
      onPlay()
    } else if (onClose) {
      onClose()
    }
  }

  return (
    <div className="rules-overlay" onClick={onClose}>
      <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rules-close" onClick={onClose}>✕</button>
        
        <h2>📖 How to Play</h2>
        
        <div className="rules-content">
          <p className="rules-intro">
            🎯 Guess the <strong>5-letter word</strong> in 6 tries.
          </p>
          
          <div className="rule-examples">
            <div className="rule-example">
              <div className="rule-tiles">
                <span className="rule-tile correct">W</span>
                <span className="rule-tile">O</span>
                <span className="rule-tile">R</span>
                <span className="rule-tile">D</span>
                <span className="rule-tile">S</span>
              </div>
              <p><span className="rule-dot green"></span> <strong>Green</strong> = Correct letter, correct position</p>
            </div>
            
            <div className="rule-example">
              <div className="rule-tiles">
                <span className="rule-tile">P</span>
                <span className="rule-tile present">L</span>
                <span className="rule-tile">A</span>
                <span className="rule-tile">N</span>
                <span className="rule-tile">T</span>
              </div>
              <p><span className="rule-dot yellow"></span> <strong>Yellow</strong> = Correct letter, wrong position</p>
            </div>
            
            <div className="rule-example">
              <div className="rule-tiles">
                <span className="rule-tile">G</span>
                <span className="rule-tile">R</span>
                <span className="rule-tile absent">A</span>
                <span className="rule-tile">P</span>
                <span className="rule-tile">E</span>
              </div>
              <p><span className="rule-dot gray"></span> <strong>Gray</strong> = Letter not in the word</p>
            </div>
          </div>
          
          <div className="rule-tips">
            <div className="rule-tip">
              <span className="tip-icon">💡</span>
              <span><strong>Hint:</strong> After 3 guesses, a Hint button appears!</span>
            </div>
            <div className="rule-tip">
              <span className="tip-icon">⏱️</span>
              <span><strong>Timer:</strong> You have <strong>2 minutes</strong> per game!</span>
            </div>
            <div className="rule-tip">
              <span className="tip-icon">⌨️</span>
              <span><strong>Keyboard:</strong> Use your physical keyboard or on-screen keys</span>
            </div>
          </div>
        </div>
        
        <button className="rules-play-btn" onClick={handlePlay}>
          Let's Play! 🚀
        </button>
      </div>
    </div>
  )
}

export default RulesModal
