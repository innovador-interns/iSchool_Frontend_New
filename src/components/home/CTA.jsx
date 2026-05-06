import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import ctaImage from '../../assets/iSchool_files/cta-img.png'
import ctaImageVector from '../../assets/iSchool_files/cta-img-vector.svg'
import appStoreImg from '../../assets/app-store.svg'
import googlePlayImg from '../../assets/google-play.svg'
import ctaVectorLeft from '../../assets/iSchool_files/cta-vector-1.png'
import ctaVectorRight from '../../assets/iSchool_files/cta-vector-2.png'

//  Animated number ticker 
function Ticker({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let start = null
    const duration = 1800
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.floor(eased * value))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, value])

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>
}

//  Magnetic button wrapper ─
function MagneticWrap({ children, strength = 0.3 }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 200, damping: 20 })
  const y = useSpring(0, { stiffness: 200, damping: 20 })

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={handleMove} onMouseLeave={reset}>
      {children}
    </motion.div>
  )
}

//  Floating orb ─
function Orb({ className, delay = 0, duration = 8 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -24, 0], x: [0, 12, 0], rotate: [0, 8, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

//  Stat card ─
function StatCard({ value, suffix, label, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="relative group"
    >
      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${accent}`} />
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-1.5">
        <span className={`text-3xl font-black tracking-tight ${accent.replace('bg-', 'text-').replace('/20', '')}`}>
          <Ticker value={value} suffix={suffix} />
        </span>
        <span className="text-slate-500 text-xs font-medium uppercase tracking-[0.12em]">{label}</span>
      </div>
    </motion.div>
  )
}

//  Download button
function DownloadButton({ href, img, alt }) {
  return (
    <MagneticWrap>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={img} alt={alt} className="h-18 w-40 object-contain shrink-0" />
      </motion.a>
    </MagneticWrap>
  )
}

//  Feature pill 
function FeaturePill({ icon, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600/80 text-xs font-medium"
    >
      <span>{icon}</span>
      <span>{text}</span>
    </motion.div>
  )
}

//  Scrolling text marquee 
function Marquee() {
  const items = ['School Management', 'Student Tracking', 'Fee Collection', 'Attendance', 'Performance Analytics', 'Communication']
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden py-4 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="flex gap-4 w-max"
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap">{item}</span>
            <span className="w-1 h-1 rounded-full bg-sky-400/30 shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

//  Main CTA 
export function CTA() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const imageRotate = useTransform(scrollYProgress, [0, 1], ['-2deg', '2deg'])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const vectorParallax = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  // Subtle parallax on mouse move
  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    })
  }

  const imgParallaxX = useSpring(mousePos.x * 18, { stiffness: 60, damping: 18 })
  const imgParallaxY = useSpring(mousePos.y * 12, { stiffness: 60, damping: 18 })

  useEffect(() => {
    imgParallaxX.set(mousePos.x * 18)
    imgParallaxY.set(mousePos.y * 12)
  }, [mousePos])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-white py-0"
    >
      {/*  Background system ─ */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        {/* Primary radial — left blue glow */}
        <div className="absolute top-[-10%] left-[-5%] w-[55vw] h-[55vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 65%)' }} />
        {/* Secondary — bottom right red touch */}
        <div className="absolute bottom-[-15%] right-[5%] w-[45vw] h-[45vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.09) 0%, transparent 65%)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        {/* Noise grain */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
        {/* Edge Vectors — parallax */}
        <motion.div style={{ y: vectorParallax }} className="absolute left-0 top-0 h-full pointer-events-none z-0">
          <img src={ctaVectorLeft} alt="" className="h-full object-cover object-right opacity-50" />
        </motion.div>
        <motion.div style={{ y: vectorParallax }} className="absolute right-0 top-0 h-full pointer-events-none z-0">
          <img src={ctaVectorRight} alt="" className="h-full object-cover object-left opacity-50" />
        </motion.div>

      </motion.div>

      {/*  Floating ambient orbs ─ */}
      <Orb className="absolute top-[8%] left-[12%] w-3 h-3 rounded-full bg-sky-400/30 blur-sm" delay={0} duration={7} />
      <Orb className="absolute top-[22%] left-[6%] w-1.5 h-1.5 rounded-full bg-sky-300/40" delay={1.2} duration={5} />
      <Orb className="absolute top-[55%] left-[18%] w-2 h-2 rounded-full bg-red-400/30" delay={2.5} duration={9} />
      <Orb className="absolute top-[15%] right-[14%] w-2 h-2 rounded-full bg-sky-400/25 blur-sm" delay={0.8} duration={6} />
      <Orb className="absolute top-[70%] right-[22%] w-3 h-3 rounded-full bg-purple-400/20 blur-sm" delay={1.5} duration={8} />

      {/*  Horizontal rule top  */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-sky-500/30 to-transparent" />

      {/*  Marquee belt ─ */}
      <div className="relative z-10 border-b border-slate-100">
        <Marquee />
      </div>

      {/*  Main content ─ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-0 lg:gap-24 items-start pt-20 pb-8 lg:pt-18 lg:pb-12">

          {/*  Left: Text block ─ */}
          <div className="flex flex-col gap-10">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 w-fit"
            >
              <div className="flex gap-0.5">
                {[0, 0.15, 0.3].map(d => (
                  <motion.span
                    key={d}
                    animate={{ scaleY: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, delay: d, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-0.5 h-3.5 bg-sky-400 rounded-full origin-bottom block"
                  />
                ))}
              </div>
              <span className="text-sky-500 text-[11px] font-bold uppercase tracking-[0.22em]">Now Available</span>
            </motion.div>

            {/* Headline */}
            <div className="flex flex-col gap-2">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-black text-5xl lg:text-6xl leading-[0.92] tracking-[-0.03em] text-slate-900">
                  Download
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <h2 className="font-black text-5xl lg:text-6xl leading-[0.92] tracking-[-0.03em] relative z-10"
                  style={{
                    background: 'linear-gradient(90deg,#005280 0%, #ef4444 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 6px 18px rgba(14,165,233,0.08)'
                  }}>
                  iSchool
                </h2>
                <h2 className="absolute top-1.5 left-1 font-black text-5xl lg:text-6xl leading-[0.92] tracking-[-0.03em] text-sky-900/20 select-none pointer-events-none"
                  aria-hidden>iSchool</h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-black text-5xl lg:text-6xl leading-[0.92] tracking-[-0.03em] text-slate-900">
                  Today.
                </h2>
              </motion.div>
            </div>

            {/* Description */}
            {/* <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-700/90 text-[1.05rem] leading-[1.85] max-w-md"
            >
              iSchool brings every corner of your institution into one intelligent app —
              from attendance to analytics, always in your pocket.
            </motion.p> */}

            {/* Download CTA area */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              <p className="text-slate-500/90 text-xs font-medium uppercase tracking-[0.15em]">Download free on</p>
              <div className="flex flex-wrap gap-3">
                <DownloadButton
                  href="https://apps.apple.com/pk/app/i-school/id6450982421"
                  img={appStoreImg}
                  alt="App Store"
                />
                <DownloadButton
                  href="https://play.google.com/store/apps/details?id=com.ischool.pk&hl=en_US"
                  img={googlePlayImg}
                  alt="Google Play"
                />
              </div>
              {/* Social proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  {['#0ea5e9', '#8b5cf6', '#06b6d4', '#f59e0b'].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-100 flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: c }}>
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-slate-600/80 text-xs">
                  <span className="text-slate-800 font-semibold">4.8★</span> · Trusted by 500+ schools in Pakistan
                </span>
              </div>
            </motion.div>

          </div>

          {/*  Right: Floating phone visual */}
          <motion.div
            className="relative hidden lg:flex flex-col items-center justify-start pt-4"
            style={{ y: imageY }}
          >
            {/* Glow halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)' }} />

            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-105 h-105 rounded-full border border-sky-500/10 pointer-events-none"
              style={{ borderStyle: 'dashed' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-85 h-85 rounded-full border border-red-500/10 pointer-events-none"
              style={{ borderStyle: 'dashed' }}
            />

            {/* Phone image with float */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ x: imgParallaxX, y: imgParallaxY }}
              className="relative z-10 will-change-transform"
            >
              {/* Vector glow bg */} 
              <img src={ctaImageVector} alt="" className="absolute inset-0 w-full h-full object-contain opacity-70 pointer-events-none scale-110" />
              <img
                src={ctaImage}
                alt="iSchool App Preview"
                className="w-72 xl:w-80 drop-shadow-[0_60px_100px_rgba(14,165,233,0.25)] select-none"
                draggable={false}
              />
              {/* Bottom glow shadow */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full blur-2xl bg-sky-400/20" />
            </motion.div>

          </motion.div>
        </div>
      </div>

    </section>
  )
}