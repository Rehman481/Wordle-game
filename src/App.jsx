// src/App.jsx - COMPLETE FIXED VERSION
import { useState, useEffect, useCallback } from 'react'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import GameOverModal from './components/GameOverModal'
import GuessCounter from './components/GuessCounter'
import RulesModal from './components/RulesModal'
import { WORDS } from './data/words'
import './App.css'

function App() {
  const [solution, setSolution] = useState('')
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [keyStatuses, setKeyStatuses] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [shake, setShake] = useState(false)

  // HINT SYSTEM STATE
  const [hintUsed, setHintUsed] = useState(false)
  const [hintLetter, setHintLetter] = useState('')
  const [hintPosition, setHintPosition] = useState(-1)
  const [hintRevealed, setHintRevealed] = useState(false)

  // TIMER STATE
  const [timeLeft, setTimeLeft] = useState(120)
  const [timerActive, setTimerActive] = useState(false)
  const [showRules, setShowRules] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize game
  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setSolution(randomWord)
    resetHintState()
    setTimeLeft(120)
    setTimerActive(false)
    setGameStarted(false)
  }, [])

  // Reset hint state
  const resetHintState = () => {
    setHintUsed(false)
    setHintLetter('')
    setHintPosition(-1)
    setHintRevealed(false)
  }

  // Timer logic
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !gameOver && gameStarted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver && gameStarted) {
      setGameOver(true)
      setTimerActive(false)
      setErrorMessage('⏰ Time\'s Up!')
    }
  }, [timerActive, timeLeft, gameOver, gameStarted])

  // Check win/lose
  useEffect(() => {
    if (guesses.length > 0) {
      const lastGuess = guesses[guesses.length - 1]
      const word = lastGuess.map(g => g.letter).join('')
      
      if (word === solution) {
        setWon(true)
        setGameOver(true)
        setTimerActive(false)
      } else if (guesses.length === 6) {
        setGameOver(true)
        setTimerActive(false)
      }
    }
  }, [guesses, solution])

  // Reset game
  const resetGame = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setSolution(newWord)
    setGuesses([])
    setCurrentGuess('')
    setGameOver(false)
    setWon(false)
    setKeyStatuses({})
    setErrorMessage('')
    resetHintState()
    setTimeLeft(120)
    setTimerActive(false)
    setGameStarted(false)
    setShowRules(true)
  }

  const startGame = () => {
    setShowRules(false)
    setGameStarted(true)
    setTimerActive(true)
  }

  // Find available hint position
  const findHintPosition = () => {
    const solutionArr = solution.split('')
    
    const correctPositions = new Set()
    guesses.forEach(guess => {
      guess.forEach((g, idx) => {
        if (g.status === 'correct') {
          correctPositions.add(idx)
        }
      })
    })

    const availablePositions = []
    for (let i = 0; i < 5; i++) {
      if (!correctPositions.has(i) && i !== hintPosition) {
        let alreadyCorrect = false
        guesses.forEach(guess => {
          if (guess[i] && guess[i].letter === solutionArr[i] && guess[i].status === 'correct') {
            alreadyCorrect = true
          }
        })
        if (!alreadyCorrect) {
          availablePositions.push(i)
        }
      }
    }

    if (availablePositions.length === 0) return -1
    
    const randomIndex = Math.floor(Math.random() * availablePositions.length)
    return availablePositions[randomIndex]
  }

  // Handle hint usage
  const handleHint = () => {
    if (hintUsed || gameOver || guesses.length < 3) return
    if (guesses.length >= 6) return

    const position = findHintPosition()
    if (position === -1) return

    const letter = solution[position]
    
    // Build guess with hint letter
    let guessArray = currentGuess.split('')
    while (guessArray.length < 5) {
      guessArray.push('')
    }
    guessArray[position] = letter
    
    // Remove trailing empty strings
    let newGuess = guessArray.join('')
    while (newGuess.endsWith('') || newGuess.endsWith(' ')) {
      newGuess = newGuess.slice(0, -1)
    }
    
    setHintLetter(letter)
    setHintPosition(position)
    setHintUsed(true)
    setHintRevealed(true)
    setCurrentGuess(newGuess)
  }

  const evaluateGuess = (guess) => {
    const solutionArr = solution.split('')
    const guessArr = guess.split('')
    const result = []

    const solutionCopy = [...solutionArr]
    const guessCopy = [...guessArr]

    for (let i = 0; i < 5; i++) {
      if (guessCopy[i] === solutionCopy[i]) {
        result[i] = { letter: guessCopy[i], status: 'correct' }
        solutionCopy[i] = null
        guessCopy[i] = null
      }
    }

    for (let i = 0; i < 5; i++) {
      if (guessCopy[i] === null) continue
      const index = solutionCopy.indexOf(guessCopy[i])
      if (index !== -1) {
        result[i] = { letter: guessCopy[i], status: 'present' }
        solutionCopy[index] = null
      } else {
        result[i] = { letter: guessCopy[i], status: 'absent' }
      }
    }

    return result
  }

  const updateKeyStatuses = (evaluatedGuess) => {
    const newStatuses = { ...keyStatuses }
    evaluatedGuess.forEach(({ letter, status }) => {
      const key = letter.toLowerCase()
      if (!newStatuses[key] || 
          (status === 'correct') || 
          (status === 'present' && newStatuses[key] !== 'correct')) {
        newStatuses[key] = status
      }
    })
    setKeyStatuses(newStatuses)
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  // ========== FIXED handleKeyPress ==========
  const handleKeyPress = useCallback((key) => {
    if (gameOver || !gameStarted) return
    setErrorMessage('')

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        setErrorMessage('⚠️ Need exactly 5 letters!')
        triggerShake()
        return
      }

      if (!WORDS.includes(currentGuess)) {
        setErrorMessage(`❌ "${currentGuess}" is not a valid word!`)
        triggerShake()
        return
      }

      const evaluated = evaluateGuess(currentGuess)
      setGuesses(prevGuesses => [...prevGuesses, evaluated])
      updateKeyStatuses(evaluated)
      setCurrentGuess('')
      return
    }

    if (key === 'BACK') {
      const guessArray = currentGuess.split('')
      
      // Find the last editable position (skip hint position)
      let lastIndex = -1
      for (let i = guessArray.length - 1; i >= 0; i--) {
        if (i !== hintPosition && guessArray[i] && guessArray[i] !== ' ') {
          lastIndex = i
          break
        }
      }
      
      if (lastIndex === -1) {
        // If no editable letters, clear everything except hint
        if (hintPosition !== -1 && hintRevealed) {
          const newArray = Array(5).fill('')
          newArray[hintPosition] = hintLetter
          setCurrentGuess(newArray.join('').trimEnd())
        } else {
          setCurrentGuess('')
        }
      } else {
        // Remove the letter at lastIndex
        const newArray = guessArray.map((char, idx) => {
          if (idx === lastIndex) return ''
          return char
        })
        const cleaned = newArray.filter(char => char !== '').join('')
        setCurrentGuess(cleaned)
      }
      return
    }

    if (currentGuess.length < 5 && key.match(/[A-Za-z]/)) {
      const upperKey = key.toUpperCase()
      
      // Create an array of the current guess (pad to 5)
      let guessArray = currentGuess.split('')
      while (guessArray.length < 5) {
        guessArray.push('')
      }
      
      // Find the first empty position (skip hint position)
      let insertIndex = -1
      for (let i = 0; i < 5; i++) {
        if (i === hintPosition) continue
        if (!guessArray[i] || guessArray[i] === '') {
          insertIndex = i
          break
        }
      }
      
      if (insertIndex === -1) return
      
      // Insert the letter
      guessArray[insertIndex] = upperKey
      
      // Remove trailing empty strings
      let newGuess = guessArray.join('')
      while (newGuess.endsWith('') || newGuess.endsWith(' ')) {
        newGuess = newGuess.slice(0, -1)
      }
      
      setCurrentGuess(newGuess)
    }
  }, [currentGuess, gameOver, hintPosition, hintRevealed, hintLetter, gameStarted])

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleKeyPress('ENTER')
        return
      }
      
      if (e.key === 'Backspace') {
        e.preventDefault()
        handleKeyPress('BACK')
        return
      }

      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        handleKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  const shouldShowHint = guesses.length >= 3 && !gameOver && !hintUsed && guesses.length < 6 && gameStarted

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'timer-danger'
    if (timeLeft <= 30) return 'timer-warning'
    return ''
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Wordle</h1>
      </header>

      <div className="game-info">
        <div className={`timer ${getTimerColor()}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
        <button className="rules-btn" onClick={() => setShowRules(true)}>
          📖 Rules
        </button>
      </div>

      <GuessCounter guesses={guesses} error={!!errorMessage} />
      
      {errorMessage && (
        <div className={`error-message ${shake ? 'shake' : ''}`}>
          {errorMessage}
        </div>
      )}

      <Board 
        guesses={guesses}
        currentGuess={currentGuess}
        solution={solution}
        gameOver={gameOver}
        hintPosition={hintPosition}
        hintLetter={hintLetter}
        hintRevealed={hintRevealed}
      />

      <Keyboard 
        onKeyPress={handleKeyPress}
        keyStatuses={keyStatuses}
        gameOver={gameOver}
        onHint={handleHint}
        showHint={shouldShowHint}
        hintUsed={hintUsed}
      />

      {gameOver && (
        <GameOverModal 
          solution={solution}
          won={won}
          onRestart={resetGame}
          timeLeft={timeLeft}
        />
      )}

      {showRules && (
        <RulesModal 
          isOpen={showRules}
          onClose={startGame}
          onPlay={startGame}
        />
      )}
    </div>
  )
}

export default App