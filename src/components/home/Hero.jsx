/**
 * HERO SECTION — iSchool
 * ──────────────────────
 * Awwwards-level cinematic hero using:
 *  • Project theme colors: --primary-red #C90606, --primary-blue #005280
 *  • Tailwind CSS (no inline styles)
 *  • data.js features array
 *  • Framer Motion: scroll parallax, spring physics, staggered reveals
 *  • GSAP: cursor glow, magnetic buttons
 *  • CSS: 3D perspective, morphing blob, split-text word reveal
 */

import React, { useEffect, useRef, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion"
import gsap from "gsap"
import { features } from "./data"

/* ── Spring config ── */
const SPRING = { stiffness: 80, damping: 20, mass: 0.8 }
const FAST_SPRING = { stiffness: 200, damping: 30 }

/* ── Easing ── */
const EXPO = [0.16, 1, 0.3, 1]

/* ────────────────────────────────────────────
   WORD REVEAL — 3D flip-up from baseline
──────────────────────────────────────────── */
function WordReveal({ text, delay = 0, className = "" }) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "115%", rotateX: -90, opacity: 0 }}
          animate={{ y: 0, rotateX: 0, opacity: 1 }}
          transition={{ duration: 1.1, delay: delay + i * 0.1, ease: EXPO }}
          className="inline-block mr-[0.2em] origin-bottom"
          style={{ transformStyle: "preserve-3d", perspective: 400 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

/* ────────────────────────────────────────────
   FEATURE CARD — glassmorphic with hover 3D
──────────────────────────────────────────── */
function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)

  /* 3D tilt on hover */
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const sRotX = useSpring(rotX, FAST_SPRING)
  const sRotY = useSpring(rotY, FAST_SPRING)

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotX.set(((e.clientY - cy) / (rect.height / 2)) * -8)
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 8)
  }
  const handleMouseLeave = () => {
    rotX.set(0)
    rotY.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, scale: 0.8, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, delay: index * 0.15, ease: EXPO }}
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        transformStyle: "preserve-3d",
        perspective: 600,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="
        group relative p-6 rounded-2xl cursor-pointer
        bg-white/80 border border-slate-200
        backdrop-blur-xl overflow-hidden shadow-sm
        transition-shadow duration-500 hover:shadow-xl hover:shadow-[#005280]/5
      "
    >
      {/* Red accent glow on hover */}
      <div
        className={`
          absolute inset-0 rounded-2xl transition-opacity duration-500
          bg-gradient-to-br from-[#C90606]/10 via-transparent to-[#005280]/5
          ${hovered ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Top border accent — animates on hover */}
      <div
        className={`
          absolute top-0 left-0 h-[3px] rounded-full
          bg-gradient-to-r from-[#C90606] to-[#005280]
          transition-all duration-700
          ${hovered ? "w-full" : "w-0"}
        `}
      />

      <div
        className="relative z-10 flex flex-col items-center text-center gap-4"
        style={{ transform: "translateZ(20px)" }}
      >
        {/* Icon container */}
        <div
          className={`
            w-16 h-16 rounded-xl flex items-center justify-center
            bg-slate-50 border border-slate-100 shadow-sm
            transition-all duration-500
            ${hovered ? "bg-[#C90606]/10 border-[#C90606]/30 shadow-[0_0_20px_rgba(201,6,6,0.15)]" : ""}
          `}
        >
          <img
            src={feature.img}
            alt={feature.title}
            className="h-9 w-9 object-contain"
          />
        </div>

        <div>
          <h3 className="font-semibold text-base text-slate-900 leading-tight mb-1">
            {feature.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {feature.subTitle}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   MAGNETIC CTA BUTTON
──────────────────────────────────────────── */
function MagneticButton({ children, primary = false, delay = 0, onClick }) {
  const btnRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 15 })
  const sy = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15)
  }
  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={btnRef}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay, ease: EXPO }}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`
        group relative flex items-center gap-2 px-8 py-4 rounded-xl
        font-semibold text-sm tracking-wide overflow-hidden
        transition-shadow duration-300 cursor-pointer
        ${primary
          ? "bg-gradient-to-r from-[#C90606] to-[#a50505] text-white border border-[#C90606]/50 shadow-[0_0_24px_rgba(201,6,6,0.3)] hover:shadow-[0_0_48px_rgba(201,6,6,0.5)]"
          : "bg-white text-[#005280] border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-[#005280]/20"
        }
      `}
    >
      {/* Shimmer sweep */}
      <span
        className={`
          absolute inset-0 translate-x-[-100%] group-hover:translate-x-[200%]
          transition-transform duration-700 ease-in-out
          bg-gradient-to-r from-transparent via-white/30 to-transparent
          pointer-events-none
        `}
      />
      {children}
    </motion.button>
  )
}

/* ────────────────────────────────────────────
   ANIMATED COUNTER
──────────────────────────────────────────── */
function Counter({ to, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(to / 60)
    const timer = setInterval(() => {
      start = Math.min(start + step, to)
      setCount(start)
      if (start >= to) clearInterval(timer)
    }, 24)
    return () => clearInterval(timer)
  }, [to])
  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

/* ────────────────────────────────────────────
   MAIN HERO
──────────────────────────────────────────── */
export function Hero() {
  const containerRef = useRef(null)
  const glowRef = useRef(null)

  /* Mouse tracking → spring values */
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mouseX = useSpring(rawX, SPRING)
  const mouseY = useSpring(rawY, SPRING)

  /* Scroll parallax */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  /* Smooth scroll spring for buttery performance */
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 })

  /* Parallax transforms */
  const headY = useTransform(smoothScroll, [0, 0.5], [0, -40])
  const headScale = useTransform(smoothScroll, [0, 0.4], [1, 0.95])
  const headOpacity = useTransform(smoothScroll, [0, 0.3], [1, 0])
  const headRotX = useTransform(smoothScroll, [0, 0.4], [0, 5])
  const blobY = useTransform(smoothScroll, [0, 1], [0, -80])
  const blobOpacity = useTransform(smoothScroll, [0, 0.4], [1, 0])
  const bgY = useTransform(smoothScroll, [0, 1], [0, 100])

  /* Orb mouse parallax */
  const orb1X = useTransform(mouseX, [-600, 600], [-30, 30])
  const orb1Y = useTransform(mouseY, [-400, 400], [-20, 20])
  const orb2X = useTransform(mouseX, [-600, 600], [20, -20])

  /* GSAP cursor glow */
  useEffect(() => {
    const el = containerRef.current
    const glow = glowRef.current
    if (!el || !glow) return
    const xTo = gsap.quickTo(glow, "x", { duration: 0.5, ease: "power3" })
    const yTo = gsap.quickTo(glow, "y", { duration: 0.5, ease: "power3" })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo(e.clientX - r.left - 250)
      yTo(e.clientY - r.top - 250)
      rawX.set(e.clientX - window.innerWidth / 2)
      rawY.set(e.clientY - window.innerHeight / 2)
    }
    el.addEventListener("mousemove", move)
    return () => el.removeEventListener("mousemove", move)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative bg-[#f8fafc] text-slate-900 overflow-hidden font-['Outfit',sans-serif]"
      style={{ perspective: "1200px" }}
    >

      {/* ── BACKGROUND LAYER (parallax slow) ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">

        {/* Primary blue orb */}
        <motion.div
          className="absolute rounded-full"
          animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 700, height: 700,
            top: "-20%", left: "-18%",
            background: "radial-gradient(circle, rgba(0,82,128,0.4) 0%, transparent 70%)",
            x: orb1X, y: orb1Y,
            willChange: "transform",
          }}
        />

        {/* Red accent orb */}
        <motion.div
          className="absolute rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            width: 550, height: 550,
            top: "5%", right: "-12%",
            background: "radial-gradient(circle, rgba(201,6,6,0.3) 0%, transparent 70%)",
            x: orb2X,
            willChange: "transform",
          }}
        />

        {/* Teal-blue bottom orb */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            bottom: "-10%", left: "20%",
            background: "radial-gradient(circle, rgba(0,82,128,0.25) 0%, transparent 70%)",
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── PERSPECTIVE GRID ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,82,128,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,82,128,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      {/* ── GSAP CURSOR GLOW ── */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(circle, rgba(201,6,6,0.05), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ════════════════════════════════════
          HERO CONTENT
      ════════════════════════════════════ */}
      <div className="relative min-h-screen flex items-center justify-center pt-14 pb-20 z-10">
        <motion.div
          style={{
            scale: headScale,
            y: headY,
            opacity: headOpacity,
            rotateX: headRotX,
            transformStyle: "preserve-3d",
          }}
          className="w-full max-w-7xl mx-auto px-6 lg:px-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* ── LEFT TEXT ── */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: EXPO }}
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8
                  border border-[#005280]/20 bg-white/60 shadow-sm backdrop-blur-xl
                "
              >
                <span className="
                  w-2 h-2 rounded-full bg-[#C90606]
                  shadow-[0_0_10px_rgba(201,6,6,0.5)]
                  animate-[pulse_2s_ease-in-out_infinite]
                " />
                <span className="text-[11px] font-semibold text-[#005280] uppercase tracking-widest">
                  Next-Gen School ERP Platform
                </span>
              </motion.div>

              {/* Headline */}
              <h1
                className="font-black leading-none tracking-tighter mb-7"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Line 1 */}
                <span className="block text-6xl text-slate-900 overflow-hidden">
                  <WordReveal text="Revolutionize" delay={0.4} />
                  {" "}
                  <WordReveal text="School" delay={0.5} />
                </span>

                {/* Line 2 — kinetic gradient */}
                <span
                  className="block text-6xl font-black overflow-hidden"
                >
                  <WordReveal text="Management" delay={0.6} />
                </span>
              </h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.1, delay: 1.1, ease: EXPO }}
                className="text-[17px] leading-relaxed text-slate-600 max-w-md mb-10 font-light"
              >
                iSchool unifies academics, administration, communication and finance into one{" "}
                <span className="text-slate-800 font-semibold">intelligent platform</span> — built for the modern institution.
              </motion.p>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12">
                <MagneticButton primary delay={1.25}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 8h6M9 6l2 2-2 2" />
                  </svg>
                  Get Started Free
                </MagneticButton>

                <MagneticButton delay={1.4}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="7" />
                    <polygon points="6.5 5 11 8 6.5 11" fill="currentColor" stroke="none" />
                  </svg>
                  Watch Demo
                </MagneticButton>
              </div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.9, ease: EXPO }}
                className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8"
              >
                {[
                  { val: 2400, suffix: "+", label: "Institutions" },
                  { val: 99.9, suffix: "%", label: "Uptime SLA", prefix: "" },
                  { val: 150, suffix: "k+", label: "Students" },
                ].map((s, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="w-px h-8 bg-slate-200" />}
                    <div>
                      <div className="text-2xl font-black bg-gradient-to-r from-[#005280] to-slate-500 bg-clip-text text-transparent">
                        <Counter to={Math.round(s.val)} suffix={s.suffix} prefix={s.prefix || ""} />
                      </div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: 3D BLOB + FLOATING CARDS ── */}
            <div className="relative flex items-center justify-center h-[350px] sm:h-[450px] lg:h-[560px] transform scale-75 sm:scale-90 lg:scale-100 mt-10 lg:mt-0">

              {/* Floating stat card 1 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8, duration: 0.9, ease: EXPO }}
                className="
                  absolute top-[6%] left-[0%] z-20
                  px-4 py-3 rounded-2xl shadow-xl
                  bg-white/80 border border-[#C90606]/20
                  backdrop-blur-2xl
                "
                style={{ animation: "floatA 5s ease-in-out infinite" }}
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Attendance Today</div>
                <div className="text-xl font-black text-slate-900">96.4%</div>
                <div className="text-[11px] font-bold text-[#005280] mt-0.5">▲ +1.2% vs yesterday</div>
              </motion.div>

              {/* Floating stat card 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.0, duration: 0.9, ease: EXPO }}
                className="
                  absolute bottom-[12%] right-[-4%] z-20
                  px-4 py-3 rounded-2xl shadow-xl
                  bg-white/80 border border-[#005280]/20
                  backdrop-blur-2xl
                "
                style={{ animation: "floatB 7s ease-in-out 1s infinite" }}
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Revenue MTD</div>
                <div className="text-xl font-black text-slate-900">$84,291</div>
                <div className="flex gap-1 items-end mt-2 h-5">
                  {[40, 60, 45, 80, 65, 95, 100].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-sm bg-[#005280]"
                      style={{ height: `${h}%`, opacity: 0.3 + i * 0.1, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Floating stat card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.9, ease: EXPO }}
                className="
                  absolute bottom-[22%] left-[-6%] z-20
                  px-4 py-3 rounded-2xl shadow-xl
                  bg-white/80 border border-slate-200
                  backdrop-blur-2xl
                "
                style={{ animation: "floatA 6s ease-in-out 2s infinite" }}
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Active Students</div>
                <div className="text-xl font-black text-slate-900">3,241</div>
                <div className="text-[11px] font-bold text-[#C90606] mt-0.5">▲ +12% this term</div>
              </motion.div>

              {/* 3D MORPHING BLOB */}
              <motion.div
                style={{ y: blobY, opacity: blobOpacity }}
                className="relative"
              >
                <motion.div
                  animate={{
                    rotateX: [0, 4, -3, 0],
                    rotateY: [0, -6, 5, 0],
                    y: [0, -18, 10, 0],
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Outer orbit ring 1 */}
                  <div
                    className="absolute top-1/2 left-1/2 rounded-full border border-[#005280]/20"
                    style={{
                      width: 380, height: 380,
                      transform: "translate(-50%,-50%)",
                      animation: "orbitSpin 18s linear infinite",
                    }}
                  >
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#C90606] shadow-[0_0_14px_rgba(201,6,6,0.6)] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#005280] shadow-[0_0_14px_rgba(0,82,128,0.6)] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" />
                  </div>

                  {/* Outer orbit ring 2 */}
                  <div
                    className="absolute top-1/2 left-1/2 rounded-full border border-[#C90606]/15"
                    style={{
                      width: 440, height: 440,
                      transform: "translate(-50%,-50%)",
                      animation: "orbitSpin 26s linear infinite reverse",
                    }}
                  >
                    <div className="absolute w-2 h-2 rounded-full bg-[#005280] shadow-[0_0_10px_rgba(0,82,128,0.5)] top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute w-2 h-2 rounded-full bg-[#C90606] shadow-[0_0_10px_rgba(201,6,6,0.5)] top-1/2 right-0 translate-x-1/2 -translate-y-1/2" />
                  </div>

                  {/* Blob itself */}
                  <div
                    className="relative w-64 h-64"
                    style={{ animation: "blobRotate 20s linear infinite, blobMorph 8s ease-in-out infinite" }}
                  >
                    {/* Inner glass */}
                    <div
                      className="absolute border border-white"
                      style={{
                        inset: 14,
                        borderRadius: "inherit",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,249,255,0.4) 100%)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 20px 40px rgba(0,82,128,0.05)"
                      }}
                    />
                    {/* Specular highlight */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        top: "16%", left: "18%", width: "36%", height: "24%",
                        background: "radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 70%)",
                        filter: "blur(4px)",
                      }}
                    />

                    {/* iSchool center logo text */}
                    <div
                      className="absolute inset-0 flex items-center justify-center z-10"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      <div className="text-center">
                        <div className="text-3xl font-black text-[#005280] tracking-tight">iSchool</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Platform</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold hidden sm:block">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-xl border border-slate-300 flex justify-center pt-2 bg-white/50 backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-[#C90606] shadow-[0_0_8px_rgba(201,6,6,0.5)]"
          />
        </div>
      </motion.div>

      {/* ════════════════════════════════════
          FEATURES CARDS SECTION (scroll reveal)
      ════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pb-24 lg:pb-32 pt-10">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EXPO }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <span className="text-[11px] uppercase tracking-widest text-[#C90606] font-bold">
            Core Modules
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-[#005280] mt-3 tracking-tight">
            Everything your institution needs
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#C90606] to-[#005280] mx-auto mt-4 rounded-full opacity-80" />
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.4, ease: EXPO }}
          viewport={{ once: true, margin: "-60px" }}
          className="
            mt-20 rounded-3xl overflow-hidden
            border border-slate-200
            bg-white/80 backdrop-blur-2xl
            shadow-[0_20px_60px_rgba(0,82,128,0.08)]
          "
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/80">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10" />
            <div className="flex-1 text-center text-[11px] text-slate-400 font-mono font-medium">
              dashboard.ischool.app
            </div>
          </div>

          {/* Mini dashboard */}
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Students", val: "3,241", trend: "+12%", color: "text-[#005280]" },
                { label: "Staff", val: "184", trend: "+3%", color: "text-[#005280]" },
                { label: "Revenue", val: "$84k", trend: "+22%", color: "text-[#C90606]" },
                { label: "Attendance", val: "96.4%", trend: "+1.2%", color: "text-[#005280]" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -6, scale: 1.03, borderColor: "#005280" }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EXPO }}
                  viewport={{ once: true, margin: "-20px" }}
                  className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm transition-colors duration-300 cursor-pointer"
                >
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">{s.label}</div>
                  <div className="text-xl font-black text-slate-800">{s.val}</div>
                  <div className={`text-[11px] font-bold ${s.color} mt-1`}>{s.trend}</div>
                </motion.div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-inner">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Enrollment Trends</div>
              <div className="flex items-end gap-1.5 h-16">
                {[55, 70, 58, 82, 68, 90, 76, 95, 82, 100, 88, 96].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ delay: 0.04 * i, duration: 0.5, ease: EXPO }}
                    viewport={{ once: true }}
                    className="flex-1 rounded-sm origin-bottom"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, #C90606, #005280)`,
                      opacity: 0.5 + (i / 11) * 0.5,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                  <span key={m} className="text-[8px] text-slate-400 font-medium flex-1 text-center">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── KEYFRAMES (scoped via style tag) ── */}
      <style>{`
        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes orbitSpin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes blobMorph {
          0%,100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          25%     { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%     { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          75%     { border-radius: 60% 40% 40% 60% / 30% 70% 50% 40%; }
        }
        @keyframes blobRotate {
          0%   { background: conic-gradient(from 0deg,   #C90606, #005280, #C90606, #005280, #C90606); }
          50%  { background: conic-gradient(from 180deg, #C90606, #005280, #C90606, #005280, #C90606); }
          100% { background: conic-gradient(from 360deg, #C90606, #005280, #C90606, #005280, #C90606); }
        }
        @keyframes floatA {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50%     { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0) rotate(1deg); }
          50%     { transform: translateY(12px) rotate(-1deg); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; box-shadow: 0 0 10px rgba(201,6,6,0.5); }
          50%      { opacity:0.8; box-shadow: 0 0 4px rgba(201,6,6,0.2); }
        }
      `}</style>
    </section>
  )
}

export default Hero