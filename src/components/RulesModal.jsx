// src/components/RulesModal.jsx
import './RulesModal.css'

const RulesModal = ({ onPlay }) => {
  return (
    <div className="modal-overlay">
      <div className="modal rules-modal">
        <span className="rules-emoji">🎮</span>
        <h2>How to Play</h2>
        <p className="subtitle">Guess the word in 6 tries.</p>

        <ul className="rules-list">
          <li>Each guess must be a valid 5-letter word.</li>
          <li>Hit <strong>Enter</strong> to submit your guess.</li>
          <li>After each guess, tile colors show how close you were.</li>
        </ul>

        <div className="rules-examples">
          <div className="example-row">
            <div className="example-tiles">
              <div className="tile correct">W</div>
              <div className="tile">O</div>
              <div className="tile">R</div>
              <div className="tile">D</div>
              <div className="tile">S</div>
            </div>
            <p className="example-text">
              <strong>W</strong> is in the word and in the correct spot.
            </p>
          </div>

          <div className="example-row">
            <div className="example-tiles">
              <div className="tile">L</div>
              <div className="tile present">I</div>
              <div className="tile">G</div>
              <div className="tile">H</div>
              <div className="tile">T</div>
            </div>
            <p className="example-text">
              <strong>I</strong> is in the word but in the wrong spot.
            </p>
          </div>

          <div className="example-row">
            <div className="example-tiles">
              <div className="tile">V</div>
              <div className="tile">A</div>
              <div className="tile">G</div>
              <div className="tile absent">U</div>
              <div className="tile">E</div>
            </div>
            <p className="example-text">
              <strong>U</strong> is not in the word at all.
            </p>
          </div>
        </div>

        <div className="button-group">
          <button onClick={onPlay} className="restart-btn">
            Play
          </button>
        </div>
      </div>
    </div>
  )
}

export default RulesModal
