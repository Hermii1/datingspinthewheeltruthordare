'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Head from 'next/head'

export default function TruthDareWheel() {
  // Game states
  const [showIntro, setShowIntro] = useState(true)
  const [result, setResult] = useState<'truth' | 'dare' | null>(null)
  const [question, setQuestion] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1')
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [showAd, setShowAd] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  // Name editing states
  const [editingNames, setEditingNames] = useState(false)
  const [playerNames, setPlayerNames] = useState({ player1: 'Player 1', player2: 'Player 2' })
  const player1InputRef = useRef<HTMLInputElement>(null)
  const player2InputRef = useRef<HTMLInputElement>(null)

  // Game rules
  const gameRules = [
    "1. Players take turns spinning the wheel",
    "2. Answer truthfully or complete the dare",
    "3. Get +1 point for answering, 0 for skipping",
    "4. First to 10 points wins!",
    "5. Have fun and be respectful!"
  ]

  // Toggle name editing
  const toggleNameEditing = () => {
    if (editingNames) {
      // We're finishing editing, so reset empty names
      setPlayerNames(prev => ({
        player1: prev.player1.trim() || 'Player 1',
        player2: prev.player2.trim() || 'Player 2',
      }))
    } else {
      // We're starting to edit, focus the current player
      setTimeout(() => {
        currentPlayer === 'player1'
          ? player1InputRef.current?.focus()
          : player2InputRef.current?.focus()
      }, 100)
    }
    setEditingNames(!editingNames)
  }

  // Handle name change
  const handleNameChange = (player: 'player1' | 'player2', name: string) => {
    setPlayerNames(prev => ({
      ...prev,
      [player]: name // allow empty while editing
    }))
  }

  // Spin wheel function
  const spinWheel = async () => {
    if (isSpinning || winner) return
    setIsSpinning(true)
    setQuestion('')
    setAnswered(false)

    // 5 full rotations plus either 90° (truth) or 270° (dare)
    const spins = 5
    const outcome = Math.random() < 0.5 ? 90 : 270
    const newRotation = rotation + 360 * spins + outcome
    setRotation(newRotation)

    setTimeout(async () => {
      setIsSpinning(false)
      const result = newRotation % 360 < 180 ? 'truth' : 'dare'
      setResult(result)

      try {
        const res = await fetch(`/api/${result}`)
        const data = await res.json()
        const randomItem = data[Math.floor(Math.random() * data.length)]
        setQuestion(result === 'truth' ? randomItem.question : randomItem.challenge)

        // Show ad after 30% of spins
        if (Math.random() < 0.3) {
          setTimeout(() => setShowAd(true), 2000)
        }
      } catch (error) {
        setQuestion("Failed to load question. Try again!")
      }
    }, 3000)
  }

  // Handle answer
  const handleAnswer = (action: 'answered' | 'skipped') => {
    if (answered || winner) return

    setAnswered(true)
    if (action === 'answered') {
      setScores(prev => {
        const updated = {
          ...prev,
          [currentPlayer]: prev[currentPlayer] + 1
        }
        // Check for winner
        if (updated[currentPlayer] >= 10) {
          setWinner(playerNames[currentPlayer] || (currentPlayer === 'player1' ? 'Player 1' : 'Player 2'))
        }
        return updated
      })
    }

    // Switch player after delay (only if no winner)
    setTimeout(() => {
      if (!winner) {
        setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1')
        setResult(null)
      }
    }, 1500)
  }

  // Close ad
  const closeAd = () => {
    setShowAd(false)
  }

  // Reset game after win
  const resetGame = () => {
    setScores({ player1: 0, player2: 0 })
    setWinner(null)
    setResult(null)
    setShowIntro(true)
    setAnswered(false)
    setRotation(0)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-900 to-pink-800 p-4">
      {/* SEO Metadata */}
      <Head>
        <title>Truth or Dare Spin Wheel Game</title>
        <meta name="description" content="Play fun truth or dare with friends! Spin the wheel and get exciting challenges." />
        <meta name="keywords" content="truth or dare, party game, spin the wheel, friends game" />
      </Head>

      {/* Introduction Screen */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-xl"
            >
              <h1 className="text-4xl font-bold text-center text-rose-200 mb-6">Truth or Dare</h1>

              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold text-white mb-2">Game Rules:</h2>
                <ul className="space-y-2 text-white/90">
                  {gameRules.map((rule, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowIntro(false)}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full text-white font-medium hover:scale-105 transition-transform"
              >
                Continue to Game
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winner Celebration Modal */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-white rounded-xl p-8 max-w-md w-full text-center relative"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <h2 className="text-3xl font-bold text-rose-600 mb-4">🎉 Congratulations! 🎉</h2>
              <p className="text-xl text-gray-800 mb-6">{winner} wins the game!</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Players Header with Scores */}
      <div className="flex items-center justify-center space-x-12 mb-8 w-full max-w-md relative">
        {/* Player 1 */}
        <div className={`flex flex-col items-center transition-all ${currentPlayer === 'player1' ? 'scale-110' : 'scale-90 opacity-80'}`}>
          <div className={`w-20 h-20 rounded-full p-1 mb-2 ${currentPlayer === 'player1' ? 'bg-gradient-to-br from-blue-400 to-indigo-600' : 'bg-gray-500'}`}>
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-700">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {editingNames ? (
            <input
              ref={player1InputRef}
              type="text"
              value={playerNames.player1}
              onChange={(e) => handleNameChange('player1', e.target.value)}
              className="bg-transparent border-b border-white/50 text-white text-center w-24 focus:outline-none focus:border-white"
              maxLength={12}
            />
          ) : (
            <span className={`font-medium ${currentPlayer === 'player1' ? 'text-white text-lg' : 'text-gray-300'}`}>
              {playerNames.player1 || 'Player 1'}
            </span>
          )}

          <span className="text-rose-300 font-bold mt-1">{scores.player1}</span>
        </div>

        <h1 className="text-4xl font-bold text-white text-center">Truth or Dare</h1>

        {/* Player 2 */}
        <div className={`flex flex-col items-center transition-all ${currentPlayer === 'player2' ? 'scale-110' : 'scale-90 opacity-80'}`}>
          <div className={`w-20 h-20 rounded-full p-1 mb-2 ${currentPlayer === 'player2' ? 'bg-gradient-to-br from-pink-400 to-rose-600' : 'bg-gray-500'}`}>
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-700">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {editingNames ? (
            <input
              ref={player2InputRef}
              type="text"
              value={playerNames.player2}
              onChange={(e) => handleNameChange('player2', e.target.value)}
              className="bg-transparent border-b border-white/50 text-white text-center w-24 focus:outline-none focus:border-white"
              maxLength={12}
            />
          ) : (
            <span className={`font-medium ${currentPlayer === 'player2' ? 'text-white text-lg' : 'text-gray-300'}`}>
              {playerNames.player2 || 'Player 2'}
            </span>
          )}

          <span className="text-rose-300 font-bold mt-1">{scores.player2}</span>
        </div>

        {/* Edit button (pencil icon) */}
        <button
          onClick={toggleNameEditing}
          className="absolute top-0 right-0 p-1 text-white/70 hover:text-white transition-colors"
          aria-label={editingNames ? "Save names" : "Edit names"}
        >
          {editingNames ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
              <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
            </svg>
          )}
        </button>
      </div>

      {/* Wheel Container */}
      <div className="relative w-72 h-72 mb-12">
        {/* Heart pointer */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>

        {/* Wheel - perfectly balanced 50/50 */}
        <motion.div
          className="absolute w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/20"
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: [0.65, 0, 0.35, 1] }}
          style={{
            background: 'conic-gradient(#FF8E8E 0deg 180deg, #FFB6C1 180deg 360deg)'
          }}
        >
          {/* Truth Section */}
          <div className="absolute inset-0 flex items-center justify-start pl-8"
            style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)', left: '10%' }}>
            <span className="text-white font-bold text-3xl rotate-[30deg] block">TRUTH</span>
          </div>

          {/* Dare Section */}
          <div className="absolute inset-0 flex items-center justify-end pr-8"
            style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)', right: '10%' }}>
            <span className="text-white font-bold text-3xl rotate-[-30deg] block">DARE</span>
          </div>

          {/* Center divider lines */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-white/30 transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/30 transform -translate-y-1/2"></div>
        </motion.div>

        {/* Center decoration - Clickable */}
        <div
          className="absolute top-1/2 left-1/2 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
          onClick={spinWheel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF3E3E" className="w-full h-full hover:scale-110 transition-transform">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>
      </div>

      {/* Result Display with Answer Controls */}
      {result && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md w-full text-center border border-white/20 shadow-lg mb-8">
          <div className="mb-4">
            <span className="text-white font-medium">{playerNames[currentPlayer] || (currentPlayer === 'player1' ? 'Player 1' : 'Player 2')}'s turn:</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 uppercase text-rose-200">{result}</h2>
          <p className="text-lg mb-6 text-white italic">{question || 'Loading...'}</p>

          {!answered ? (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleAnswer('answered')}
                className="px-6 py-2 bg-green-500 rounded-full text-white font-medium hover:scale-105 transition-transform"
              >
                Answered (+1)
              </button>
              <button
                onClick={() => handleAnswer('skipped')}
                className="px-6 py-2 bg-rose-500 rounded-full text-white font-medium hover:scale-105 transition-transform"
              >
                Skipped (0)
              </button>
            </div>
          ) : (
            <p className="text-green-300 font-medium">Score updated!</p>
          )}
        </div>
      )}

      {/* Spin Button when no result showing */}
      {!result && !showIntro && !winner && (
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full text-white font-medium disabled:opacity-50 transition-all hover:scale-105 shadow-lg mb-8"
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
      )}

      {/* Ad Popup */}
      <AnimatePresence>
        {showAd && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full relative"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <button
                onClick={closeAd}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-center mb-4">Sponsored Content</h3>
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                <span className="text-gray-500">Advertisement Space</span>
              </div>
              <p className="text-center text-gray-600 mb-4">
                Support our game by checking out our sponsors!
              </p>
              <button
                onClick={closeAd}
                className="w-full py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
              >
                Continue Playing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center text-white/60 text-sm">
        <p>{playerNames[currentPlayer] || (currentPlayer === 'player1' ? 'Player 1' : 'Player 2')}'s turn to play</p>
        <p className="mt-2">First to 10 points wins!</p>
      </div>
    </div>
  )
}