import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Zap, ShieldCheck, BarChart3 } from 'lucide-react'
import aboutImg from '../../assets/about-img.png'

gsap.registerPlugin(ScrollTrigger, SplitText)

//─ DATA─
const STATS = [
  { value: 500, suffix: '+', label: 'Institutions' },
  { value: 98,  suffix: '%', label: 'Satisfaction' },
  { value: 50,  suffix: 'k+',label: 'Active Users' },
  { value: 10,  suffix: '+', label: 'Years'        },
]

const PILLARS = [
  { Icon: Zap,         text: 'Real-time broadcast across your institution'  },
  { Icon: ShieldCheck, text: 'Enterprise-grade security & compliance'       },
  { Icon: BarChart3,   text: 'Deep analytics for data-driven decisions'     },
]

//─ COUNTER─
function Counter({ value, suffix, label, run }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf, t0
    const tick = (ts) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / 1500, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setN(Math.floor(e * value))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setN(value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, value])
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-4xl font-black leading-none text-[#005280] tabular-nums">
        {n}{suffix}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
        {label}
      </span>
    </div>
  )
}

//─ LAPTOP MOCKUP
function LaptopShowcase({ imgRef }) {
  // Framer: subtle y parallax on the whole laptop — GSAP never touches this
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])

  return (
    <motion.div ref={ref} style={{ y }} className="relative will-change-transform">

      {/* Glow behind laptop */}
      <div
        className="absolute -inset-12 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,82,128,0.12) 0%, transparent 70%)' }}
      />

      {/* Laptop shell */}
      <div className="relative mx-auto" style={{ maxWidth: 780 }}>

        {/* Screen lid */}
        <div className="relative rounded-t-2xl bg-white/30 overflow-hidden border border-neutral-200 shadow-[0_2px_0_rgba(0,0,0,0.08)]">

          {/* Browser chrome bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-white/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 mx-3 h-5 rounded-md flex items-center px-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <span className="text-[10px] font-medium text-black">app.ischool.io/dashboard</span>
            </div>
          </div>

          {/* Dashboard screenshot */}
          <div ref={imgRef} className="relative overflow-hidden">
            <img
              src={aboutImg}
              alt="iSchool Dashboard"
              className="w-[600px] max-h-[460px] block object-cover mx-auto"
              style={{ objectPosition: 'top' }}
            />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #fafafa, transparent)' }} />
          </div>
        </div>

        {/* Hinge */}
        <div className="h-[6px] rounded-none mx-2 relative z-10"
          style={{ background: 'linear-gradient(to bottom, #fafafa, #fafafa)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />

        {/* Base / keyboard area */}
        <div className="h-5 rounded-b-2xl mx-0 relative"
          style={{ background: 'linear-gradient(to bottom, #fafafa, #fafafa)', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
          {/* Trackpad hint */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 rounded-full bg-[#005280]/80" />
        </div>
      </div>

      {/* Floating stat chips */}
      <motion.div
        className="absolute -left-4 top-12 lg:-left-14 flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-lg border border-neutral-100/80"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-8 h-8 rounded-xl bg-[#005280]/10 flex items-center justify-center shrink-0">
          <BarChart3 size={15} className="text-[#005280]" />
        </div>
        <div>
          <p className="text-xs font-black text-neutral-800">98% Satisfaction</p>
          <p className="text-[9px] text-neutral-400 font-medium">Client retention</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-4 bottom-16 lg:-right-12 flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-lg border border-neutral-100/80"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <div className="relative w-2.5 h-2.5 shrink-0">
          <div className="absolute inset-0 rounded-full bg-emerald-500" />
          <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-70" />
        </div>
        <div>
          <p className="text-xs font-black text-neutral-800">500+ Schools Live</p>
          <p className="text-[9px] text-neutral-400 font-medium">Updated in real-time</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

//─ MAIN SECTION─
export function About() {
  const sectionRef  = useRef(null)
  const topRef      = useRef(null)
  const imgRef      = useRef(null)
  const mockupRef   = useRef(null)
  const [countersOn, setCountersOn] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Top eyebrow pill
      gsap.from('.ab-eyebrow', {
        opacity: 0, y: 14, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: topRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      })

      // Heading lines
      const split = new SplitText('.ab-heading', { type: 'lines' })
      gsap.from(split.lines, {
        opacity: 0, y: 44, duration: 0.8, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: topRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      })

      // Subline
      gsap.from('.ab-sub', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: topRef.current, start: 'top 79%', toggleActions: 'play none none none' },
      })

      // Laptop mockup rises in
      gsap.from('.ab-mockup', {
        opacity: 0, y: 80, scale: 0.94, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.ab-mockup', start: 'top 85%', toggleActions: 'play none none none' },
      })

      // Bottom content reveal
      gsap.from('.ab-pillar', {
        opacity: 0, y: 24, stagger: 0.09, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: '.ab-bottom', start: 'top 82%', toggleActions: 'play none none none' },
      })

      // Accent rule
      gsap.from('.ab-rule', {
        scaleX: 0, duration: 0.7, ease: 'expo.out', transformOrigin: 'left',
        scrollTrigger: { trigger: '.ab-bottom', start: 'top 82%', toggleActions: 'play none none none' },
      })

      // Stats
      ScrollTrigger.create({
        trigger: '.ab-stats',
        start: 'top 82%',
        onEnter: () => setCountersOn(true),
      })
      gsap.from('.ab-stat', {
        opacity: 0, y: 18, stagger: 0.07, duration: 0.55, ease: 'power3.out',
        scrollTrigger: { trigger: '.ab-stats', start: 'top 82%', toggleActions: 'play none none none' },
      })

      // CTA
      gsap.from('.ab-cta', {
        opacity: 0, y: 16, duration: 0.6, ease: 'power3.out', delay: 0.1,
        scrollTrigger: { trigger: '.ab-cta', start: 'top 90%', toggleActions: 'play none none none' },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#F8F6F2] overflow-hidden"
    >
      {/* Dot grid watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,82,128,0.18) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Top ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 pointer-events-none blur-3xl opacity-40"
        style={{ background: 'radial-gradient(ellipse, rgba(0,82,128,0.12) 0%, transparent 70%)' }}
      />

      {/* TOP TEXT BLOCK */}
      <div
        ref={topRef}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-24 lg:pt-36 pb-16 text-center"
      >
        {/* Eyebrow */}
        <div className="ab-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-8 bg-[#005280]/8 text-[#005280] border border-[#005280]/15">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[#005280]"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.35, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
          />
          Legacy of Innovation
        </div>

        {/* Heading */}
        <h2 className="ab-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight text-neutral-900 max-w-4xl mx-auto mb-6">
          Welcome to the{' '}
          <span className="relative inline-block text-[#005280]">
            Future of Education
            <svg
              className="absolute -bottom-2 left-0 w-full overflow-visible"
              viewBox="0 0 480 8"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M2 6 Q120 1 240 5 Q360 8 478 3"
                fill="none" stroke="#C90606" strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </span>
        </h2>

        {/* Sub */}
        <p className="ab-sub text-base lg:text-lg leading-[1.85] text-neutral-500 max-w-2xl mx-auto">
          iSchool Mobile App empowers management and educators to broadcast critical updates instantly —
          a seamless flow of information built for the schools of tomorrow.
        </p>
      </div>

      {/* LAPTOP MOCKUP */}
      <div className="ab-mockup relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
        <LaptopShowcase imgRef={imgRef} />
      </div>

      {/* BOTTOM CONTENT BLOCK */}
      <div
        className="ab-bottom relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-24 lg:pt-20 lg:pb-36"
      >
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT: pillars + rule */}
          <div className="flex flex-col items-center lg:items-start gap-8 text-center lg:text-left">
            <div className="flex flex-col gap-5 w-full">
              {/* Rule */}
              <div className="ab-rule flex items-center justify-center lg:justify-start gap-2 mb-2">
                <div className="h-[3px] w-12 rounded-full bg-[#C90606]" />
                <div className="h-[3px] w-4 rounded-full bg-[#C90606]/35" />
                <div className="h-[3px] w-2 rounded-full bg-[#C90606]/15" />
              </div>

              <p className="text-[0.97rem] leading-[1.85] text-neutral-500 max-w-xl mx-auto lg:mx-0">
                Discover a world of simplicity, efficiency, and enhanced communication — iSchool
                brings your institution into one unified, intelligent platform.
              </p>
            </div>

            <div className="flex flex-col w-full gap-3 mt-2">
              {PILLARS.map(({ Icon, text }, i) => (
                <div
                  key={i}
                  className="ab-pillar group flex items-center gap-4 px-5 py-4 rounded-xl bg-white border border-neutral-100 hover:-translate-y-0.5 hover:shadow-lg hover:border-[#005280]/20 transition-all duration-300 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#005280]/8 flex items-center justify-center shrink-0 group-hover:bg-[#005280]/14 transition-colors duration-300">
                    <Icon size={18} className="text-[#005280]" strokeWidth={2.2} />
                  </div>
                  <span className="text-sm font-semibold text-neutral-600 group-hover:text-neutral-900 transition-colors duration-300">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: animated stat counters */}
          <div className="flex flex-col gap-10 lg:pl-8">
            <div className="flex flex-col gap-8">
              {/* Eyebrow for stats */}
              <div className="flex items-center justify-center lg:justify-start gap-2.5">
                <div className="w-6 h-px bg-[#005280]/40" />
                <span className="text-[9px] font-black uppercase tracking-[0.28em] text-neutral-400">
                  By the numbers
                </span>
              </div>

              {/* Stats 2×2 grid */}
              <div className="ab-stats grid grid-cols-2 gap-x-8 gap-y-12">
                {STATS.map((s, i) => (
                  <div key={i} className="ab-stat flex flex-col gap-1.5 relative">
                    {/* Left accent bar */}
                    <div
                      className="absolute -left-4 top-1 bottom-1 w-[2px] rounded-full bg-[#005280]/20"
                    />
                    <Counter value={s.value} suffix={s.suffix} label={s.label} run={countersOn} />
                  </div>
                ))}
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-neutral-200">
              <div className="flex -space-x-2">
                {['#005280', '#C90606', '#1a7a4a', '#7c3aed'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                    style={{ background: c }}
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-400 font-medium text-center sm:text-left">
                Trusted by <span className="font-bold text-neutral-700">500+</span> institutions worldwide
              </p>
            </div>
          </div>
        </div>

        {/* CTA buttons - Centered at bottom for better flow and alignment */}
        <div className="ab-cta flex flex-wrap items-center justify-center gap-5 mt-20 lg:mt-24">
          <motion.a
            href="https://www.innovadorsolutions.com/?fluent-form=7"
            target="_blank"
            rel="noreferrer"
            className="relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white text-base font-bold bg-[#005280] overflow-hidden shadow-[0_12px_30px_rgba(0,82,128,0.25)] group"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <motion.span
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
              initial={{ x: '-150%' }}
              whileHover={{ x: '180%' }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
            />
            <span className="relative z-10">Learn More About Us</span>
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" 
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>

          {/* <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-base font-bold text-[#005280] bg-white border-2 border-[#005280]/10 hover:border-[#005280]/30 hover:bg-[#005280]/4 transition-all duration-300 shadow-sm"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            Get a Demo
          </motion.a> */}
        </div>
      </div>


      {/* Bottom diagonal divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path d="M0 64 L1440 0 L1440 64 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}