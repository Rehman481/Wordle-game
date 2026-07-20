// src/components/Board.jsx
import { useEffect, useRef } from 'react'
import './Board.css'

const Board = ({ 
  guesses, 
  currentGuess, 
  solution, 
  gameOver,
  hintPosition,
  hintLetter,
  hintRevealed
}) => {
  const boardRef = useRef(null)

  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.scrollTop = boardRef.current.scrollHeight
    }
  }, [guesses])

  const getRowClass = (rowIndex) => {
    if (rowIndex < guesses.length) return 'filled'
    if (rowIndex === guesses.length && !gameOver) return 'active'
    return ''
  }

  const isHintTile = (rowIndex, colIndex) => {
    return rowIndex === guesses.length && 
           colIndex === hintPosition && 
           hintRevealed && 
           !gameOver
  }

  return (
    <div className="board-wrapper">
      <div className="board" ref={boardRef}>
        {[...Array(6)].map((_, rowIndex) => {
          const isFilled = rowIndex < guesses.length
          const isActive = rowIndex === guesses.length && !gameOver
          const guess = isFilled ? guesses[rowIndex] : null

          return (
            <div key={rowIndex} className={`row ${getRowClass(rowIndex)}`}>
              {[...Array(5)].map((_, colIndex) => {
                let letter = ''
                let status = ''
                let isHint = false

                if (isFilled && guess) {
                  letter = guess[colIndex].letter
                  status = guess[colIndex].status
                } else if (isActive) {
                  // Check if this is a hint tile
                  if (colIndex === hintPosition && hintRevealed) {
                    letter = hintLetter
                    isHint = true
                    status = 'hint'
                  } else {
                    letter = currentGuess[colIndex] || ''
                  }
                }

                return (
                  <div 
                    key={colIndex} 
                    className={`tile ${status} ${isHint ? 'hint-tile' : ''}`}
                    data-hint={isHint ? 'true' : 'false'}
                  >
                    {letter}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Board