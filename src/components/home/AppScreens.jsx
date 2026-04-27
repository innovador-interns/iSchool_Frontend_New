import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Screen1 from '../../assets/Screens-1.png'
import Screen2 from '../../assets/Screens-2.png'
import Screen3 from '../../assets/Screens-3.png'
import Screen4 from '../../assets/Screens-4.png'
import Screen5 from '../../assets/Screens-5.png'
import Screen6 from '../../assets/Screens-6.png'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const screens = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6]

// Subtle card glow per position
const GLOWS = [
  'rgba(201,6,6,0.20)',
  'rgba(0,82,128,0.18)',
  'rgba(201,6,6,0.20)',
]

function ScreenSlider() {
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(0)
  const total = screens.length

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(p => (p + 1) % total)
    }, 4200)
    return () => clearInterval(timer)
  }, [total])

  const prev = () => setActive(p => (p - 1 + total) % total)
  const next = () => setActive(p => (p + 1) % total)

  const getStyle = (i) => {
    const diff = ((i - active + total) % total)
    const normalized = diff > total / 2 ? diff - total : diff
    const positions = {
      '-2': { x: '-195%', scale: 0.55, opacity: 0, zIndex: 0, rotateY: -40 },
      '-1': { x: '-105%', scale: 0.78, opacity: 0.55, zIndex: 1, rotateY: -22 },
      '0':  { x: '0%',    scale: 1,    opacity: 1,   zIndex: 10, rotateY: 0 },
      '1':  { x: '105%',  scale: 0.78, opacity: 0.55, zIndex: 1, rotateY: 22 },
      '2':  { x: '195%',  scale: 0.55, opacity: 0,   zIndex: 0, rotateY: 40 },
    }
    const key = Math.max(-2, Math.min(2, normalized)).toString()
    return positions[key]
  }

  return (
    <div className="relative flex flex-col items-center justify-center pb-28 overflow-hidden select-none">
      {/* 3D carousel viewport */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: '580px', perspective: '1600px' }}
        onMouseDown={e => { setDragging(true); dragStart.current = e.clientX }}
        onMouseUp={e => {
          if (!dragging) return
          setDragging(false)
          const diff = e.clientX - dragStart.current
          if (diff < -48) next()
          else if (diff > 48) prev()
        }}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={e => { dragStart.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const diff = e.changedTouches[0].clientX - dragStart.current
          if (diff < -48) next()
          else if (diff > 48) prev()
        }}
      >
        {screens.map((src, i) => {
          const s = getStyle(i)
          const isActive = i === active
          return (
            <motion.div
              key={i}
              className="absolute cursor-pointer"
              animate={{
                x: s.x,
                scale: s.scale,
                opacity: s.opacity,
                zIndex: s.zIndex,
                rotateY: s.rotateY,
              }}
              transition={{
                type: 'spring',
                stiffness: 180,   // softer than before → feels weightier
                damping: 28,
                mass: 0.9,
              }}
              onClick={() => !isActive && setActive(i)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="rounded-[3rem] overflow-hidden relative"
                style={{
                  width: '252px',
                  background: '#001a2c',
                  boxShadow: isActive
                    ? `0 56px 110px -16px rgba(0,0,0,0.55), 0 0 48px ${GLOWS[i % GLOWS.length]}`
                    : '0 16px 48px rgba(0,0,0,0.28)',
                  transition: 'box-shadow 0.6s ease',
                }}
              >
                <img src={src} alt={`Screen ${i + 1}`} className="w-full h-auto block" draggable={false} />
                {/* Inactive dim overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10"
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.45 }}
                />
                {/* Active rim highlight */}
                {isActive && (
                  <div className="absolute inset-0 rounded-[3rem] ring-[1.5px] ring-white/10 pointer-events-none" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-white transition-colors duration-300 backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2.5">
          {screens.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              animate={{
                width: i === active ? 28 : 8,
                backgroundColor: i === active ? '#C90606' : 'rgba(255,255,255,0.22)',
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-[8px] rounded-full cursor-pointer"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="w-[52px] h-[52px] rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-white transition-colors duration-300 backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

// ── AppScreens Section ─────────────────────────────────────────────
export function AppScreens() {
  const sectionRef = useRef(null)

  const containerRef = useScrollReveal({
    y: 48,
    stagger: 0.14,
    duration: 1.2,
    ease: 'expo.out',
  });

  // Parallax blobs — Framer only
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const blob1Y = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const blob2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const headerY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-10%'])

  return (
    <section
      ref={(el) => {
        containerRef.current = el;
        sectionRef.current = el;
      }}
      className="overflow-hidden relative"
      style={{ background: 'linear-gradient(175deg, #001525 0%, #002a47 45%, #003a5f 100%)' }}
    >
      {/* Section transition fade from white */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

      {/* ── Background depth ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <motion.div style={{ y: blob1Y }} className="absolute top-1/4 -left-24 w-[420px] h-[420px] bg-[#C90606]/10 rounded-full blur-[100px]" />
        <motion.div style={{ y: blob2Y }} className="absolute bottom-1/4 -right-24 w-[480px] h-[480px] bg-[#005280]/20 rounded-full blur-[90px]" />
      </div>

      {/* ── Header ── */}
      <motion.div
        style={{ y: headerY }}
        className="max-w-7xl mx-auto px-6 sm:px-10 text-center pt-36 pb-12 relative z-10"
      >
        <div className="reveal-item flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/6 border border-white/12 text-[#C90606] text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C90606] animate-pulse" />
            Experience iSchool
          </span>

          <h2 className="text-4xl md:text-[4rem] font-extrabold text-white tracking-tight leading-[1.1]">
            See the App in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C90606] to-[#ff6b6b]">
              Real Action
            </span>
          </h2>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-[2.5px] bg-[#C90606] rounded-full" />
            <div className="w-3 h-[2.5px] bg-[#C90606]/40 rounded-full" />
          </div>

          <p className="text-white/50 text-[1.04rem] md:text-lg max-w-xl mx-auto leading-[1.8]">
            A beautiful, intuitive interface designed to make school management feel effortless.
          </p>
        </div>
      </motion.div>

      {/* ── Slider ── */}
      <div className="reveal-item relative z-10">
        <ScreenSlider />
      </div>
    </section>
  )
}