import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Screen1 from '../../assets/Screens-1.png'
import Screen2 from '../../assets/Screens-2.png'
import Screen3 from '../../assets/Screens-3.png'
import Screen4 from '../../assets/Screens-4.png'
import Screen5 from '../../assets/Screens-5.png'
import Screen6 from '../../assets/Screens-6.png'
import { SectionReveal } from './SectionReveal'
import { fadeInUp } from '../../lib/animations'

const screens = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6]

function ScreenSlider() {
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(0)
  const total = screens.length

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(p => (p + 1) % total)
    }, 3200)
    return () => clearInterval(timer)
  }, [total])

  const prev = () => setActive(p => (p - 1 + total) % total)
  const next = () => setActive(p => (p + 1) % total)

  const getStyle = (i) => {
    const diff = ((i - active + total) % total)
    const normalized = diff > total / 2 ? diff - total : diff

    const positions = {
      '-2': { x: '-160%', scale: 0.62, opacity: 0, zIndex: 0, rotateY: -30 },
      '-1': { x: '-100%', scale: 0.78, opacity: 0.55, zIndex: 1, rotateY: -18 },
      '0': { x: '0%', scale: 1, opacity: 1, zIndex: 5, rotateY: 0 },
      '1': { x: '100%', scale: 0.78, opacity: 0.55, zIndex: 1, rotateY: 18 },
      '2': { x: '160%', scale: 0.62, opacity: 0, zIndex: 0, rotateY: 30 },
    }
    const key = Math.max(-2, Math.min(2, normalized)).toString()
    return positions[key]
  }

  return (
    <div className="relative flex flex-col items-center justify-center pb-16 overflow-hidden">
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: '500px', perspective: '1200px' }}
        onMouseDown={e => { setDragging(true); dragStart.current = e.clientX }}
        onMouseUp={e => {
          if (!dragging) return
          setDragging(false)
          const diff = e.clientX - dragStart.current
          if (diff < -40) next()
          else if (diff > 40) prev()
        }}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={e => { dragStart.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const diff = e.changedTouches[0].clientX - dragStart.current
          if (diff < -40) next()
          else if (diff > 40) prev()
        }}
      >
        {screens.map((src, i) => {
          const s = getStyle(i)
          return (
            <motion.div
              key={i}
              className="absolute cursor-pointer select-none"
              animate={{ x: s.x, scale: s.scale, opacity: s.opacity, zIndex: s.zIndex, rotateY: s.rotateY }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              onClick={() => i !== active && setActive(i)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="rounded-[2.5rem] overflow-hidden shadow-2xl ring-2 ring-white/20"
                style={{
                  width: '220px',
                  background: '#001a2c',
                  boxShadow: i === active
                    ? '0 30px 80px rgba(0,82,128,0.55), 0 0 0 2px rgba(255,255,255,0.15)'
                    : '0 10px 40px rgba(0,0,0,0.3)',
                }}
              >
                <img src={src} alt={`Screen ${i + 1}`} className="w-full h-auto block" draggable={false} />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center gap-6">
        <button onClick={prev} className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors backdrop-blur">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex gap-2">
          {screens.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300"
              style={{
                width: i === active ? 28 : 8,
                height: 8,
                borderRadius: 99,
                background: i === active ? '#fff' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
        <button onClick={next} className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors backdrop-blur">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function AppScreens() {
  return (
    <section
      className="overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #001e33 0%, #003a5f 50%, #005280 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 text-center pt-20">
        <SectionReveal>
          <motion.span variants={fadeInUp} className="text-white/50 text-xs uppercase tracking-[0.2em] font-bold">
            App Screens
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl font-black text-white mt-2">
            See iSchool in Action
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/50 text-sm mt-3 max-w-md mx-auto">
            Swipe or use the arrows to explore our beautiful, intuitive app screens designed for every user.
          </motion.p>
        </SectionReveal>
      </div>
      <ScreenSlider />
    </section>
  )
}
