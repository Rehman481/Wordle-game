// src/utils/sounds.js - Sound Effects System
class SoundEffects {
  constructor() {
    this.enabled = true
    this.audioContext = null
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported')
      this.enabled = false
    }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  playTone(frequency, duration = 0.15, type = 'sine', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (error) {
      // Silently fail if sound can't play
    }
  }

  keyPress() {
    this.resume()
    this.playTone(600, 0.05, 'sine', 0.15)
  }

  correct() {
    this.resume()
    setTimeout(() => this.playTone(800, 0.1, 'sine', 0.25), 0)
    setTimeout(() => this.playTone(1000, 0.15, 'sine', 0.25), 100)
  }

  present() {
    this.resume()
    this.playTone(500, 0.08, 'sine', 0.2)
    setTimeout(() => this.playTone(700, 0.08, 'sine', 0.2), 80)
  }

  absent() {
    this.resume()
    this.playTone(200, 0.15, 'sawtooth', 0.1)
  }

  win() {
    this.resume()
    const notes = [523, 659, 784, 1047]
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note, 0.2, 'sine', 0.2)
      }, i * 150)
    })
  }

  lose() {
    this.resume()
    const notes = [523, 440, 370, 330]
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note, 0.25, 'sine', 0.2)
      }, i * 200)
    })
  }

  error() {
    this.resume()
    this.playTone(150, 0.3, 'sawtooth', 0.15)
  }

  hint() {
    this.resume()
    const notes = [600, 800, 1000, 1200]
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note, 0.08, 'sine', 0.15)
      }, i * 60)
    })
  }

  timerWarning() {
    this.resume()
    this.playTone(400, 0.05, 'sine', 0.1)
  }

  timerDanger() {
    this.resume()
    this.playTone(800, 0.1, 'square', 0.15)
  }

  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }
}

const sound = new SoundEffects()
export default sound