// src/App.jsx
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
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setSolution(randomWord)
  }, [])

  useEffect(() => {
    if (guesses.length > 0) {
      const lastGuess = guesses[guesses.length - 1]
      const word = lastGuess.map(g => g.letter).join('')
      
      if (word === solution) {
        setWon(true)
        setGameOver(true)
      } else if (guesses.length === 6) {
        setGameOver(true)
      }
    }
  }, [guesses, solution])

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

  const handleKeyPress = useCallback((key) => {
    if (!gameStarted || gameOver) return

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
      setCurrentGuess(currentGuess.slice(0, -1))
      return
    }

    if (currentGuess.length < 5 && key.match(/[A-Za-z]/)) {
      setCurrentGuess(currentGuess + key.toUpperCase())
    }
  }, [currentGuess, gameOver, gameStarted])

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

  const resetGame = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setSolution(newWord)
    setGuesses([])
    setCurrentGuess('')
    setGameOver(false)
    setWon(false)
    setKeyStatuses({})
    setErrorMessage('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Wordle</h1>
      </header>

      {!gameStarted && (
        <RulesModal onPlay={() => setGameStarted(true)} />
      )}

      {gameStarted && (
        <>
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
          />

          <Keyboard 
            onKeyPress={handleKeyPress}
            keyStatuses={keyStatuses}
            gameOver={gameOver}
          />

          {gameOver && (
            <GameOverModal 
              solution={solution}
              won={won}
              onRestart={resetGame}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App