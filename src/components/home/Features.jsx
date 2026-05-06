import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { featuresNotice } from './data'

gsap.registerPlugin(ScrollTrigger, SplitText)

// TOKENS─
const BLUE = '#005280'
const RED = '#C90606'
const WHITE = '#FFFFFF'
const BG = '#F8F6F2'
const DARK = '#1A1A1A'
const MUTED = '#666666'
const BORDER = 'rgba(0,82,128,0.10)'

// Per-module personality — accent, emoji, category label
const THEMES = [
  { accent: BLUE, light: `${BLUE}09`, label: 'Core', num: '01' },
  { accent: RED, light: `${RED}08`, label: 'Comms', num: '02' },
  { accent: '#1a7a4a', light: '#1a7a4a09', label: 'Analytics', num: '03' },
  { accent: '#7c3aed', light: '#7c3aed09', label: 'Learning', num: '04' },
]

// CURSOR─
function MagneticDot() {
  const dot = useRef(null)
  const ring = useRef(null)
  const m = useRef({ x: -300, y: -300 })
  const p = useRef({ x: -300, y: -300 })
  const raf = useRef(null)
  const [lbl, setLbl] = useState('')

  useEffect(() => {
    const mv = (e) => { m.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', mv)

    const loop = () => {
      p.current.x += (m.current.x - p.current.x) * 0.11
      p.current.y += (m.current.y - p.current.y) * 0.11
      dot.current && (dot.current.style.transform = `translate(${p.current.x - 5}px,${p.current.y - 5}px)`)
      ring.current && (ring.current.style.transform = `translate(${m.current.x - 22}px,${m.current.y - 22}px)`)
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)

    const over = (e) => { const t = e.target.closest('[data-cursor]'); if (t) setLbl(t.dataset.cursor) }
    const out = (e) => { const t = e.target.closest('[data-cursor]'); if (t && !t.contains(e.relatedTarget)) setLbl('') }
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      window.removeEventListener('mousemove', mv)
      cancelAnimationFrame(raf.current)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [])

  const on = Boolean(lbl)
  return (
    <>
      <div ref={ring} className="fixed top-0 left-0 z-9999 pointer-events-none hidden lg:flex items-center justify-center" style={{ width: 44, height: 44 }}>
        <div
          className="w-full h-full rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: on ? RED : `${BLUE}50`, background: on ? `${RED}10` : 'transparent', transform: on ? 'scale(1.3)' : 'scale(1)', transition: 'all 0.2s ease' }}
        >
          {on && <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: RED }}>{lbl}</span>}
        </div>
      </div>
      <div ref={dot} className="fixed top-0 left-0 z-9999 pointer-events-none w-2.5 h-2.5 rounded-full hidden lg:block" style={{ background: on ? RED : BLUE, transition: 'background 0.18s' }} />
    </>
  )
}

// ANIMATED SVG UNDERLINE
function Underline({ color = RED, delay = 0.5 }) {
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

// SINGLE MODULE PANEL (stacked in sticky, GSAP drives opacity/transforms)
function ModulePanel({ feat, index, theme, total }) {
  const items = feat.list ?? []
  return (
    <div
      className={`mp-${index} absolute inset-0 flex items-center`}
      style={{ opacity: 0, pointerEvents: 'none', willChange: 'opacity' }}
    >
      <div className="w-full max-w-340 mx-auto px-6 sm:px-14 lg:px-20">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-center min-h-[60vh]">

          {/*  LEFT: Module identity */}
          <div className="flex flex-col gap-7">

            {/* Tag row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ background: `${theme.accent}0D`, color: theme.accent, border: `1px solid ${theme.accent}22` }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.accent }} />
                {theme.label}
              </div>
              <span className="text-[11px] font-black tracking-[0.24em] uppercase" style={{ color: 'rgba(0,0,0,0.2)', }}>
                {theme.num} / {String(total).padStart(2, '0')}
              </span>
            </div>

            {/* Big emoji */}
            <div className={`mp-emoji-${index} text-[5rem] leading-none`}>{theme.emoji}</div>

            {/* Module title — GSAP SplitText target */}
            <h3
              className={`mp-title-${index} text-[2.4rem] lg:text-[3.2rem] xl:text-[3.8rem] font-black leading-[1.05] tracking-tight`}
              style={{ color: DARK, }}
            >
              {feat.title}
            </h3>

            {/* Accent rule */}
            <div className={`mp-rule-${index} flex items-center gap-2 h-0.75`} style={{ opacity: 0 }}>
              <div className="h-full w-14 rounded-full" style={{ background: theme.accent }} />
              <div className="h-full w-5 rounded-full" style={{ background: `${theme.accent}45` }} />
              <div className="h-full w-2.5 rounded-full" style={{ background: `${theme.accent}22` }} />
            </div>

            {/* Count badge */}
            <div
              className={`mp-badge-${index} inline-flex items-center gap-3 px-5 py-3 rounded-2xl w-fit`}
              style={{ background: `${theme.accent}09`, border: `1px solid ${theme.accent}1A`, opacity: 0 }}
            >
              <span className="text-3xl font-black" style={{ color: theme.accent, }}>
                {items.length}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                Capabilities
              </span>
            </div>
          </div>

          {/*  RIGHT: Features list */}
          <div className="flex flex-col gap-2.5">
            <div
              className="flex items-center justify-between pb-3 mb-1"
              style={{ borderBottom: `1px solid rgba(0,0,0,0.07)` }}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: 'rgba(0,0,0,0.28)' }}>
                Included Capabilities
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                {items.length} features
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 mt-10 max-w-5xl mx-auto">
              {items.map((item, j) => {
                // Tightened offsets to prevent overlapping
                const xOff = [0, 8, -10, 12, -7, 14, -9, 6, -11, 8, -5, 10, -13, 7, -8, 4, 9, -7, 12, -4][j % 20];
                const yOff = [0, 3, -4, 2, -5, 4, -3, 5, -2, 4, -3, 2, -6, 3, -4, 1, -5, 3, -2, 1][j % 20];

                return (
                  <div
                    key={j}
                    className={`mf-${index}-${j} group relative px-4 py-2 rounded-full transition-all duration-500 hover:z-10`}
                    style={{
                      background: WHITE,
                      border: `1px solid ${BORDER}`,
                      boxShadow: `0 8px 25px -5px ${theme.accent}08`,
                      opacity: 0,
                      transform: `translate(${xOff + 20}px, ${yOff}px)`,
                      willChange: 'transform, opacity',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {/* Floating glow effect */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md -z-10"
                      style={{ background: `${theme.accent}15`, transform: 'scale(1.15)' }}
                    />

                    <div className="flex items-center gap-3">
                      {item?.icon && (
                        <item.icon
                          size={18}
                          strokeWidth={2.5}
                          style={{ color: theme.accent }}
                          className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                        />
                      )}
                      <span
                        className="text-[14px] leading-none font-bold tracking-tight whitespace-nowrap transition-colors duration-300 group-hover:text-black"
                        style={{ color: DARK, }}
                      >
                        {typeof item === 'string' ? item : item?.text}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// MAIN SECTION─
export function Features() {
  const wrapRef = useRef(null)   // scroll wrapper (GSAP pin trigger)
  const pinRef = useRef(null)   // sticky viewport
  const hdrRef = useRef(null)   // intro header
  const [activeIdx, setActiveIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const modules = (featuresNotice ?? []).slice(0, 4)

  // Framer parallax for bg ONLY — never on GSAP targets
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  useEffect(() => {
    const chk = () => setIsMobile(window.innerWidth < 768)
    chk()
    window.addEventListener('resize', chk)
    return () => window.removeEventListener('resize', chk)
  }, [])

  //  GSAP: heading reveal in intro section
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sp = new SplitText('.feat-head', { type: 'chars' })
      gsap.set(sp.chars, { opacity: 0, y: 34, rotateX: -55, transformOrigin: '0 50% -18px' })
      gsap.to(sp.chars, {
        opacity: 1, y: 0, rotateX: 0,
        stagger: 0.013, duration: 0.72, ease: 'expo.out',
        scrollTrigger: { trigger: hdrRef.current, start: 'top 83%', toggleActions: 'play none none none' },
      })
      gsap.from('.feat-eyebrow', {
        opacity: 0, y: 14, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: hdrRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      })
    }, hdrRef)
    return () => ctx.revert()
  }, [])

  //  GSAP: pinned horizontal storytelling (desktop only)
  useLayoutEffect(() => {
    if (isMobile || modules.length === 0) return

    const SCROLL_PER_MODULE = window.innerHeight * 3.0  // Slowed down even more for better UX
    const totalScroll = SCROLL_PER_MODULE * modules.length

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: `+=${totalScroll}`,
          scrub: 1.4,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const idx = Math.min(Math.floor(self.progress * modules.length), modules.length - 1)
            setActiveIdx(idx)
          },
        },
      })

      const seg = 1 / modules.length   // fraction of total timeline per module

      modules.forEach((feat, i) => {
        const items = feat.list ?? []
        const mp = `.mp-${i}`
        const title = `.mp-title-${i}`
        const emoji = `.mp-emoji-${i}`
        const rule = `.mp-rule-${i}`
        const badge = `.mp-badge-${i}`
        const feats = items.map((_, j) => `.mf-${i}-${j}`)

        const start = i * seg
        const hold = seg * 0.52   // how long it stays visible before exit
        const exit = seg * 0.12   // fade-out duration

        //  Enter: fade panel in
        tl.to(mp, { opacity: 1, pointerEvents: 'auto', duration: seg * 0.08, ease: 'power2.out' }, start)

        //  Emoji pop
        tl.fromTo(emoji,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: seg * 0.10, ease: 'back.out(1.5)' },
          start + seg * 0.04
        )

        //  Title slide up (GSAP, not SplitText here to avoid conflicts with pinned context)
        tl.fromTo(title,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: seg * 0.14, ease: 'expo.out' },
          start + seg * 0.06
        )

        //  Accent rule draw
        tl.to(rule, { opacity: 1, duration: seg * 0.10, ease: 'power2.out' }, start + seg * 0.12)

        //  Badge pop
        tl.fromTo(badge,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: seg * 0.10, ease: 'back.out(1.6)' },
          start + seg * 0.14
        )

        //  Feature items: reduced stagger for longer 'hold' time
        if (feats.length > 0) {
          tl.to(feats, {
            opacity: 1,
            x: (i, el) => {
              const m = el.className.match(/mf-\d+-(\d+)/);
              const idx = m ? parseInt(m[1]) : 0;
              return [0, 8, -10, 12, -7, 14, -9, 6, -11, 8, -5, 10, -13, 7, -8, 4, 9, -7, 12, -4][idx % 20];
            },
            y: (i, el) => {
              const m = el.className.match(/mf-\d+-(\d+)/);
              const idx = m ? parseInt(m[1]) : 0;
              return [0, 3, -4, 2, -5, 4, -3, 5, -2, 4, -3, 2, -6, 3, -4, 1, -5, 3, -2, 1][idx % 20];
            },
            stagger: seg * 0.015,
            duration: seg * 0.15,
            ease: 'expo.out',
          }, start + seg * 0.18)
        }

        //  Hold: implicit hold until exit starts

        //  Exit
        if (i < modules.length - 1) {
          tl.to(mp, {
            opacity: 0,
            pointerEvents: 'none',
            duration: exit,
            ease: 'power2.in',
          }, start + seg - exit)
        }
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [isMobile, modules.length])

  const activeTheme = THEMES[activeIdx % THEMES.length]

  return (
    <>
      <MagneticDot />

      {/*  INTRO SECTION (scrolls normally above the pinned scene)  */}
      <section
        id="features"
        style={{ background: BG, }}
        className="relative overflow-hidden"
      >
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 55% 45% at 75% 30%, ${BLUE}06 0%, transparent 70%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 40% 40% at 10% 80%, ${RED}04 0%, transparent 70%)` }} />
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{ backgroundImage: `radial-gradient(circle, ${BLUE}16 1px, transparent 1px)`, backgroundSize: '44px 44px' }}
          />
        </motion.div>

        <div ref={hdrRef} className="relative z-10 max-w-340 mx-auto px-6 sm:px-14 lg:px-20 pt-28 lg:pt-36 pb-14">

          {/* Eyebrow */}
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

          {/* Heading */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <h2
              className="feat-head text-3xl lg:text-5xl font-black leading-[1.03] tracking-tight"
              style={{ color: DARK, maxWidth: 700 }}
            >
              Simplifying school{' '}
              <span className="italic relative inline-block" style={{ color: BLUE }}>
                management
                <Underline delay={0.75} />
              </span>
              {' '}software.
            </h2>
            <p className="text-sm leading-[1.9] lg:text-right shrink-0" style={{ color: MUTED, maxWidth: 270 }}>
              Scroll through each module to explore its full capability set — one by one.
            </p>
          </div>

          {/* Gradient rule */}
          <motion.div
            className="h-px mb-8"
            style={{ background: `linear-gradient(90deg, ${BLUE}35, ${RED}22, transparent)`, transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Module nav pills */}
          {!isMobile && (
            <div className="flex items-center gap-3 flex-wrap">
              {modules.map((feat, i) => {
                const t = THEMES[i % THEMES.length]
                const on = i === activeIdx
                return (
                  <div
                    key={feat.title}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.16em]"
                    style={{
                      background: on ? `${t.accent}12` : 'rgba(0,0,0,0.04)',
                      color: on ? t.accent : 'rgba(0,0,0,0.32)',
                      border: `1px solid ${on ? `${t.accent}28` : 'rgba(0,0,0,0.07)'}`,
                      transition: 'all 0.45s ease',
                    }}
                  >
                    {on && <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: t.accent }} />}
                    {t.num}. {feat.title}
                  </div>
                )
              })}
              <motion.span
                className="text-[10px] font-bold uppercase tracking-[0.2em] ml-1"
                style={{ color: 'rgba(0,0,0,0.2)' }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↓ Scroll
              </motion.span>
            </div>
          )}
        </div>
      </section>

      {/* DESKTOP: PINNED SEQUENTIAL SCROLL */}
      <div className={isMobile ? 'hidden' : 'block'}>
        <div ref={wrapRef} style={{ }}>
          <div
            ref={pinRef}
            className="relative w-full overflow-hidden"
            style={{ height: '100vh', background: BG }}
          >
            {/* Reactive ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{ background: `radial-gradient(ellipse 65% 65% at 82% 50%, ${activeTheme.light} 0%, transparent 65%)` }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.22]"
              style={{ backgroundImage: `radial-gradient(circle, ${BLUE}14 1px, transparent 1px)`, backgroundSize: '44px 44px' }}
            />

            {/* Left progress sidebar */}
            {/* <div className="absolute left-7 top-4/5 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-4">
              {modules.map((feat, i) => {
                const t  = THEMES[i % THEMES.length]
                const on = i === activeIdx
                return (
                  <div key={i} className="flex items-center gap-3 transition-all duration-500" style={{ opacity: on ? 1 : 0.25 }}>
                    <div
                      className="rounded-full transition-all duration-400"
                      style={{ width: on ? 10 : 6, height: on ? 10 : 6, background: on ? t.accent : 'rgba(0,0,0,0.18)' }}
                    />
                    {on && (
                      <motion.span
                        className="text-[9px] font-black uppercase tracking-[0.22em] whitespace-nowrap"
                        style={{ color: t.accent }}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {t.label}
                      </motion.span>
                    )}
                  </div>
                )
              })}
            </div> */}

            {/* Bottom progress strips */}
            <div className="absolute bottom-0 left-0 right-0 z-30 flex" style={{ height: 3 }}>
              {modules.map((_, i) => {
                const t = THEMES[i % THEMES.length]
                const on = i === activeIdx
                return (
                  <div
                    key={i}
                    className="flex-1 transition-all duration-500"
                    style={{ background: on ? t.accent : `${t.accent}25` }}
                  />
                )
              })}
            </div>

            {/* Module index counter — bottom right */}
            <div className="absolute bottom-8 right-10 z-30 hidden lg:block">
              <span
                className="text-[4rem] font-black leading-none"
                style={{
                  color: `${activeTheme.accent}14`,
                  transition: 'color 0.5s ease',
                }}
              >
                {activeTheme.num}
              </span>
            </div>

            {/* Scroll cue — fades when past first module */}
            <motion.div
              className="absolute bottom-9 right-10 z-30 hidden lg:flex flex-col items-end gap-1.5"
              animate={{ opacity: activeIdx === 0 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.26em]" style={{ color: 'rgba(0,0,0,0.22)' }}>
                Scroll to explore
              </span>
              <motion.svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="rgba(0,0,0,0.22)" strokeWidth="2" strokeLinecap="round"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </motion.svg>
            </motion.div>

            {/*  Module panels stacked (GSAP drives opacity + inner transforms) */}
            <div className="relative w-full h-full">
              {modules.map((feat, i) => (
                <ModulePanel
                  key={feat.title}
                  feat={feat}
                  index={i}
                  theme={THEMES[i % THEMES.length]}
                  total={modules.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: STACKED CARDS */}
      <div className={isMobile ? 'block' : 'hidden'}>
        <section
          className="relative py-16 px-5 overflow-hidden"
          style={{ background: BG, }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.28]"
            style={{ backgroundImage: `radial-gradient(circle, ${BLUE}16 1px, transparent 1px)`, backgroundSize: '36px 36px' }}
          />

          {/* Mobile heading */}
          <div className="relative z-10 text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-5"
              style={{ background: `${BLUE}0C`, color: BLUE, border: `1px solid ${BLUE}1E` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BLUE }} />
              Platform Features
            </div>
            <h2 className="text-[2.4rem] font-black leading-[1.06] tracking-tight mb-3" style={{ color: DARK, }}>
              Built to{' '}
              <span className="italic relative inline-block" style={{ color: BLUE }}>
                simplify
                <Underline delay={0.3} />
              </span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Explore each module and its capabilities below.
            </p>
          </div>

          {/* Mobile module cards */}
          <div className="relative z-10 flex flex-col gap-8">
            {modules.map((feat, i) => {
              const t = THEMES[i % THEMES.length]
              return (
                <motion.div
                  key={feat.title}
                  className="rounded-3xl overflow-hidden"
                  style={{ background: WHITE, border: `1px solid ${BORDER}`, boxShadow: `0 4px 24px ${t.accent}0A` }}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Module header */}
                  <div
                    className="p-6 pb-5"
                    style={{ background: `linear-gradient(135deg, ${t.accent}09 0%, transparent 100%)`, borderBottom: `1px solid ${BORDER}` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3"
                          style={{ background: `${t.accent}10`, color: t.accent, border: `1px solid ${t.accent}20` }}
                        >
                          <span className="w-1 h-1 rounded-full" style={{ background: t.accent }} />
                          {t.label} · {t.num}
                        </div>
                        <h3 className="text-xl font-black leading-snug" style={{ color: DARK, }}>{feat.title}</h3>
                      </div>
                      <div className="text-4xl">{t.emoji}</div>
                    </div>
                    <div
                      className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[10px] font-bold"
                      style={{ background: `${t.accent}09`, color: t.accent, border: `1px solid ${t.accent}18` }}
                    >
                      {(feat.list ?? []).length} capabilities
                    </div>
                  </div>

                  {/* Feature items */}
                  <div className="p-3.5 flex flex-col gap-2">
                    {(feat.list ?? []).map((item, j) => (
                      <motion.div
                        key={j}
                        className="flex items-start gap-2 p-1.5 rounded-xl"
                        style={{ background: BG, border: '1px solid rgba(0,0,0,0.05)' }}
                        initial={{ opacity: 0, x: 14 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-10px' }}
                        transition={{ delay: j * 0.04, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ background: `${t.accent}07`, x: 3, transition: { duration: 0.2 } }}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${t.accent}14`, border: `1px solid ${t.accent}28` }}
                        >
                          {item?.icon && (
                            <item.icon
                              size={16}
                              strokeWidth={2.5}
                              style={{ color: t.accent }}
                            />
                          )}
                        </div>
                        <span className="text-[13px] leading-tight font-bold pt-1.5" style={{ color: DARK }}>
                          {typeof item === 'string' ? item : item?.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}