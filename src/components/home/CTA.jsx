/**
 * CTA — v3 "Cinematic Reveal"
 * Concept: Architectural split with a live scanline, cursor-reactive fog spotlight,
 * GSAP SplitText cascade, SVG blob morph, dual marquee ticker rails,
 * Framer spring-physics badge floats, and magnetic store buttons.
 *
 * GSAP  → SplitText headline, scanline sweep, slash reveal, panel slide, blob morph, marquee
 * Framer → cursor spotlight, spring physics on badges, store-btn hover state, right-panel parallax
 * Never both on the same DOM node.
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useScroll,
} from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import appStoreImg from '../../assets/app-store.svg'
import googlePlayImg from '../../assets/google-play.svg'
import ischoolLogo from '../../assets/favicon.png'

gsap.registerPlugin(ScrollTrigger, SplitText)

/* Tokens ─ */
const BLUE = '#005280'
const RED = '#C90606'
const CREAM = '#F2EFE9'
const INK = '#0E0E0E'
const MUTED = '#8A8A8A'

/* Animated Counter  */
function Counter({ to, suffix = '', decimals = 0 }) {
  const mv = useMotionValue(0)
  const ref = useRef(null)
  const [display, setDisplay] = useState(decimals ? (0).toFixed(decimals) : '0')

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const c = animate(mv, to, { duration: 2.4, ease: [0.16, 1, 0.3, 1] })
      mv.on('change', v => setDisplay(decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()))
      return () => c.stop()
    }, { threshold: 0.5 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [to, decimals])

  return <span ref={ref}>{display}{suffix}</span>
}

/* Magnetic Store Button (Framer)  */
function MagBtn({ href, img, alt, label, sublabel }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16 })
  const sy = useSpring(y, { stiffness: 180, damping: 16 })
  const [hov, setHov] = useState(false)

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.38)
    y.set((e.clientY - r.top - r.height / 2) * 0.38)
  }
  const onLeave = () => { x.set(0); y.set(0); setHov(false) }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="cursor-pointer"
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={img} alt={alt}
          className='h-20 w-36'
        />
      </motion.div>
    </motion.a>
  )
}

/* SVG Morphing Blob (GSAP)  */
function MorphBlob() {
  const pathRef = useRef(null)
  const paths = [
    'M420,300Q390,350,340,380Q290,410,240,400Q190,390,150,360Q110,330,90,280Q70,230,80,180Q90,130,130,100Q170,70,220,60Q270,50,320,70Q370,90,400,130Q430,170,440,220Q450,270,420,300Z',
    'M400,280Q370,340,310,370Q250,400,200,380Q150,360,120,310Q90,260,100,210Q110,160,150,120Q190,80,240,70Q290,60,340,90Q390,120,410,170Q430,220,400,280Z',
    'M430,310Q400,370,340,390Q280,410,230,390Q180,370,140,330Q100,290,95,240Q90,190,120,150Q150,110,200,90Q250,70,300,80Q350,90,390,130Q434,180,445,220Q460,270,430,310Z',
    'M415,295Q385,362,320,388Q255,414,208,396Q161,378,128,332Q95,286,93,232Q91,178,128,138Q165,98,214,78Q263,58,316,74Q369,90,403,134Q437,178,442,230Q447,282,415,295Z',
  ]

  useEffect(() => {
    if (!pathRef.current) return
    const tl = gsap.timeline({ repeat: -1 })
    paths.forEach((_, i) =>
      tl.to(pathRef.current, { attr: { d: paths[(i + 1) % paths.length] }, duration: 4.5, ease: 'sine.inOut' })
    )
    return () => tl.kill()
  }, [])

  return (
    <svg viewBox="0 0 540 460" className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <defs>
        <linearGradient id="blobG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.1" />
          <stop offset="100%" stopColor={RED} stopOpacity="0.07" />
        </linearGradient>
      </defs>
      <path ref={pathRef} d={paths[0]} fill="url(#blobG)" stroke={`${BLUE}28`} strokeWidth="1.5" />
    </svg>
  )
}

/* Marquee Rail (GSAP)  */
function MarqueeRail({ reversed = false }) {
  const trackRef = useRef(null)
  const items = ['iSchool', '★ 4.9', '10k Users', '500 Schools', 'iOS & Android', 'Free Download']

  useEffect(() => {
    if (!trackRef.current) return
    const el = trackRef.current
    const w = el.scrollWidth / 2
    gsap.to(el, {
      x: reversed ? `+=${w}` : `-=${w}`,
      duration: 26,
      ease: 'none',
      repeat: -1,
      modifiers: { x: gsap.utils.unitize(val => parseFloat(val) % w) },
    })
  }, [reversed])

  return (
    <div className="overflow-hidden border-y border-black/5 py-3.5">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-5 cta3-ui text-[0.72rem] font-semibold tracking-[0.14em] uppercase"
            style={{ color: i % 4 === 0 ? BLUE : MUTED }}
          >
            {item}
            <span className="text-[0.55rem]" style={{ color: `${RED}70` }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* Floating Stat Badge (Framer) */
function StatBadge({ to, suffix, label, delay, amp = 8, decimals = 0, style }) {
  return (
    <motion.div
      className="absolute z-30"
      style={style}
      initial={{ opacity: 0, y: 24, scale: 0.82 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -amp, 0] }}
        transition={{ duration: 3.8 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-white/95 border border-black/5 rounded-2xl px-5 py-3.5 min-w-[100px] backdrop-blur-md"
        style={{
          boxShadow: '0 18px 50px -10px rgba(0,0,0,0.13), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        <div className="cta3-ui text-[1.65rem] font-bold tracking-[-0.04em] leading-none" style={{ color: INK }}>
          <Counter to={to} suffix={suffix} decimals={decimals} />
        </div>
        <div className="cta3-body text-[0.62rem] font-medium tracking-widest uppercase mt-1.5" style={{ color: MUTED }}>
          {label}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* Main Component */
export function CTA() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const subRef = useRef(null)
  const btnsRef = useRef(null)
  const trustRef = useRef(null)
  const slashRef = useRef(null)
  const scanRef = useRef(null)
  const rightRef = useRef(null)
  const dividerRef = useRef(null)

  /* Framer: cursor fog */
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const smx = useSpring(mx, { stiffness: 45, damping: 18 })
  const smy = useSpring(my, { stiffness: 45, damping: 18 })
  const spotBg = useTransform([smx, smy], ([x, y]) =>
    `radial-gradient(700px circle at ${x * 100}% ${y * 100}%, rgba(0,82,128,0.06) 0%, transparent 65%)`
  )

  const onMouseMove = useCallback((e) => {
    const r = sectionRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }, [])

  /* Framer: right-panel parallax */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const rightY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  /* GSAP orchestration */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Slash reveal */
      if (slashRef.current) {
        gsap.fromTo(slashRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, duration: 1.8, ease: 'expo.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true }
          }
        )
      }

      /* Divider fade */
      if (dividerRef.current) {
        gsap.fromTo(dividerRef.current,
          { scaleY: 0, transformOrigin: 'top center', opacity: 0 },
          {
            scaleY: 1, opacity: 1, duration: 1.5, ease: 'expo.out', delay: 0.3,
            scrollTrigger: { trigger: dividerRef.current, start: 'top 85%', once: true }
          }
        )
      }

      /* SplitText headline */
      if (headRef.current) {
        const split = new SplitText(headRef.current, { type: 'lines,chars' })
        gsap.set(split.chars, { yPercent: 110, opacity: 0, skewX: 6 })
        ScrollTrigger.create({
          trigger: headRef.current,
          start: 'top 83%',
          once: true,
          onEnter: () =>
            gsap.to(split.chars, {
              yPercent: 0, opacity: 1, skewX: 0,
              duration: 1.05, ease: 'expo.out',
              stagger: { amount: 0.5, from: 'start' },
            }),
        })
      }

      /* Sub, buttons, trust stagger */
      const staggerTargets = [subRef.current, btnsRef.current, trustRef.current].filter(Boolean)
      if (staggerTargets.length > 0) {
        gsap.fromTo(staggerTargets,
          { y: 32, opacity: 0, filter: 'blur(5px)' },
          {
            y: 0, opacity: 1, filter: 'blur(0px)',
            duration: 1.0, ease: 'expo.out', stagger: 0.1, delay: 0.45,
            scrollTrigger: { trigger: staggerTargets[0], start: 'top 88%', once: true }
          }
        )
      }

      /* Right panel slide */
      if (rightRef.current) {
        gsap.fromTo(rightRef.current,
          { x: '7%', opacity: 0 },
          {
            x: '0%', opacity: 1, duration: 1.5, ease: 'expo.out', delay: 0.2,
            scrollTrigger: { trigger: rightRef.current, start: 'top 85%', once: true }
          }
        )
      }

      /* Scanline sweep loop */
      if (scanRef.current) {
        gsap.fromTo(scanRef.current,
          { top: '-2%' },
          {
            top: '102%', duration: 3.2, ease: 'none', repeat: -1, repeatDelay: 6,
            scrollTrigger: { trigger: sectionRef.current, start: 'top center' }
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        @keyframes pingDot {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes spinRing1 { to { transform: translate(-50%,-50%) rotate(360deg);  } }
        @keyframes spinRing2 { to { transform: translate(-50%,-50%) rotate(-360deg); } }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={onMouseMove}
        className="relative overflow-hidden"
        style={{ background: CREAM }}
      >
        {/* Cursor fog (Framer) */}
        <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: spotBg }} />

        {/* Fine grid */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.032) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }} />

        {/* Noise grain */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.022]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }} />

        {/* Scanline (GSAP via ref) */}
        <div ref={scanRef} className="absolute left-0 right-0 pointer-events-none z-20"
          style={{
            height: 1, background: `linear-gradient(90deg,transparent,${BLUE}60,transparent)`,
            boxShadow: `0 0 18px 5px ${BLUE}22`
          }} />

        {/* Diagonal slash (GSAP) */}
        <div ref={slashRef} className="absolute top-0 bottom-0 pointer-events-none z-0 hidden lg:block"
          style={{
            left: '51.5%', width: 2,
            background: `linear-gradient(to bottom, transparent, ${BLUE}35 30%, ${RED}35 70%, transparent)`,
            transform: 'skewX(-5deg)',
          }} />

        {/* Ghost big letterform */}
        <div className="cta3-head absolute right-[-3%] top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden xl:block select-none"
          style={{
            fontSize: 'clamp(200px,28vw,400px)', fontWeight: 700, color: 'transparent',
            WebkitTextStroke: `1.5px ${BLUE}08`, lineHeight: 1, letterSpacing: '-0.06em'
          }}>
          iS
        </div>

        {/* Top marquee rail */}
        <MarqueeRail />

        {/* Main grid */}
        <div className="relative z-10 max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-20">
          <div className="grid lg:grid-cols-[1fr_2px_1fr] items-stretch py-0" style={{ minHeight: '88vh' }}>

            {/* LEFT */}
            <div className="flex flex-col justify-center gap-9 py-12 lg:py-0 lg:pr-20">

              {/* Headline (GSAP SplitText) */}
              <div
                ref={headRef}
                className="cta3-head text-4xl lg:text-6xl font-bold"
                style={{ color: INK }}
                aria-label="Download iSchool Today"
                dangerouslySetInnerHTML={{ __html: `
                  Download<em style="font-style: normal; color: ${BLUE}">  <br />
                    <span style="color: ${RED}">i</span>School
                  </em><br />
                  Today<span style="color: ${RED}">.</span>
                ` }}
              />

              {/* Ruled decoration */}
              <div className="flex items-center gap-2">
                {[56, 28, 14, 8].map((w, i) => (
                  <div key={i} className="h-px rounded-full"
                    style={{ width: w, background: BLUE, opacity: [1, 0.4, 0.15, 0.07][i] }} />
                ))}
                <div className="ml-1 w-2 h-2 rounded-sm rotate-45 shrink-0" style={{ background: RED }} />
              </div>

              {/* Body copy */}
              {/* <p ref={subRef} className="cta3-body leading-[1.82] max-w-[400px] text-[0.98rem] font-light"
                style={{ color: MUTED }}>
                One platform to manage students, attendance, fee collection, and
                communication — beautifully designed for schools across Pakistan.
              </p> */}

              {/* Store buttons */}
              <div ref={btnsRef} className="flex flex-wrap gap-3">
                <MagBtn href="https://apps.apple.com/pk/app/i-school/id6450982421"
                  img={appStoreImg} alt="App Store" />
                <MagBtn href="https://play.google.com/store/apps/details?id=com.ischool.pk"
                  img={googlePlayImg} alt="Google Play" />
              </div>

              {/* Trust avatars */}
              {/* <div ref={trustRef} className="flex items-center gap-4 pt-1">
                <div className="flex -space-x-2.5">
                  {[BLUE, RED, BLUE, RED].map((c, i) => (
                    <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 cta3-ui"
                      style={{ background: c, borderColor: CREAM, zIndex: 4 - i }}>
                      {['SA', 'MK', 'RA', '+'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="cta3-ui text-[0.8rem] font-semibold" style={{ color: INK }}>
                    10,000+ active users
                  </div>
                  <div className="cta3-body text-[0.68rem]" style={{ color: MUTED }}>
                    Across 500+ schools
                  </div>
                </div>
              </div> */}
            </div>

            {/* Vertical divider (GSAP) */}
            <div ref={dividerRef} className="hidden lg:block w-[2px] self-stretch my-20"
              style={{ background: `linear-gradient(to bottom, transparent, ${BLUE}22 30%, ${RED}22 70%, transparent)` }} />

            {/* RIGHT */}
            <motion.div
              ref={rightRef}
              className="relative flex items-center justify-center py-6 lg:py-0 lg:pl-20 min-h-[460px]"
              style={{ y: rightY }}
            >
              {/* Morphing blob (GSAP-controlled path inside) */}
              {/* <div className="absolute inset-0 pointer-events-none">
                <MorphBlob />
              </div> */}

              {/* Rotating rings (CSS only) */}
              {/* {[380, 290].map((size, i) => (
                <div key={size} className="absolute pointer-events-none rounded-full"
                  style={{
                    width: size, height: size,
                    top: '50%', left: '50%',
                    border: `1px dashed ${[BLUE, RED][i]}22`,
                    animation: `${['spinRing1', 'spinRing2'][i]} ${[38, 24][i]}s linear infinite`,
                  }} />
              ))} */}

              {/* Pentagon orbit dots (Framer) */}
              {/* {[0, 72, 144, 216, 288].map((deg, i) => {
                const rad = (deg * Math.PI) / 180
                const r = 194
                return (
                  <motion.div key={i}
                    className="absolute w-2 h-2 rounded-full pointer-events-none"
                    style={{
                      left: `calc(50% + ${Math.cos(rad) * r}px)`,
                      top: `calc(50% + ${Math.sin(rad) * r}px)`,
                      background: i % 2 === 0 ? BLUE : RED,
                    }}
                    animate={{ scale: [1, 1.9, 1], opacity: [0.22, 0.65, 0.22] }}
                    transition={{ duration: 2.6, delay: i * 0.42, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )
              })} */}

              {/* App icon card (Framer float) */}
              <div className="relative z-20 flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  {/* Pulse ring (Framer) */}
                  {/* <motion.div className="absolute inset-0 rounded-[36px] pointer-events-none"
                    animate={{ boxShadow: [`0 0 0 0px ${BLUE}40`, `0 0 0 28px ${BLUE}00`] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }} /> */}

                  {/* Card */}
                  <div
                    className="w-[230px] h-[230px] rounded-[36px] flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(148deg, ${BLUE} 0%, #001828 100%)`,
                      boxShadow: `0 60px 120px -20px ${BLUE}55, 0 0 0 1px rgba(255,255,255,0.11), inset 0 1px 0 rgba(255,255,255,0.18)`,
                    }}
                  >
                    {/* Shine */}
                    <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/10 to-transparent" />

                    <img src={ischoolLogo} alt="iSchool"
                      className="w-20 h-20 object-contain relative z-10" />
                  </div>
                </motion.div>

                <div className="mt-7 cta3-body text-[0.62rem] tracking-[0.18em] uppercase">
                  School Management Platform
                </div>
              </div>


              {/* Corner index labels */}
              {[
                { style: { top: '5%', left: '5%' }, text: '01' },
                { style: { top: '5%', right: '5%' }, text: '02' },
                { style: { bottom: '5%', left: '5%' }, text: '03' },
                { style: { bottom: '5%', right: '5%' }, text: '04' },
              ].map(({ style, text }) => (
                <div key={text} className="absolute cta3-ui text-[9px] pointer-events-none"
                  style={{ ...style, color: `${MUTED}40`, letterSpacing: '0.1em', fontWeight: 600, fontSize: 9 }}>
                  {text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom marquee */}
        <MarqueeRail />

        {/* Edge meta labels */}
        <div className="absolute bottom-5 right-8 cta3-body text-[9px] tracking-[0.2em] uppercase pointer-events-none"
          style={{ color: `${MUTED}50` }}>§04 — CTA</div>
        <div className="absolute top-[58px] left-8 cta3-body text-[9px] tracking-[0.2em] uppercase pointer-events-none"
          style={{ color: `${MUTED}50` }}>iSchool / 2025</div>

      </section>
    </>
  )
}