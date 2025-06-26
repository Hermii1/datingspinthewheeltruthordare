'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TruthDareWheel() {
  const [result, setResult] = useState<'truth' | 'dare' | null>(null)
  const [question, setQuestion] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [currentPlayer, setCurrentPlayer] = useState<'Alex' | 'Taylor'>('Alex')

  const spinWheel = async () => {
    if (isSpinning) return
    setIsSpinning(true)
    setQuestion('')
    
    // Exactly 5 full rotations plus either 90° (truth) or 270° (dare)
    const spins = 5
    const outcome = Math.random() < 0.5 ? 90 : 270 // 50/50 chance
    const newRotation = rotation + 360 * spins + outcome
    setRotation(newRotation)

    setTimeout(async () => {
      setIsSpinning(false)
      const result = newRotation % 360 < 180 ? 'truth' : 'dare'
      setResult(result)
      
      // Switch player turn
      setCurrentPlayer(currentPlayer === 'Alex' ? 'Taylor' : 'Alex')
      
      try {
        const res = await fetch(`/api/${result}`)
        const data = await res.json()
        const randomItem = data[Math.floor(Math.random() * data.length)]
        setQuestion(result === 'truth' ? randomItem.question : randomItem.challenge)
      } catch (error) {
        setQuestion("Failed to load question. Try again!")
      }
    }, 3000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-900 to-pink-800 p-4">
      {/* Players Header */}
      <div className="flex items-center justify-center space-x-12 mb-8 w-full max-w-md">
        {/* Player 1 */}
        <div className={`flex flex-col items-center transition-all ${currentPlayer === 'Alex' ? 'scale-110' : 'scale-90 opacity-80'}`}>
          <div className={`w-20 h-20 rounded-full p-1 mb-2 ${currentPlayer === 'Alex' ? 'bg-gradient-to-br from-blue-400 to-indigo-600' : 'bg-gray-500'}`}>
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-700">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <span className={`font-medium ${currentPlayer === 'Alex' ? 'text-white text-lg' : 'text-gray-300'}`}>Alex</span>
          {currentPlayer === 'Alex' && (
            <div className="w-4 h-4 bg-rose-400 rounded-full mt-1 animate-pulse"></div>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-white text-center">Truth or Dare</h1>
        
        {/* Player 2 */}
        <div className={`flex flex-col items-center transition-all ${currentPlayer === 'Taylor' ? 'scale-110' : 'scale-90 opacity-80'}`}>
          <div className={`w-20 h-20 rounded-full p-1 mb-2 ${currentPlayer === 'Taylor' ? 'bg-gradient-to-br from-pink-400 to-rose-600' : 'bg-gray-500'}`}>
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-700">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <span className={`font-medium ${currentPlayer === 'Taylor' ? 'text-white text-lg' : 'text-gray-300'}`}>Taylor</span>
          {currentPlayer === 'Taylor' && (
            <div className="w-4 h-4 bg-rose-400 rounded-full mt-1 animate-pulse"></div>
          )}
        </div>
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
          {/* Truth Section - Larger text and better positioning */}
          <div className="absolute inset-0 flex items-center justify-start pl-8" 
            style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)', left: '10%' }}>
            <span className="text-white font-bold text-3xl rotate-[30deg] block">TRUTH</span>
          </div>
          
          {/* Dare Section - Larger text and better positioning */}
          <div className="absolute inset-0 flex items-center justify-end pr-8"
            style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)', right: '10%' }}>
            <span className="text-white font-bold text-3xl rotate-[-30deg] block">DARE</span>
          </div>

          {/* Center divider line */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-white/30 transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/30 transform -translate-y-1/2"></div>
        </motion.div>
        
        {/* Center decoration - Now clickable */}
        <div 
          className="absolute top-1/2 left-1/2 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
          onClick={spinWheel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF3E3E" className="w-full h-full hover:scale-110 transition-transform">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>
      </div>
      
      {/* Result Display */}
      {result && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md w-full text-center border border-white/20 shadow-lg">
          <div className="mb-4">
            <span className="text-white font-medium">{currentPlayer}'s turn:</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 uppercase text-rose-200">{result}</h2>
          <p className="text-lg mb-6 text-white italic">{question || 'Loading...'}</p>
          <button 
            onClick={spinWheel}
            disabled={isSpinning}
            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full text-white font-medium disabled:opacity-50 transition-all hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
          >
            {isSpinning ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Spinning...
              </>
            ) : 'Spin Again'}
          </button>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 text-center text-white/60 text-sm">
        <p>{currentPlayer}'s turn to play</p>
      </div>
    </div>
  )
}