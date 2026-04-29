import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lists } from './data'

gsap.registerPlugin(ScrollTrigger)

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const BLUE = '#005280'
const RED = '#C90606'
const CREAM = '#F7F5F0'
const DARK = '#0A0A0F'

// ─── CARD ICONS (inline SVG fallback if no img) ──────────────────────────────
const ACCENT_COLORS = [
  { bg: `${BLUE}12`, border: `${BLUE}20`, text: BLUE, glow: `${BLUE}30` },
  { bg: `${RED}10`, border: `${RED}18`, text: RED, glow: `${RED}28` },
  { bg: '#0A0A0F10', border: '#0A0A0F18', text: DARK, glow: '#0A0A0F20' },
  { bg: `${BLUE}0C`, border: `${BLUE}15`, text: BLUE, glow: `${BLUE}25` },
  { bg: `${RED}08`, border: `${RED}14`, text: RED, glow: `${RED}22` },
  { bg: `${BLUE}10`, border: `${BLUE}18`, text: BLUE, glow: `${BLUE}28` },
]

// ─── FLOATING PARTICLE ────────────────────────────────────────────────────────
function Particle({ x, y, size, color, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

// ─── FEATURE CARD ────────────────────────────────────────────────────────────
function FeatureCard({ item, index, isActive }) {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length]
  const num = String(index + 1).padStart(2, '0')
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative shrink-0 w-[340px] lg:w-[380px] h-[380px] lg:h-[380px] cursor-default"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -12 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow behind card */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="absolute -inset-4 rounded-[44px] blur-2xl pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${accent.glow} 0%, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      {/* Card body */}
      <div
        className="relative w-full h-full rounded-[36px] flex flex-col overflow-hidden"
        style={{
          background: hovered
            ? `linear-gradient(145deg, white 0%, ${accent.bg} 100%)`
            : 'white',
          border: `1px solid ${hovered ? accent.border : 'rgba(0,0,0,0.07)'}`,
          boxShadow: hovered
            ? `0 32px 80px ${accent.glow}, 0 2px 0 ${accent.border} inset`
            : '0 4px 24px rgba(0,0,0,0.04)',
          transition: 'background 0.5s ease, border 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {/* Top accent bar */}
        <motion.div
          className="absolute top-0 left-0 h-[3px] rounded-t-[36px]"
          animate={{ width: hovered ? '100%' : '0%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: `linear-gradient(90deg, ${RED}, ${BLUE})` }}
        />

        {/* Card number — watermark */}
        <div
          className="absolute top-5 right-7 text-[6.5rem] font-black leading-none select-none pointer-events-none transition-all duration-500"
          style={{ color: hovered ? `${accent.text}08` : 'rgba(0,0,0,0.035)' }}
        >
          {num}
        </div>

        <div className="flex flex-col h-full p-10">
          {/* Icon */}
          <motion.div
            className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center mb-auto shrink-0"
            animate={{
              rotate: hovered ? 8 : 0,
              scale: hovered ? 1.08 : 1,
              background: hovered ? accent.bg : 'rgba(0,0,0,0.04)',
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ border: `1px solid ${hovered ? accent.border : 'transparent'}` }}
          >
            {item.img ? (
              <img
                src={item.img}
                alt={item.title}
                className="w-9 h-9 object-contain"
                style={{ filter: hovered ? `drop-shadow(0 0 8px ${accent.glow})` : 'none', transition: 'filter 0.4s' }}
              />
            ) : (
              <span className="text-2xl">{['🏫', '📡', '🔐', '📊', '🎓', '⚡'][index % 6]}</span>
            )}
          </motion.div>

          {/* Separator */}
          <motion.div
            className="my-7 h-px"
            style={{ background: `linear-gradient(90deg, ${hovered ? accent.border : 'rgba(0,0,0,0.06)'}, transparent)` }}
            transition={{ duration: 0.4 }}
          />

          {/* Text */}
          <div className="mt-auto">
            {/* Index pill */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
              style={{
                background: hovered ? accent.bg : 'rgba(0,0,0,0.04)',
                color: hovered ? accent.text : '#999',
                border: `1px solid ${hovered ? accent.border : 'transparent'}`,
                transition: 'all 0.4s ease',
              }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: hovered ? accent.text : '#bbb', transition: 'background 0.4s' }}
              />
              Feature {num}
            </div>

            <h3
              className="text-[1.3rem] font-bold leading-snug mb-3 transition-colors duration-300"
              style={{ color: hovered ? accent.text : '#1A1A1A' }}
            >
              {item.title}
            </h3>
            <p className="text-md leading-normal" style={{ color: '#777' }}>
              {item.desc}
            </p>
          </div>

          {/* CTA arrow */}
          {/* <motion.div
            className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: accent.text }}
          >
            Learn more
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div> */}
        </div>
      </div>
    </motion.div>
  )
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export function WhyISchool() {
  const wrapperRef = useRef(null)
  const stickyRef = useRef(null)
  const trackRef = useRef(null)
  const headingRef = useRef(null)
  const progressBarRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Framer scroll for background parallax ONLY
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ── GSAP horizontal scroll pin (desktop only)
  useLayoutEffect(() => {
    if (isMobile) return

    const track = trackRef.current
    const sticky = stickyRef.current
    const wrapper = wrapperRef.current
    if (!track || !sticky || !wrapper) return

    const getAmount = () => track.scrollWidth - sticky.offsetWidth

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${getAmount() + window.innerHeight * 0.5}`,
          scrub: 1.2,
          pin: sticky,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress)
            const idx = Math.floor(self.progress * lists.length)
            setActiveIndex(Math.min(idx, lists.length - 1))
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })

      tl.to(track, {
        x: () => -(getAmount()),
        ease: 'none',
      })

      // Heading parallax (Framer handles bg, GSAP handles heading text x-drift)
      gsap.from(headingRef.current?.querySelectorAll('.gsap-word') ?? [], {
        opacity: 0,
        y: 50,
        stagger: 0.08,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    })

    return () => ctx.revert()
  }, [isMobile, lists.length])

  // Mobile: simple reveal
  useLayoutEffect(() => {
    if (!isMobile) return
    const ctx = gsap.context(() => {
      gsap.from('.mobile-card', {
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.mobile-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
    })
    return () => ctx.revert()
  }, [isMobile])

  const progressPct = Math.round(progress * 100)

  return (
    <div ref={wrapperRef} id="whyischool" className="relative">

      {/* ── Ambient BG layer (Framer only, doesn't touch scroll-pinned elements) */}
      <motion.div
        style={{ y: bgY, opacity: bgOpacity }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div style={{ background: `radial-gradient(ellipse 60% 50% at 15% 50%, ${BLUE}08 0%, transparent 70%)` }} className="absolute inset-0" />
        <div style={{ background: `radial-gradient(ellipse 50% 50% at 85% 60%, ${RED}06 0%, transparent 70%)` }} className="absolute inset-0" />
      </motion.div>

      {/* DESKTOP */}
      {!isMobile && (
        <div
          ref={stickyRef}
          className="relative w-full h-screen overflow-hidden"
          style={{ background: CREAM }}
        >
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,82,128,0.08) 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
            }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <Particle x={10} y={20} size={6} color={`${BLUE}30`} delay={0} />
            <Particle x={85} y={15} size={4} color={`${RED}30`} delay={1} />
            <Particle x={70} y={75} size={8} color={`${BLUE}20`} delay={2} />
            <Particle x={25} y={80} size={5} color={`${RED}20`} delay={0.5} />
            <Particle x={50} y={10} size={4} color={`${BLUE}25`} delay={1.5} />
          </div>

          {/* ── Top strip */}
          <div
            className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-12"
            style={{ height: 52, borderBottom: '1px solid rgba(0,0,0,0.07)', background: CREAM }}
          >
            <span className="text-[10px] font-bold tracking-[0.32em] uppercase" style={{ color: '#aaa' }}>
              iSchool — Why Choose Us
            </span>
            <div className="flex items-center gap-6">
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {lists.map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    animate={{
                      width: i === activeIndex ? 20 : 6,
                      background: i === activeIndex ? BLUE : 'rgba(0,82,128,0.2)',
                    }}
                    style={{ height: 6 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: '#999' }}>
                <motion.span
                  className="w-2 h-2 rounded-full"
                  style={{ background: RED }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                {lists.length} Reasons
              </div>
            </div>
          </div>

          {/* ── Left panel */}
          <div
            className="absolute left-0 top-[52px] bottom-0 z-20 flex flex-col justify-between"
            style={{
              width: 360,
              padding: '52px 44px',
              borderRight: '1px solid rgba(0,0,0,0.07)',
              background: `linear-gradient(160deg, white 0%, ${CREAM} 100%)`,
            }}
          >
            {/* Decorative vertical line */}
            <div
              className="absolute top-0 right-0 w-px h-full"
              style={{ background: `linear-gradient(to bottom, transparent, ${BLUE}20, ${RED}15, transparent)` }}
            />

            <div ref={headingRef}>
              <div className="flex items-center gap-2.5 mb-7">
                <div className="w-7 h-px" style={{ background: RED }} />
                <span className="text-[10px] font-bold tracking-[0.24em] uppercase" style={{ color: RED }}>
                  Distinction
                </span>
              </div>

              <h2
                className="leading-[1.07] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.2rem, 3vw, 3.4rem)', color: DARK }}
              >
                <span className="gsap-word block">Why Educational</span>
                <span className="gsap-word block">Leaders</span>
                <span className="gsap-word block italic relative" style={{ color: BLUE }}>
                  Choose iSchool
                  <svg className="absolute -bottom-1.5 left-0 w-full overflow-visible" viewBox="0 0 260 8" preserveAspectRatio="none">
                    <motion.path
                      d="M2 6 Q65 2 130 5 Q195 8 258 4"
                      fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>
                </span>
              </h2>

              <p className="text-md leading-normal" style={{ color: '#666', maxWidth: 260 }}>
                Discover why institutions worldwide trust iSchool to transform their administrative and academic horizons.
              </p>
            </div>

            {/* Bottom controls */}
            <div className="flex flex-col gap-5">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-2 text-[10px] tracking-widest font-bold" style={{ color: '#bbb' }}>
                  <span>Exploring</span>
                  <motion.span style={{ color: BLUE }}>
                    {progressPct}%
                  </motion.span>
                </div>
                <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                  <div
                    ref={progressBarRef}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${BLUE}, ${RED})`,
                      transformOrigin: 'left',
                      transform: 'scaleX(0)',
                      transition: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Card counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: '#aaa' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Scroll to explore
                  </motion.div>
                </div>
                <span
                  className="text-[13px] font-black"
                  style={{ color: BLUE }}
                >
                  {String(activeIndex + 1).padStart(2, '0')} / {String(lists.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: horizontal card track */}
          <div
            className="absolute top-[52px] bottom-0 overflow-hidden"
            style={{ left: 360, right: 0 }}
          >
            {/* Edge fades */}
            <div
              className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
              style={{ background: `linear-gradient(to right, ${CREAM}, transparent)` }}
            />
            <div
              className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
              style={{ background: `linear-gradient(to left, ${CREAM}, transparent)` }}
            />

            {/* The scrolling track — GSAP moves this via x */}
            <div
              ref={trackRef}
              className="flex items-center gap-8 h-full will-change-transform"
              style={{ paddingLeft: 80, paddingRight: 80 }}
            >
              {lists.map((item, i) => (
                <FeatureCard key={i} item={item} index={i} isActive={i === activeIndex} />
              ))}

              {/* End card */}
              <motion.div
                className="shrink-0 w-[300px] h-[500px] lg:h-[540px] rounded-[36px] flex flex-col items-center justify-center gap-6 cursor-default"
                style={{
                  background: `linear-gradient(135deg, ${BLUE} 0%, ${DARK} 100%)`,
                  border: `1px solid ${BLUE}30`,
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center px-10">
                  <div className="text-5xl mb-5">🚀</div>
                  <h3 className="text-2xl font-black text-white mb-3">
                    Ready to transform?
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-8">
                    Join 500+ institutions already experiencing the iSchool difference.
                  </p>
                  <motion.a
                    href="https://www.innovadorsolutions.com/?fluent-form=7"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold"
                    style={{ background: 'white', color: BLUE }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    Get Started
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE */}
      {isMobile && (
        <section
          className="relative py-24 px-5 overflow-hidden"
          style={{ background: CREAM }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, ${BLUE}12 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />

          {/* Header */}
          <div className="relative z-10 text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-5" style={{ background: `${RED}10`, color: RED, border: `1px solid ${RED}18` }}>
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: RED }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              Distinction
            </div>
            <h2
              className="text-[2.6rem] font-black leading-[1.07] tracking-tight mb-4"
              style={{ color: DARK }}
            >
              Why Leaders Choose{' '}
              <span className="italic relative inline-block" style={{ color: BLUE }}>
                iSchool
                <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 120 8" preserveAspectRatio="none">
                  <motion.path
                    d="M2 6 Q30 2 60 5 Q90 8 118 4"
                    fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </span>
            </h2>
            <p className="text-sm leading-[1.85] mx-auto" style={{ color: '#777', maxWidth: 300 }}>
              Discover why educational institutions worldwide trust iSchool to transform their horizons.
            </p>
          </div>

          {/* Mobile cards — vertical grid */}
          <div className="mobile-grid relative z-10 flex flex-col gap-5">
            {lists.map((item, i) => (
              <motion.div
                key={i}
                className="mobile-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <FeatureCard item={item} index={i} isActive={false} />
              </motion.div>
            ))}
          </div>

          {/* Mobile CTA */}
          <motion.div
            className="relative z-10 mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.a
              href="https://www.innovadorsolutions.com/?fluent-form=7"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${BLUE}, ${DARK})`, boxShadow: `0 16px 48px ${BLUE}30` }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Today
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
        </section>
      )}
    </div>
  )
}