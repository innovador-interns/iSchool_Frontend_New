import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Screen1 from '../../assets/Screens-1.png'
import Screen2 from '../../assets/Screens-2.png'
import Screen3 from '../../assets/Screens-3.png'
import Screen4 from '../../assets/Screens-4.png'
import Screen5 from '../../assets/Screens-5.png'
import Screen6 from '../../assets/Screens-6.png'

gsap.registerPlugin(ScrollTrigger, SplitText)

// TOKENS
const BLUE = '#005280'
const RED = '#C90606'
const WHITE = '#FFFFFF'
const BG = '#F2EFE9'          // warm parchment light
const DARK = '#0F0F0F'
const MUTED = '#666666'
const BORDER = 'rgba(0,82,128,0.10)'

// Screen metadata — label + caption shown in left panel
const SCREENS = [
  { src: Screen1, label: 'Dashboard', caption: 'Your institution at a glance — attendance, grades & alerts in one unified view.', tag: 'Overview' },
  { src: Screen2, label: 'Notifications', caption: 'Push critical updates to students, parents and staff instantly with zero friction.', tag: 'Comms' },
  { src: Screen3, label: 'Attendance', caption: 'Mark and monitor attendance in real-time with automated absence alerts to parents.', tag: 'Tracking' },
  { src: Screen4, label: 'Gradebook', caption: 'Beautiful grade entry with trend analysis and instant parent-facing report generation.', tag: 'Academics' },
  { src: Screen5, label: 'Scheduling', caption: 'Drag-and-drop timetable builder with conflict detection and one-tap teacher substitution.', tag: 'Planning' },
  { src: Screen6, label: 'Analytics', caption: 'Deep institutional analytics with cohort comparisons, growth curves and export to PDF.', tag: 'Insights' },
]

// Layout config for each screen — arranged in a top-centered arc (semi-circle) with overlaps
// [left%, top%, rotate, zIndex, scale, parallaxFactor]
const FLOAT_LAYOUT = [
  [26, 15, -18, 1, 0.85, 0.18], // Far left
  [34, 12, -10, 2, 0.92, 0.24], // Mid left
  [42, 9, -4, 3, 1.0, 0.30], // Center-left
  [49, 9, 4, 3, 1.0, 0.30], // Center-right
  [57, 11, 10, 2, 0.92, 0.24], // Mid right
  [65, 15, 18, 1, 0.85, 0.18], // Far right
]


// NOISE SVG TEXTURE
function Noise({ opacity = 0.028 }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden style={{ opacity }}>
      <filter id="appnoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#appnoise)" />
    </svg>
  )
}

// ANIMATED SVG UNDERLINE
function Underline({ color = RED, delay = 0.4 }) {
  return (
    <svg className="absolute -bottom-2 left-0 w-full overflow-visible" viewBox="0 0 300 8" preserveAspectRatio="none">
      <motion.path
        d="M2 6 Q75 2 150 5 Q225 8 298 4"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

// PHONE FRAME
// A beautifully styled floating phone card
function PhoneCard({ screen, layoutIdx, isActive, onClick, onHover }) {
  const [hov, setHov] = useState(false)
  const [l, t, rot, z, sc] = FLOAT_LAYOUT[layoutIdx]

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        transformOrigin: 'center bottom',
      }}
      data-screen={layoutIdx}
      animate={{
        rotate: hov ? 0 : rot,
        scale: hov ? sc * 1.06 : isActive ? sc * 1.04 : sc,
        y: hov ? -12 : 0,
      }}
      transition={{ type: 'spring', stiffness: 160, damping: 22, mass: 0.8 }}
      onHoverStart={() => { setHov(true); onHover(layoutIdx); onClick(layoutIdx) }}
      onHoverEnd={() => { setHov(false); onHover(null) }}
      onClick={() => onClick(layoutIdx)}
    >
      {/* Outer glow when active */}
      <AnimatePresence>
        {(isActive || hov) && (
          <motion.div
            className="absolute -inset-4 rounded-[3.5rem] pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${layoutIdx % 2 === 0 ? RED : BLUE}20 0%, transparent 70%)` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* Phone shell */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 168,
          borderRadius: 40,
          background: '#0a0a0a',
          border: `1.5px solid ${isActive || hov ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'}`,
          boxShadow: isActive || hov
            ? `0 40px 80px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)`
            : `0 18px 48px -8px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10)`,
          transition: 'box-shadow 0.5s ease, border-color 0.4s ease',
        }}
      >
        {/* Status bar notch */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: 28, background: '#0a0a0a' }}
        >
          <div className="w-20 h-4 rounded-full" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }} />
        </div>

        {/* Screenshot */}
        <img
          src={screen.src}
          alt={screen.label}
          className="w-full h-auto block"
          draggable={false}
          style={{ imageRendering: 'crisp-edges' }}
        />

        {/* Dim overlay for inactive */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          animate={{ opacity: isActive || hov ? 0 : 1 }}
          transition={{ duration: 0.45 }}
        />

        {/* Glass sheen on active */}
        {(isActive || hov) && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }}
          />
        )}

        {/* Home bar */}
        <div className="flex justify-center py-2.5" style={{ background: '#0a0a0a' }}>
          <div className="w-24 h-[5px] rounded-full" style={{ background: 'rgba(255,255,255,0.22)' }} />
        </div>
      </div>

      {/* Screen label chip below phone */}
      <motion.div
        className="mt-3 mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]"
        animate={{
          opacity: isActive || hov ? 1 : 0,
          y: isActive || hov ? 0 : 8,
          background: isActive ? RED : BLUE,
          color: WHITE,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 'fit-content' }}
      >
        {screen.tag}
      </motion.div>
    </motion.div>
  )
}

// MAIN SECTION
export function AppScreens() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const scatterRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  // Mobile slider state
  const [sliderIdx, setSliderIdx] = useState(0)
  const autoRef = useRef(null)

  const activeScreen = SCREENS[activeIdx]

  // Mobile autoplay
  useEffect(() => {
    if (!isMobile) return
    autoRef.current = setInterval(() => {
      setSliderIdx(p => (p + 1) % SCREENS.length)
    }, 3800)
    return () => clearInterval(autoRef.current)
  }, [isMobile])

  useEffect(() => {
    const chk = () => setIsMobile(window.innerWidth < 768)
    chk()
    window.addEventListener('resize', chk)
    return () => window.removeEventListener('resize', chk)
  }, [])

  // Auto-cycle active screen on desktop — Pause if user is hovering
  useEffect(() => {
    if (isMobile || hoveredIdx !== null) return
    const t = setInterval(() => setActiveIdx(p => (p + 1) % SCREENS.length), 3600)
    return () => clearInterval(t)
  }, [isMobile, hoveredIdx])

  // Framer scroll for parallax bg
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY1 = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const bgY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  // GSAP: heading + panel reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sp = new SplitText('.app-heading', { type: 'chars' })
      gsap.set(sp.chars, { opacity: 0, y: 32, rotateX: -60, transformOrigin: '0 50% -16px' })
      gsap.to(sp.chars, {
        opacity: 1, y: 0, rotateX: 0,
        stagger: 0.013, duration: 0.72, ease: 'expo.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      })
      gsap.from('.app-eyebrow', {
        opacity: 0, y: 14, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 86%', toggleActions: 'play none none none' },
      })
      gsap.from('.app-sub', {
        opacity: 0, y: 20, duration: 0.7, ease: 'expo.out', delay: 0.1,
        scrollTrigger: { trigger: headingRef.current, start: 'top 83%', toggleActions: 'play none none none' },
      })
      // Left panel fade in
      gsap.from('.app-panel', {
        opacity: 0, x: -32, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: scatterRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      })
      // Phones stagger in
      gsap.from('.app-phone', {
        opacity: 0, y: 60, scale: 0.85,
        stagger: 0.1,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: scatterRef.current, start: 'top 78%', toggleActions: 'play none none none' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [isMobile])

  // Individual phone parallax on scroll (desktop only) — Framer transforms per layer
  // We need separate useTransform per phone — create them at top level
  const pfy = [
    useTransform(scrollYProgress, [0, 1], ['0%', `${FLOAT_LAYOUT[0][5] * -120}%`]),
    useTransform(scrollYProgress, [0, 1], ['0%', `${FLOAT_LAYOUT[1][5] * -120}%`]),
    useTransform(scrollYProgress, [0, 1], ['0%', `${FLOAT_LAYOUT[2][5] * -120}%`]),
    useTransform(scrollYProgress, [0, 1], ['0%', `${FLOAT_LAYOUT[3][5] * -120}%`]),
    useTransform(scrollYProgress, [0, 1], ['0%', `${FLOAT_LAYOUT[4][5] * -120}%`]),
    useTransform(scrollYProgress, [0, 1], ['0%', `${FLOAT_LAYOUT[5][5] * -120}%`]),
  ]

  const prev = () => setSliderIdx(p => (p - 1 + SCREENS.length) % SCREENS.length)
  const next = () => setSliderIdx(p => (p + 1) % SCREENS.length)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: BG }}
    >
      <Noise />

      {/* Ambient bg */}
      <motion.div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{ y: bgY1, background: `radial-gradient(circle, ${BLUE}07 0%, transparent 70%)` }}
        />
        <motion.div
          style={{ y: bgY2 }}
          className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full"
        />
      </motion.div>

      {/* Fixed color blobs (Framer y-parallax) */}
      <motion.div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none" style={{ y: bgY1, background: `${BLUE}07`, filter: 'blur(80px)' }} />
      <motion.div className="absolute bottom-1/3 -right-24 w-80 h-80 rounded-full pointer-events-none" style={{ y: bgY2, background: `${RED}08`, filter: 'blur(70px)' }} />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.18]"
        style={{
          backgroundImage: `radial-gradient(circle, ${BLUE}22 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Section HEADER */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-14 lg:px-20 pt-28 lg:pt-24">
        <div ref={headingRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-4">

          <div className="flex flex-col gap-6">
            {/* Eyebrow */}
            <div
              className="app-eyebrow inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.22em] w-fit"
              style={{ background: `${BLUE}0C`, color: BLUE, border: `1px solid ${BLUE}1E` }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: BLUE }}
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              App Experience
            </div>

            {/* Heading */}
            <h2
              className="app-heading text-4xl lg:text-5xl font-black leading-[1.03] tracking-tight"
              style={{ color: DARK, fontFamily: "'Outfit',sans-serif", maxWidth: 660 }}
            >
              See iSchool in{' '}
              <span className="italic relative inline-block" style={{ color: BLUE }}>
                real action
                <Underline delay={0.7} />
              </span>
            </h2>
          </div>

          <p
            className="app-sub text-sm leading-[1.9] shrink-0 lg:text-right"
            style={{ color: MUTED, maxWidth: 280 }}
          >
            A beautiful, intuitive mobile interface designed to make school management feel completely effortless.
          </p>
        </div>

        {/* Gradient rule */}
        <motion.div
          className="h-px mt-8 mb-0"
          style={{ background: `linear-gradient(90deg, ${BLUE}35, ${RED}22, transparent)`, transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* DESKTOP: FLOATING SCATTER + LEFT PANEL */}
      <div className={isMobile ? 'hidden' : 'block'}>
        <div
          ref={scatterRef}
          className="relative z-10 max-w-[1360px] min-h-[640px] mx-auto px-6 sm:px-14 lg:px-20 pt-14"
        >
          {/*LEFT sticky info panel */}
          {/* <div
            className="app-panel lg:sticky lg:top-28 absolute left-6 sm:left-14 lg:left-20 top-16 z-30 flex flex-col gap-6"
            style={{ maxWidth: 280 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="text-[3rem] font-black leading-none"
                style={{ color: RED, fontFamily: "'Outfit',sans-serif", fontVariantNumeric: 'tabular-nums' }}
              >
                {String(activeIdx + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.24em]" style={{ color: 'rgba(0,0,0,0.28)' }}>
                  of {String(SCREENS.length).padStart(2, '0')} screens
                </div>
                <div
                  className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.18em]"
                  style={{ background: `${RED}10`, color: RED, border: `1px solid ${RED}20` }}
                >
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: RED }} />
                  {activeScreen.tag}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3
                  className="text-[2rem] font-black leading-[1.08] tracking-tight mb-3"
                  style={{ color: DARK, fontFamily: "'Outfit',sans-serif" }}
                >
                  {activeScreen.label}
                </h3>
                <p className="text-sm leading-[1.85]" style={{ color: MUTED }}>
                  {activeScreen.caption}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 pt-2">
              {SCREENS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  animate={{
                    width:      i === activeIdx ? 28 : 8,
                    background: i === activeIdx ? RED : 'rgba(0,0,0,0.18)',
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-2 rounded-full cursor-pointer"
                />
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <motion.button
                onClick={() => setActiveIdx(p => (p - 1 + SCREENS.length) % SCREENS.length)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: WHITE, border: `1px solid ${BORDER}`, boxShadow: `0 4px 16px rgba(0,82,128,0.08)` }}
                whileHover={{ scale: 1.1, x: -2, boxShadow: `0 6px 24px rgba(0,82,128,0.14)` }}
                whileTap={{ scale: 0.92 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => setActiveIdx(p => (p + 1) % SCREENS.length)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: WHITE, border: `1px solid ${BORDER}`, boxShadow: `0 4px 16px rgba(0,82,128,0.08)` }}
                whileHover={{ scale: 1.1, x: 2, boxShadow: `0 6px 24px rgba(0,82,128,0.14)` }}
                whileTap={{ scale: 0.92 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(0,0,0,0.28)' }}>
                or hover a screen
              </span>
            </div>
          </div> */}

          {/*FLOATING PHONE SCATTER — positioned absolutely in the container */}
          <div
            className="absolute inset-0 pointer-events-none"
          // style={{ left: '24%' }}
          >
            {SCREENS.map((screen, i) => (
              <motion.div
                key={i}
                className="app-phone absolute pointer-events-auto"
                style={{
                  left: `${FLOAT_LAYOUT[i][0]}%`,
                  top: `${FLOAT_LAYOUT[i][1]}%`,
                  y: pfy[i],
                  zIndex: (hoveredIdx !== null ? hoveredIdx === i : activeIdx === i) ? 100 : FLOAT_LAYOUT[i][3],
                }}
              >
                <PhoneCard
                  screen={screen}
                  layoutIdx={i}
                  isActive={(hoveredIdx !== null ? hoveredIdx === i : activeIdx === i)}
                  onClick={setActiveIdx}
                  onHover={setHoveredIdx}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE: ELEGANT VERTICAL SLIDER */}
      <div className={isMobile ? 'block' : 'hidden'}>
        <div className="relative z-10 pt-12 pb-20 px-5">

          {/* Phone showcase */}
          <div className="relative flex items-center justify-center" style={{ height: 520 }}>
            {SCREENS.map((screen, i) => {
              const offset = i - sliderIdx
              const visible = Math.abs(offset) <= 1
              if (!visible && Math.abs(offset) > 1.5) return null
              const isActive = offset === 0
              const isSide = Math.abs(offset) === 1
              return (
                <motion.div
                  key={i}
                  className="absolute cursor-pointer"
                  animate={{
                    x: `${offset * 85}%`,
                    scale: isActive ? 1 : 0.8,
                    opacity: isActive ? 1 : 0.45,
                    rotateY: offset * 20,
                    zIndex: isActive ? 10 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                  onClick={() => setSliderIdx(i)}
                  style={{ transformStyle: 'preserve-3d', perspective: 900 }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: 195,
                      borderRadius: 42,
                      background: '#0a0a0a',
                      border: `1.5px solid ${isActive ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
                      boxShadow: isActive
                        ? `0 32px 60px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)`
                        : `0 12px 32px rgba(0,0,0,0.15)`,
                    }}
                  >
                    <div className="flex items-center justify-center" style={{ height: 24, background: '#0a0a0a' }}>
                      <div className="w-16 h-3 rounded-full" style={{ background: '#1a1a1a' }} />
                    </div>
                    <img src={screen.src} alt={screen.label} className="w-full h-auto block" draggable={false} />
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'rgba(0,0,0,0.35)' }}
                      animate={{ opacity: isActive ? 0 : 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="flex justify-center py-2" style={{ background: '#0a0a0a' }}>
                      <div className="w-20 h-[5px] rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Active info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={sliderIdx}
              className="text-center px-4 mb-8"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3"
                style={{ background: `${RED}0E`, color: RED, border: `1px solid ${RED}20` }}
              >
                <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: RED }} />
                {SCREENS[sliderIdx].tag}
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2" style={{ color: DARK, fontFamily: "'Outfit',sans-serif" }}>
                {SCREENS[sliderIdx].label}
              </h3>
              <p className="text-sm leading-[1.8]" style={{ color: MUTED }}>
                {SCREENS[sliderIdx].caption}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <motion.button
              onClick={prev}
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: WHITE, border: `1px solid ${BORDER}`, boxShadow: `0 4px 16px rgba(0,82,128,0.08)` }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>

            <div className="flex items-center gap-2">
              {SCREENS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSliderIdx(i)}
                  animate={{ width: i === sliderIdx ? 28 : 8, background: i === sliderIdx ? RED : 'rgba(0,0,0,0.18)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-2 rounded-full"
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: WHITE, border: `1px solid ${BORDER}`, boxShadow: `0 4px 16px rgba(0,82,128,0.08)` }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}