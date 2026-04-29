import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import formImg from '../../assets/form-img.png'
import { featuresNotice } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)

// DESIGN TOKENS — light theme with brand colors─
const BLUE = '#005280'   // --primary-blue
const RED = '#C90606'   // --primary-red
const WHITE = '#FFFFFF'
const BG = '#F7F5F1'   // warm off-white
const DARK = '#1A1A1A'   // --text-dark
const MUTED = '#666666'   // --text-light
const BORDER = 'rgba(0,82,128,0.10)'

// MAGNETIC CURSOR─
// BUG FIX: use mouseover/mouseout (which bubble correctly per element) instead of
// mouseenter/mouseleave on document. On mouseout we check relatedTarget — if it
// is still inside the same [data-cursor] element, we stay active; otherwise clear.
function MagneticDot() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: -200, y: -200 })
  const pos = useRef({ x: -200, y: -200 })
  const raf = useRef(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    // Lagged dot, direct ring
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.current.x - 5}px,${pos.current.y - 5}px)`
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${mouse.current.x - 20}px,${mouse.current.y - 20}px)`
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)

    // mouseover fires when entering ANY [data-cursor] descendant
    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (t) setLabel(t.getAttribute('data-cursor'))
    }
    // mouseout fires when leaving an element — check relatedTarget
    const onOut = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (!t) return
      // if where we moved to is still inside the same target, keep label
      if (t.contains(e.relatedTarget)) return
      setLabel('')
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  const active = Boolean(label)

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-9999 pointer-events-none hidden lg:flex items-center justify-center"
        style={{ width: 40, height: 40 }}
      >
        <div
          className="w-full h-full rounded-full border-2 flex items-center justify-center overflow-hidden"
          style={{
            borderColor: active ? RED : `${BLUE}55`,
            background: active ? `${RED}10` : 'transparent',
            transform: active ? 'scale(1.35)' : 'scale(1)',
            transition: 'border-color 0.22s, background 0.22s, transform 0.22s',
          }}
        >
          {active && (
            <span className="text-[7.5px] font-black uppercase tracking-widest px-1 whitespace-nowrap" style={{ color: RED }}>
              {label}
            </span>
          )}
        </div>
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-9999 pointer-events-none w-2.5 h-2.5 rounded-full hidden lg:block"
        style={{ background: active ? RED : BLUE, transition: 'background 0.18s' }}
      />
    </>
  )
}

// ANIMATED SVG UNDERLINE
function AnimUnderline({ color = RED, delay = 0.5 }) {
  return (
    <svg className="absolute -bottom-2 left-0 w-full overflow-visible" viewBox="0 0 300 8" preserveAspectRatio="none">
      <motion.path
        d="M2 6 Q75 2 150 5 Q225 8 298 4"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

// FEATURE ROW─
function FeatureRow({ feat, index, onClick, isActive }) {
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      data-cursor="Open"
      className="feat-row relative flex items-center cursor-none overflow-hidden"
      onClick={() => onClick(feat)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        borderBottom: `1px solid ${hovered || isActive ? `${BLUE}18` : 'rgba(0,0,0,0.07)'}`,
        paddingTop: 26,
        paddingBottom: 26,
        transition: 'border-color 0.4s ease',
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${feat.title} features`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(feat)}
    >
      {/* Active left stripe */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
        style={{ background: isActive ? RED : BLUE, transformOrigin: 'top' }}
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Hover bg sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -16 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: `linear-gradient(90deg, ${BLUE}07, transparent)` }}
      />

      {/* Index */}
      <span
        className="relative z-10 shrink-0 text-[11px] font-black tracking-[0.2em] select-none"
        style={{
          width: 44,
          color: hovered || isActive ? RED : 'rgba(0,0,0,0.18)',
          transition: 'color 0.3s',
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {num}
      </span>

      {/* Icon */}
      <motion.div
        className="relative z-10 shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mr-5"
        animate={{
          background: hovered || isActive ? `${BLUE}10` : BG,
          rotate: hovered ? 6 : 0,
          scale: hovered ? 1.08 : 1,
        }}
        style={{ border: `1px solid ${hovered || isActive ? `${BLUE}22` : 'rgba(0,0,0,0.07)'}`, transition: 'border-color 0.35s' }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        {feat.image ? (
          <img
            src={feat.image}
            alt=""
            className="w-6 h-6 object-contain"
            style={{
              filter: hovered || isActive
                ? 'invert(22%) sepia(91%) saturate(684%) hue-rotate(174deg) brightness(80%)'
                : 'grayscale(30%) opacity(0.55)',
              transition: 'filter 0.35s',
            }}
          />
        ) : (
          <span style={{ color: hovered ? BLUE : MUTED, transition: 'color 0.3s', fontSize: 16 }}>✦</span>
        )}
      </motion.div>

      {/* Text */}
      <div className="relative z-10 flex-1 min-w-0">
        <motion.h3
          className="text-[0.95rem] font-bold leading-snug truncate"
          animate={{ color: hovered || isActive ? BLUE : DARK }}
          transition={{ duration: 0.28 }}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {feat.title}
        </motion.h3>
        <motion.p
          className="text-xs mt-0.5 truncate"
          animate={{ color: hovered ? MUTED : 'rgba(0,0,0,0.32)' }}
          transition={{ duration: 0.28 }}
        >
          {Array.isArray(feat.list) ? `${feat.list.length} sub-features` : 'Feature set'}
        </motion.p>
      </div>

      {/* Status chip */}
      <motion.div
        className="relative z-10 shrink-0 ml-4 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.18em]"
        animate={{
          background: isActive ? `${RED}0E` : hovered ? `${BLUE}08` : 'rgba(0,0,0,0.04)',
          color: isActive ? RED : hovered ? BLUE : 'rgba(0,0,0,0.28)',
          borderColor: isActive ? `${RED}28` : hovered ? `${BLUE}20` : 'rgba(0,0,0,0.07)',
        }}
        style={{ border: '1px solid' }}
        transition={{ duration: 0.28 }}
      >
        {isActive && <span className="w-1 h-1 rounded-full bg-current animate-pulse" />}
        {isActive ? 'Active' : 'Explore'}
      </motion.div>

      {/* Arrow */}
      <motion.svg
        className="relative z-10 ml-4 shrink-0"
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        animate={{ stroke: hovered || isActive ? BLUE : 'rgba(0,0,0,0.22)', x: hovered ? 5 : 0, opacity: hovered || isActive ? 1 : 0.45 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </motion.svg>
    </motion.div>
  )
}

// FEATURE DRAWER──
function FeatureDrawer({ feature, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const accent = feature.accent ?? BLUE

  return (
    <motion.div
      className="fixed inset-0 z-50 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(26,26,26,0.4)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="absolute right-0 top-0 bottom-0 w-full max-w-[460px] flex flex-col overflow-hidden"
        style={{ background: WHITE, borderLeft: `1px solid ${BORDER}`, boxShadow: `-24px 0 80px rgba(0,82,128,0.10)` }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 38, mass: 0.9 }}
      >
        {/* Header */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            background: `linear-gradient(150deg, ${accent}0C 0%, ${WHITE} 100%)`,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: `${accent}0C`, filter: 'blur(40px)' }}
          />

          <div className="relative z-10 p-7 pb-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>
                Feature Overview
              </span>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' }}
                whileHover={{ scale: 1.1, background: `${RED}10`, borderColor: `${RED}22` }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close panel"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="flex items-start gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${accent}10`, border: `1px solid ${accent}22` }}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              >
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt=""
                    className="w-8 h-8 object-contain"
                    style={{
                      filter: accent === BLUE
                        ? 'invert(22%) sepia(91%) saturate(684%) hue-rotate(174deg) brightness(80%)'
                        : 'invert(13%) sepia(90%) saturate(6271%) hue-rotate(2deg) brightness(90%)',
                    }}
                  />
                ) : <span style={{ fontSize: 22 }}>✦</span>}
              </motion.div>

              <div className="pt-0.5">
                <h2
                  id="drawer-title"
                  className="text-xl font-black leading-snug"
                  style={{ color: DARK, fontFamily: "'Outfit', sans-serif" }}
                >
                  {feature.title}
                </h2>
                <p className="text-xs mt-1" style={{ color: MUTED }}>
                  {Array.isArray(feature.list) ? feature.list.length : 0} capabilities included
                </p>
              </div>
            </div>

            <div className="mt-6 h-px" style={{ background: `linear-gradient(90deg, ${accent}35, transparent)` }} />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto custom-scroll p-7 pt-5">
          <p className="text-[9px] font-black uppercase tracking-[0.26em] mb-5" style={{ color: 'rgba(0,0,0,0.28)' }}>
            Everything included
          </p>
          <ul className="space-y-2.5">
            {(feature.list ?? []).map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: BG, border: '1px solid rgba(0,0,0,0.05)' }}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.035, duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ background: `${accent}07`, borderColor: `${accent}18`, x: 4, transition: { duration: 0.22 } }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${accent}14`, border: `1px solid ${accent}25` }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span className="text-sm leading-relaxed" style={{ color: DARK }}>
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Footer CTA */}
        <div className="shrink-0 p-6" style={{ borderTop: `1px solid ${BORDER}` }}>
          <motion.a
            href="https://www.innovadorsolutions.com/?fluent-form=7"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(120deg, ${BLUE} 0%, ${RED} 160%)`,
              boxShadow: `0 10px 36px ${BLUE}25`,
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)' }}
              initial={{ x: '-150%' }}
              whileHover={{ x: '150%' }}
              transition={{ duration: 0.55 }}
            />
            <span className="relative z-10">Get Started with iSchool</span>
            <svg className="relative z-10" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  )
}

// IMAGE SHOWCASE──
function ImageShowcase() {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 28 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 28 })

  const onMouse = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouse}
      onMouseLeave={() => { mx.set(0); my.set(0) }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', perspective: 900 }}
      className="relative w-full"
    >
      {/* Main card */}
      <div
        className="relative rounded-4xl overflow-hidden"
        style={{
          background: WHITE,
          border: `1px solid ${BORDER}`,
          boxShadow: `0 28px 72px -16px ${BLUE}16, 0 0 0 1px rgba(0,82,128,0.04)`,
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-2 px-5 py-3.5"
          style={{ borderBottom: `1px solid rgba(0,0,0,0.07)`, background: BG }}
        >
          <div className="flex gap-1.5">
            {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 mx-4 h-6 rounded-md flex items-center px-3" style={{ background: 'rgba(0,0,0,0.05)' }}>
            <span className="text-[10px] font-semibold" style={{ color: 'rgba(0,0,0,0.3)' }}>
              app.ischool.io/dashboard
            </span>
          </div>
        </div>

        <motion.img
          src={formImg}
          alt="iSchool dashboard"
          className="w-full h-auto block"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${WHITE}E0, transparent)` }}
        />
      </div>

      {/* Live badge */}
      <motion.div
        className="absolute -bottom-4 -right-3 flex items-center gap-3 px-5 py-3.5 rounded-2xl"
        style={{
          background: WHITE,
          border: `1px solid ${BORDER}`,
          boxShadow: `0 10px 36px ${BLUE}12`,
          translateZ: 32,
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <div className="relative w-2 h-2">
          <div className="absolute inset-0 rounded-full" style={{ background: '#22c55e' }} />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: '#22c55e' }}
            animate={{ scale: [1, 2.8, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div>
          <p className="text-[11px] font-black" style={{ color: DARK }}>500+ Institutions Live</p>
          <p className="text-[9px]" style={{ color: MUTED }}>Updated in real-time</p>
        </div>
      </motion.div>

      {/* Rating chip */}
      <motion.div
        className="absolute -top-3 -left-2 flex items-center gap-2 px-4 py-2.5 rounded-xl"
        style={{ background: WHITE, border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <span className="text-[11px] font-black" style={{ color: '#f59e0b' }}>★ 4.98</span>
        <span className="text-[9px]" style={{ color: MUTED }}>Avg. Rating</span>
      </motion.div>
    </motion.div>
  )
}

// MAIN SECTION─
export function Features() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const [active, setActive] = useState(null)
  const close = useCallback(() => setActive(null), [])

  // Framer handles bg parallax ONLY — never touches GSAP-owned elements
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  // GSAP handles entrance animations ONLY (text + rows)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText('.feat-heading', { type: 'chars,lines' })
      gsap.set(split.chars, { opacity: 0, y: 40, rotateX: -70, transformOrigin: '0 50% -24px' })
      gsap.to(split.chars, {
        opacity: 1, y: 0, rotateX: 0,
        stagger: 0.016, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      })

      gsap.from('.feat-eyebrow', {
        opacity: 0, y: 18, duration: 0.65, ease: 'expo.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      })

      gsap.from('.feat-sub', {
        opacity: 0, y: 22, duration: 0.75, ease: 'expo.out', delay: 0.12,
        scrollTrigger: { trigger: headingRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      })

      gsap.from('.feat-row', {
        opacity: 0, x: -28, stagger: 0.065, duration: 0.75, ease: 'expo.out',
        scrollTrigger: { trigger: '.feat-list', start: 'top 80%', toggleActions: 'play none none none' },
      })

      gsap.from('.feat-img-block', {
        opacity: 0, y: 44, scale: 0.96, duration: 1.0, ease: 'expo.out',
        scrollTrigger: { trigger: '.feat-img-block', start: 'top 85%', toggleActions: 'play none none none' },
      })

      gsap.from('.feat-stat-card', {
        opacity: 0, y: 20, stagger: 0.07, duration: 0.65, ease: 'expo.out',
        scrollTrigger: { trigger: '.feat-stats', start: 'top 88%', toggleActions: 'play none none none' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <MagneticDot />

      <section
        id="features"
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ background: BG, fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Ambient bg — Framer only */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 55% 45% at 75% 35%, ${BLUE}07 0%, transparent 70%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 40% 40% at 12% 75%, ${RED}05 0%, transparent 70%)` }} />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `radial-gradient(circle, ${BLUE}18 1px, transparent 1px)`,
              backgroundSize: '44px 44px',
            }}
          />
        </motion.div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-12 lg:px-20 py-28 lg:py-40">

          {/* Header */}
          <div ref={headingRef} className="mb-16 lg:mb-24">
            <div
              className="feat-eyebrow inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-7"
              style={{ background: `${BLUE}0C`, color: BLUE, border: `1px solid ${BLUE}1E` }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: BLUE }}
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              Platform Features
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <h2
                className="feat-heading text-[2.8rem] lg:text-[4.2rem] xl:text-[4.8rem] font-black leading-[1.04] tracking-tight"
                style={{ color: DARK, fontFamily: "'Outfit', sans-serif", maxWidth: 680 }}
              >
                Simplifying school{' '}
                <span className="italic relative inline-block" style={{ color: BLUE }}>
                  management
                  <AnimUnderline delay={0.75} />
                </span>
                {' '}software.
              </h2>
              <p
                className="feat-sub text-sm leading-[1.9] lg:text-right shrink-0"
                style={{ color: MUTED, maxWidth: 280 }}
              >
                iSchool brings students, teachers, and communication together — a calm, modern experience your school relies on.
              </p>
            </div>

            {/* Divider */}
            <motion.div
              className="mt-10 h-px"
              style={{ background: `linear-gradient(90deg, ${BLUE}35, ${RED}22, transparent)`, transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Two-column */}
          <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-14 lg:gap-20 items-start">

            {/* Left: rows */}
            <div className="feat-list">
              <div
                className="flex items-center justify-between mb-1 pb-3"
                style={{ borderBottom: `1px solid rgba(0,0,0,0.07)` }}
              >
                <span className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: 'rgba(0,0,0,0.28)' }}>
                  Feature Area
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: 'rgba(0,0,0,0.28)' }}>
                  {featuresNotice.length} Modules
                </span>
              </div>

              {featuresNotice.map((feat, i) => (
                <FeatureRow
                  key={feat.title}
                  feat={feat}
                  index={i}
                  onClick={setActive}
                  isActive={active?.title === feat.title}
                />
              ))}

              <motion.p
                className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2"
                style={{ color: 'rgba(0,0,0,0.24)' }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                Click any row to explore
              </motion.p>
            </div>

            {/* Right: image + stats */}
            <div className="feat-img-block lg:sticky lg:top-28">
              <ImageShowcase />

              <div className="feat-stats mt-8 grid grid-cols-3 gap-3">
                {[
                  { val: '99.9%', label: 'Uptime SLA' },
                  { val: '50k+', label: 'Daily Users' },
                  { val: '<0.5s', label: 'Load Time' },
                ].map((s) => (
                  <motion.div
                    key={s.label}
                    className="feat-stat-card rounded-2xl p-4 text-center"
                    style={{
                      background: WHITE,
                      border: `1px solid ${BORDER}`,
                      boxShadow: '0 2px 12px rgba(0,82,128,0.05)',
                    }}
                    whileHover={{
                      background: `${BLUE}06`,
                      borderColor: `${BLUE}20`,
                      y: -4,
                      boxShadow: `0 8px 28px ${BLUE}10`,
                      transition: { duration: 0.28 },
                    }}
                  >
                    <p className="text-lg font-black" style={{ color: BLUE, fontFamily: "'Outfit', sans-serif" }}>
                      {s.val}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] mt-1" style={{ color: MUTED }}>
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drawer — outside section */}
      <AnimatePresence>
        {active && <FeatureDrawer feature={active} onClose={close} />}
      </AnimatePresence>
    </>
  )
}