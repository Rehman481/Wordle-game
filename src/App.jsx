// src/App.jsx - WITH DARK/LIGHT MODE TOGGLE
import { useState, useEffect, useCallback } from 'react'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import GameOverModal from './components/GameOverModal'
import GuessCounter from './components/GuessCounter'
import RulesModal from './components/RulesModal'
import confetti from 'canvas-confetti'
import sound from './utils/sounds'
import { WORDS } from './data/words'
import './App.css'

function App() {
  const [solution, setSolution] = useState('')
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState(Array(5).fill(''))
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [keyStatuses, setKeyStatuses] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [shake, setShake] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [confettiTriggered, setConfettiTriggered] = useState(false)

  // ========== THEME STATE ==========
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('wordleTheme')
    if (saved) return saved === 'dark'
    // Default to dark mode
    return true
  })

  // ========== APPLY THEME ==========
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    localStorage.setItem('wordleTheme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // HINT SYSTEM STATE
  const [hintUsed, setHintUsed] = useState(false)
  const [lockedHintIndex, setLockedHintIndex] = useState(-1)
  const [lockedHintLetter, setLockedHintLetter] = useState('')

  // TIMER STATE
  const [timeLeft, setTimeLeft] = useState(120)
  const [timerActive, setTimerActive] = useState(false)
  const [showRules, setShowRules] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)

  // ========== CONFETTI CELEBRATION ==========
  const celebrate = () => {
    if (confettiTriggered) return
    setConfettiTriggered(true)

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      startVelocity: 35,
      colors: ['#00C9A7', '#FFB347', '#4FC3F7', '#FF6B6B', '#FFD93D', '#6C5CE7']
    })

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.5, x: 0.3 },
        startVelocity: 30,
        colors: ['#00E3B4', '#FF8A65', '#81D4FA', '#FFAB91']
      })
    }, 200)

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.5, x: 0.7 },
        startVelocity: 30,
        colors: ['#A8E6CF', '#FFD3B4', '#B39DDB', '#FF8A80']
      })
    }, 400)

    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.7, x: 0.1 },
        startVelocity: 40,
        colors: ['#FFD93D', '#FF6B6B', '#4FC3F7']
      })
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.7, x: 0.9 },
        startVelocity: 40,
        colors: ['#FFD93D', '#FF6B6B', '#4FC3F7']
      })
    }, 600)

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.4 },
        startVelocity: 25,
        colors: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF8A65']
      })
    }, 900)
  }

  // Resume audio context on user interaction
  useEffect(() => {
    const resumeAudio = () => {
      sound.resume()
    }
    document.addEventListener('click', resumeAudio)
    document.addEventListener('keydown', resumeAudio)
    return () => {
      document.removeEventListener('click', resumeAudio)
      document.removeEventListener('keydown', resumeAudio)
    }
  }, [])

  // Initialize game
  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setSolution(randomWord)
    resetHintState()
    setTimeLeft(120)
    setTimerActive(false)
    setGameStarted(false)
    setConfettiTriggered(false)
  }, [])

  // Reset hint state
  const resetHintState = () => {
    setHintUsed(false)
    setLockedHintIndex(-1)
    setLockedHintLetter('')
  }

  // Timer logic with sounds
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !gameOver && gameStarted) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1
          if (newTime <= 10 && newTime > 0) {
            sound.timerDanger()
          } else if (newTime <= 30 && newTime > 10 && newTime % 5 === 0) {
            sound.timerWarning()
          }
          return newTime
        })
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver && gameStarted) {
      setGameOver(true)
      setTimerActive(false)
      setErrorMessage('⏰ Time\'s Up!')
      sound.lose()
    }
  }, [timerActive, timeLeft, gameOver, gameStarted])

  // Check win/lose with confetti
  useEffect(() => {
    if (guesses.length > 0) {
      const lastGuess = guesses[guesses.length - 1]
      const word = lastGuess.map(g => g.letter).join('')
      
      if (word === solution) {
        setWon(true)
        setGameOver(true)
        setTimerActive(false)
        sound.win()
        setTimeout(() => celebrate(), 300)
      } else if (guesses.length === 6) {
        setGameOver(true)
        setTimerActive(false)
        sound.lose()
      }
    }
  }, [guesses, solution])

  // Reset game
  const resetGame = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setSolution(newWord)
    setGuesses([])
    setCurrentGuess(Array(5).fill(''))
    setGameOver(false)
    setWon(false)
    setKeyStatuses({})
    setErrorMessage('')
    resetHintState()
    setTimeLeft(120)
    setTimerActive(false)
    setGameStarted(false)
    setShowRules(true)
    setConfettiTriggered(false)
  }

  const startGame = () => {
    setShowRules(false)
    setGameStarted(true)
    setTimerActive(true)
    sound.resume()
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
      if (!correctPositions.has(i) && i !== lockedHintIndex) {
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

  // Handle hint usage with sound
  const handleHint = () => {
    if (hintUsed || gameOver || guesses.length < 3) return
    if (guesses.length >= 6) return

    const position = findHintPosition()
    if (position === -1) return

    const letter = solution[position]
    
    const guessArray = [...currentGuess]
    guessArray[position] = letter

    setLockedHintIndex(position)
    setLockedHintLetter(letter)
    setHintUsed(true)
    setCurrentGuess(guessArray)
    sound.hint()
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
    sound.error()
  }

  const getFirstEditableIndex = (guessArray) => {
    for (let i = 0; i < 5; i++) {
      if (i === lockedHintIndex) continue
      if (!guessArray[i]) return i
    }
    return -1
  }

  const handleKeyPress = useCallback((key) => {
    if (gameOver || !gameStarted) return
    setErrorMessage('')

    if (key === 'ENTER') {
      const guessWord = currentGuess.join('').toUpperCase()

      if (guessWord.length !== 5) {
        setErrorMessage('⚠️ Need exactly 5 letters!')
        triggerShake()
        return
      }

      if (!WORDS.includes(guessWord)) {
        setErrorMessage(`❌ "${guessWord}" is not a valid word!`)
        triggerShake()
        return
      }

      const evaluated = evaluateGuess(guessWord)
      
      evaluated.forEach(({ status }) => {
        if (status === 'correct') sound.correct()
        else if (status === 'present') sound.present()
        else if (status === 'absent') sound.absent()
      })

      setGuesses(prev => [...prev, evaluated])
      updateKeyStatuses(evaluated)
      setCurrentGuess(Array(5).fill(''))
      setLockedHintIndex(-1)
      setLockedHintLetter('')
      return
    }

    if (key === 'BACK') {
      const guessArray = [...currentGuess]
      let removeIndex = -1

      for (let i = 4; i >= 0; i--) {
        if (i === lockedHintIndex) continue
        if (guessArray[i]) {
          removeIndex = i
          break
        }
      }

      if (removeIndex === -1) return

      guessArray[removeIndex] = ''
      setCurrentGuess(guessArray)
      sound.keyPress()
      return
    }

    if (key.match(/^[A-Za-z]$/)) {
      const upperKey = key.toUpperCase()
      const guessArray = [...currentGuess]
      const insertIndex = getFirstEditableIndex(guessArray)

      if (insertIndex === -1) return

      guessArray[insertIndex] = upperKey
      setCurrentGuess(guessArray)
      sound.keyPress()
    }
  }, [currentGuess, gameOver, lockedHintIndex, gameStarted])

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

  const toggleSound = () => {
    const enabled = sound.toggle()
    setSoundEnabled(enabled)
  }

  const toggleTheme = () => {
    setDarkMode(prev => !prev)
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
        <div className="game-info-buttons">
          <button className="theme-btn" onClick={toggleTheme} title="Toggle Theme">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="sound-btn" onClick={toggleSound}>
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="rules-btn" onClick={() => setShowRules(true)}>
            📖 Rules
          </button>
        </div>
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
        gameOver={gameOver}
        lockedHintIndex={lockedHintIndex}
        lockedHintLetter={lockedHintLetter}
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