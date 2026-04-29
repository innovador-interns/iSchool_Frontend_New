import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Zap, ShieldCheck, BarChart3 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, SplitText)

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const BRAND = '#005280'
const ACCENT = '#C90606'

const STATS = [
  { value: '500+', label: 'Institutions', sub: 'Worldwide partners' },
  { value: '98%', label: 'Satisfaction', sub: 'Client retention rate' },
  { value: '50k+', label: 'Active Users', sub: 'Daily learners' },
  { value: '10+', label: 'Years', sub: 'Of excellence' },
]

const FEATURES = [
  { icon: <Zap size={20} strokeWidth={2.5} />, text: 'Real-time broadcast across your entire institution' },
  { icon: <ShieldCheck size={20} strokeWidth={2.5} />, text: 'Enterprise-grade security & compliance built-in' },
  { icon: <BarChart3 size={20} strokeWidth={2.5} />, text: 'Deep analytics for data-driven decisions' },
]

// ─── 3D FLOATING CARD COMPONENT ──────────────────────────────────────────────
function Card3D({ children, className = '', intensity = 15 }) {
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 200, damping: 30
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 200, damping: 30
  })
  const glare = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 1]), {
    stiffness: 200, damping: 30
  })

  const handleMouse = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-4xl pointer-events-none"
        style={{
          background: useTransform(
            glare,
            [0, 1],
            ['radial-gradient(circle at 0% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
             'radial-gradient(circle at 100% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)']
          )
        }}
      />
    </motion.div>
  )
}

// ─── ORBITING RING COMPONENT ──────────────────────────────────────────────────
function OrbitRing({ radius, duration, dotCount, color, reverse = false }) {
  const angle = useMotionValue(0)

  useAnimationFrame((t) => {
    const dir = reverse ? -1 : 1
    angle.set((t / (duration * 1000)) * 360 * dir)
  })

  return (
    <div
      className="absolute rounded-full border border-dashed"
      style={{
        width: radius * 2,
        height: radius * 2,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderColor: `${color}30`,
      }}
    >
      {Array.from({ length: dotCount }).map((_, i) => {
        const theta = (i / dotCount) * 2 * Math.PI
        const x = Math.cos(theta) * radius
        const y = Math.sin(theta) * radius
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              background: color,
              top: '50%',
              left: '50%',
              x: x - 3,
              y: y - 3,
              rotate: angle,
              opacity: 0.6,
            }}
          />
        )
      })}
    </div>
  )
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function AnimatedCounter({ value, inView }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9]/g, '')
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.floor(eased * numericValue))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, numericValue])

  return <span>{display}{suffix}</span>
}

// ─── MAIN ABOUT SECTION ───────────────────────────────────────────────────────
export function About() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const imageRef = useRef(null)
  const [statsInView, setStatsInView] = useState(false)

  // ── Framer Motion scroll for parallax (NOT used for GSAP-handled elements)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imgParallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 0.96])
  const orbitOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  // ── GSAP handles text reveals ONLY (no conflict with Framer)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading character-by-character
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: 'chars,words' })
        gsap.from(split.chars, {
          opacity: 0,
          y: 60,
          rotateX: -90,
          transformOrigin: '0% 50% -50px',
          stagger: 0.022,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Stats inview trigger for counters
      if (document.querySelector('.gsap-stats')) {
        ScrollTrigger.create({
          trigger: '.gsap-stats',
          start: 'top 80%',
          onEnter: () => setStatsInView(true),
        })
      }

      // Floating badge pop
      gsap.from('.gsap-badge', {
        opacity: 0,
        scale: 0.6,
        y: 30,
        duration: 0.9,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.gsap-badge',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-32 lg:py-44 overflow-hidden bg-[#F8F6F1]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Ambient background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, ${BRAND} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 20% 40%, ${BRAND}0C 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[50%] h-[50%]"
          style={{
            background: `radial-gradient(ellipse 70% 70% at 70% 70%, ${ACCENT}08 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* ── Vertical label */}
      <div
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center gap-3 -rotate-90 origin-center"
        style={{ color: `${BRAND}40` }}
      >
        <div className="w-16 h-px bg-current" />
        <span className="text-[10px] tracking-[0.3em] font-bold uppercase whitespace-nowrap">Our Story</span>
      </div>

      {/* ── Main layout */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-24 grid lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-center">

        {/* ── LEFT: Image side */}
        <div className="relative flex justify-center lg:justify-start">

          {/* 3D Orbit system */}
          <motion.div
            style={{ opacity: orbitOpacity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <OrbitRing radius={220} duration={12} dotCount={8} color={BRAND} />
            <OrbitRing radius={160} duration={8} dotCount={5} color={ACCENT} reverse />
            <OrbitRing radius={290} duration={20} dotCount={12} color={BRAND} reverse />
          </motion.div>

          {/* Main image card */}
          <Card3D
            className="relative w-full max-w-[550px] mx-auto lg:mx-0 cursor-none"
            intensity={12}
          >
            <div className="relative overflow-hidden rounded-4xl border border-white/60 shadow-[0_40px_120px_-20px_rgba(0,82,128,0.22),0_0_0_1px_rgba(0,82,128,0.06)]">
              {/* Image */}
              <motion.div
                ref={imageRef}
                style={{ y: imgParallaxY, scale: imgScale }}
                className="will-change-transform"
              >
                <img
                  src="/src/assets/about-img.png"
                  alt="iSchool Education Platform"
                  className="w-full max-h-[480px] object-cover block object-center rounded-4xl"
                />
              </motion.div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(160deg, transparent 50%, ${BRAND}22 100%)`,
                }}
              />

              {/* Corner accent */}
              <div
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${ACCENT}15`, backdropFilter: 'blur(10px)', border: `1px solid ${ACCENT}30` }}
              >
                <div className="w-2 h-2 rounded-full animate-ping" style={{ background: ACCENT }} />
              </div>
            </div>

            {/* Decorative frame */}
            <div
              className="absolute -z-10 inset-0 rounded-[2.5rem] translate-x-5 translate-y-5"
              style={{ border: `2px dashed ${BRAND}18` }}
            />
          </Card3D>

          {/* Floating stat badge */}
          <motion.div
            className="gsap-badge absolute -bottom-4 -right-4 lg:-right-10 z-20"
            whileHover={{ y: -6, scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Card3D intensity={20}>
              <div
                className="px-7 py-5 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: `0 20px 60px -10px ${BRAND}25, 0 0 0 1px ${BRAND}10`,
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})` }}
                />
                <p className="text-5xl font-black leading-none" style={{ color: BRAND, fontFamily: 'DM Serif Display, serif' }}>10+</p>
                <p className="text-[9px] uppercase tracking-[0.22em] font-bold mt-1.5" style={{ color: '#999' }}>Years of Excellence</p>
              </div>
            </Card3D>
          </motion.div>

          {/* Secondary floating chip */}
          <motion.div
            className="absolute -top-5 -right-2 lg:-right-6 z-20"
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.08 }}
          >
            <div
              className="px-4 py-2.5 rounded-full flex items-center gap-2.5"
              style={{
                background: 'white',
                boxShadow: `0 8px 24px ${BRAND}18, 0 0 0 1px ${BRAND}10`,
              }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
              <span className="text-xs font-bold" style={{ color: BRAND }}>500+ Institutions Online</span>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Content side */}
        <div className="lg:pl-20 xl:pl-28 flex flex-col gap-8">

          {/* Eyebrow tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em]"
              style={{
                background: `${BRAND}0C`,
                color: BRAND,
                border: `1px solid ${BRAND}18`,
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: BRAND }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              Legacy of Innovation
            </div>
          </motion.div>

          {/* Heading — GSAP SplitText controlled, NOT Framer */}
          <div>
            <h2
              ref={headingRef}
              className="text-[2.8rem] lg:text-[3.8rem] xl:text-[4.4rem] font-black leading-[1.04] tracking-tight"
              style={{ color: '#0F0F0F', fontFamily: 'DM Serif Display, serif' }}
            >
              Welcome to {' '}
              <span className="relative inline-block" style={{ color: BRAND }}>
                iSchool
                <svg className="absolute -bottom-2 left-0 w-full overflow-visible" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <motion.path
                    d="M2 7 C50 2, 100 9, 150 5 C175 3, 195 6, 198 7"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </span>
            </h2>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
            className="flex items-center gap-2"
          >
            <div className="h-[3px] w-14 rounded-full" style={{ background: ACCENT }} />
            <div className="h-[3px] w-4 rounded-full" style={{ background: `${ACCENT}40` }} />
            <div className="h-[3px] w-2 rounded-full" style={{ background: `${ACCENT}20` }} />
          </motion.div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <p className="text-[1.05rem] leading-[1.85]" style={{ color: '#555' }}>
              iSchool Mobile App empowers management and educators to broadcast critical updates instantly,
              ensuring a seamless flow of information across your institution.
            </p>
            <p className="text-[1.05rem] leading-[1.85]" style={{ color: '#777' }}>
              Discover a world of simplicity, efficiency, and enhanced communication — built for the schools of tomorrow.
            </p>
          </motion.div>

          {/* Feature list — GSAP controlled */}
          {/* <div className="gsap-features space-y-3 pt-1">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="gsap-feature flex items-start gap-4 px-5 py-4 rounded-2xl group cursor-default"
                style={{
                  background: 'white',
                  border: `1px solid ${BRAND}0C`,
                  boxShadow: `0 2px 12px ${BRAND}06`,
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 30px ${BRAND}14, 0 0 0 1px ${BRAND}15`
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = `0 2px 12px ${BRAND}06`
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${BRAND}08` }}
                >
                  {f.icon}
                </div>
                <p className="text-sm leading-relaxed font-medium pt-1.5" style={{ color: '#444' }}>
                  {f.text}
                </p>
              </div>
            ))}
          </div> */}

          {/* Stats — counters */}
          <div className="gsap-stats grid grid-cols-2 sm:grid-cols-2 gap-4 pt-2">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="relative overflow-hidden rounded-2xl p-5 cursor-default"
                style={{
                  background: i % 2 === 0 ? `${BRAND}05` : 'white',
                  border: `1px solid ${BRAND}0F`,
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-0.5 rounded-t-2xl"
                  style={{ background: i === 0 ? `linear-gradient(90deg, ${BRAND}, ${BRAND}00)` : 'transparent' }}
                />
                <p className="text-3xl font-black leading-none" style={{ color: BRAND, fontFamily: 'DM Serif Display, serif' }}>
                  <AnimatedCounter value={s.value} inView={statsInView} />
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mt-1.5" style={{ color: '#999' }}>
                  {s.label}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: '#bbb' }}>{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <motion.a
              href="https://www.innovadorsolutions.com/?fluent-form=7"
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-sm overflow-hidden"
              style={{
                background: BRAND,
                boxShadow: `0 14px 40px ${BRAND}35`,
              }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.span
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)`,
                }}
                initial={{ x: '-200%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <span className="relative z-10">Learn More About Us</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>

            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-sm"
              style={{
                background: 'white',
                color: BRAND,
                border: `1.5px solid ${BRAND}20`,
                boxShadow: `0 4px 20px ${BRAND}08`,
              }}
              whileHover={{ scale: 1.04, y: -2, borderColor: BRAND }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Get a Demo
            </motion.a>
          </motion.div> */}
        </div>
      </div>

      {/* ── Bottom scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        <div className="text-[9px] uppercase tracking-[0.28em] font-bold" style={{ color: `${BRAND}50` }}>Scroll</div>
        <div className="w-px h-8 rounded-full overflow-hidden" style={{ background: `${BRAND}18` }}>
          <motion.div
            className="w-full rounded-full"
            style={{ background: BRAND, height: '40%' }}
            animate={{ y: ['-100%', '300%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}