import React, { useEffect, useRef, useState } from 'react'
import './FlyingBee.css'

export default function FlyingBee() {
  const beeRef = useRef(null)
  const [particles, setParticles] = useState([])
  const [isHoveringClickable, setIsHoveringClickable] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Physics state
  const stateRef = useRef({
    targetX: -100,
    targetY: -100,
    currentX: -100,
    currentY: -100,
    vx: 0,
    vy: 0,
    angle: 0,
    facing: 1, // 1 = right, -1 = left
    speed: 0,
    hoverTime: 0,
    isMoving: false,
    lastMoveTime: 0,
    particleId: 0,
    hasMovedFirstTime: false
  })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const state = stateRef.current
      state.targetX = e.clientX
      state.targetY = e.clientY
      state.lastMoveTime = performance.now()
      state.isMoving = true

      if (!state.hasMovedFirstTime) {
        state.hasMovedFirstTime = true
        state.currentX = e.clientX + 40
        state.currentY = e.clientY + 40
        setIsVisible(true)
      }

      // Check if hovering interactive element
      const target = e.target
      if (target && (
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') || 
        target.closest('select') || 
        target.closest('.product-card') ||
        target.closest('.card')
      )) {
        setIsHoveringClickable(true)
      } else {
        setIsHoveringClickable(false)
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    const handleClick = (e) => {
      // Spawn burst of golden honey sparkles on click
      const count = 8
      const newParticles = []
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5)
        const speed = 25 + Math.random() * 40
        newParticles.push({
          id: ++stateRef.current.particleId,
          x: stateRef.current.currentX,
          y: stateRef.current.currentY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 4 + Math.random() * 5,
          color: Math.random() > 0.4 ? '#f59e0b' : '#fef08a',
          alpha: 1,
          isBurst: true
        })
      }
      setParticles((prev) => [...prev.slice(-25), ...newParticles])
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('click', handleClick)

    // Animation Loop
    let animationFrameId
    let lastTime = performance.now()

    const updateLoop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime

      const state = stateRef.current

      if (state.hasMovedFirstTime) {
        // Distance to target
        const dx = state.targetX - state.currentX
        const dy = state.targetY - state.currentY
        const dist = Math.hypot(dx, dy)

        // Smooth follow physics (lerp with slight organic spring)
        const followSpeed = dist > 200 ? 5.5 : 4.0
        state.vx += (dx * followSpeed - state.vx) * 0.12
        state.vy += (dy * followSpeed - state.vy) * 0.12

        state.currentX += state.vx * dt * 4.5
        state.currentY += state.vy * dt * 4.5

        state.speed = Math.hypot(state.vx, state.vy)

        // Hover bobbing when near target
        if (dist < 40) {
          state.hoverTime += dt * 5
          const bobY = Math.sin(state.hoverTime) * 0.8
          const bobX = Math.cos(state.hoverTime * 0.6) * 0.5
          state.currentX += bobX
          state.currentY += bobY
        }

        // Determine facing direction & banking angle
        if (Math.abs(state.vx) > 5) {
          state.facing = state.vx > 0 ? 1 : -1
        }

        // Target angle based on velocity
        let targetAngle = 0
        if (state.speed > 10) {
          // Angle in radians then convert to degrees
          const rawAngle = Math.atan2(state.vy, Math.abs(state.vx)) * (180 / Math.PI)
          targetAngle = Math.max(-45, Math.min(45, rawAngle * 0.6))
        }

        // Smooth angle transition
        state.angle += (targetAngle - state.angle) * 0.15

        // Update DOM element directly for 60fps+ performance
        if (beeRef.current) {
          const transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0) translate(-50%, -50%) scaleX(${state.facing}) rotate(${state.angle * state.facing}deg)`
          beeRef.current.style.transform = transform
        }

        // Spawn pollen trail particles while flying
        if (state.speed > 30 && Math.random() < 0.45) {
          const trailParticle = {
            id: ++state.particleId,
            x: state.currentX - (state.facing * 12) + (Math.random() - 0.5) * 4,
            y: state.currentY + 4 + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 12 - state.vx * 0.05,
            vy: (Math.random() - 0.5) * 12 - state.vy * 0.05,
            size: 2 + Math.random() * 2.5,
            color: Math.random() > 0.3 ? '#fbbf24' : '#fef08a',
            alpha: 0.9,
            isBurst: false
          }
          setParticles((prev) => [...prev.slice(-30), trailParticle])
        }
      }

      // Update particles
      setParticles((prevParticles) => {
        if (prevParticles.length === 0) return prevParticles
        return prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt + (p.isBurst ? 10 * dt : -5 * dt), // gentle gravity or float
            alpha: p.alpha - (p.isBurst ? 1.4 * dt : 1.1 * dt)
          }))
          .filter((p) => p.alpha > 0.05)
      })

      animationFrameId = requestAnimationFrame(updateLoop)
    }

    animationFrameId = requestAnimationFrame(updateLoop)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('click', handleClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className={`flying-bee-container ${isVisible && !isHoveringClickable ? 'visible' : ''}`} aria-hidden="true">
      {/* Particle Canvas / Golden Pollen Trail */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="pollen-particle"
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.alpha,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`
          }}
        />
      ))}

      {/* The Animated Bee */}
      <div 
        ref={beeRef} 
        className={`bee-wrapper ${isHoveringClickable ? 'excited' : ''}`}
      >
        <div className="bee-body-container">
          <svg
            className="bee-svg"
            viewBox="0 0 54 44"
            width="30"
            height="25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="beeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
                <stop offset="70%" stopColor="rgba(224, 242, 254, 0.75)" />
                <stop offset="100%" stopColor="rgba(186, 230, 253, 0.4)" />
              </linearGradient>
              <filter id="honeyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#d97706" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Back Wing */}
            <g className="bee-wing wing-back">
              <path
                d="M 23 18 C 21 8, 30 2, 38 4 C 44 6, 42 16, 28 20 Z"
                fill="url(#wingGrad)"
                stroke="rgba(255, 255, 255, 0.85)"
                strokeWidth="0.75"
              />
              <path d="M 27 16 C 31 11, 35 8, 37 6" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.5" />
            </g>

            {/* Stinger */}
            <path
              d="M 6 22 L 1 20.5 L 6 19 Z"
              fill="#1e1b18"
            />

            {/* Main Bee Body */}
            <g filter="url(#honeyGlow)">
              {/* Abdomen + Thorax (Base Golden Color) */}
              <ellipse cx="23" cy="21" rx="17" ry="12" fill="url(#beeBodyGrad)" />

              {/* Black Stripes */}
              {/* Stripe 1 */}
              <path
                d="M 12 13 C 14 11, 15 11, 17 12 C 16 17, 16 25, 17 30 C 15 31, 14 31, 12 29 C 10 24, 10 18, 12 13 Z"
                fill="#1c1917"
              />
              {/* Stripe 2 */}
              <path
                d="M 20 9.5 C 22 9.2, 24 9.5, 26 10 C 25 18, 25 24, 26 32 C 24 32.5, 22 32.8, 20 32.5 C 19 25, 19 17, 20 9.5 Z"
                fill="#1c1917"
              />
              {/* Stripe 3 */}
              <path
                d="M 29 11 C 31 12, 32 13, 33 14 C 32 20, 32 24, 33 28 C 32 29, 31 30, 29 31 C 28 24, 28 18, 29 11 Z"
                fill="#1c1917"
              />

              {/* Glossy Top Highlight */}
              <path
                d="M 14 12 C 20 10, 28 10, 33 13 C 28 11.5, 19 11.5, 14 12 Z"
                fill="rgba(255, 255, 255, 0.65)"
              />
            </g>

            {/* Head */}
            <circle cx="36" cy="21" r="7" fill="#1c1917" />
            
            {/* Cute Cheek Blush */}
            <circle cx="38" cy="24" r="2.2" fill="#fb7185" opacity="0.75" />

            {/* Cute Big Eye */}
            <ellipse cx="37.5" cy="18.5" rx="2.5" ry="3" fill="#ffffff" />
            <circle cx="38.5" cy="18.5" r="1.8" fill="#0f172a" />
            {/* Catchlight */}
            <circle cx="39.2" cy="17.5" r="0.7" fill="#ffffff" />

            {/* Antennae */}
            <path
              d="M 39 15 C 41 11, 45 9, 48 10"
              stroke="#1c1917"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="48" cy="10" r="1.3" fill="#d97706" />

            <path
              d="M 37 14 C 37 10, 39 7, 43 6"
              stroke="#1c1917"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="43" cy="6" r="1.3" fill="#d97706" />

            {/* Front Wing (Fluttering Animation) */}
            <g className="bee-wing wing-front">
              <path
                d="M 26 18 C 25 6, 36 -1, 46 2 C 52 5, 48 18, 32 21 Z"
                fill="url(#wingGrad)"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="0.8"
              />
              <path d="M 31 16 C 36 10, 42 6, 45 4" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="0.6" />
              <path d="M 33 17 C 40 13, 44 11, 46 9" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
