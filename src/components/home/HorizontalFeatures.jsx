import React, { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { moduleFeatures } from './data'

const ModuleCard = ({ module, index }) => {
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative w-full min-w-75"
    >
      <div
        className="
          h-87.5 flex flex-col justify-between
          bg-white border border-slate-200
          rounded-2xl p-6
          shadow-sm hover:shadow-md
          transition-all duration-300
        "
      >
        {/* Top Row */}
        <div className="flex items-start justify-between mb-6">
          {/* Icon */}
          <div
            className="
              w-12 h-12 rounded-xl
              bg-slate-100 border border-slate-200
              flex items-center justify-center
              group-hover:bg-slate-50 transition
            "
          >
            <img src={module.icon} alt={module.title} className="w-6 h-6" />
          </div>

          {/* Number */}
          <span className="text-slate-200 font-semibold text-3xl tracking-tight">
            {num}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-2">
            {module.category || 'Module'}
          </p>

          <h3 className="text-[1.05rem] font-semibold text-slate-900 leading-snug mb-3">
            {module.title}
          </h3>

          <p className="text-[15px] text-slate-600">
            {module.description}
          </p>
        </div>

      </div>
    </motion.div>
  )
}

export function HorizontalFeatures() {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const rightRef = useRef(null)
  const progRef = useRef(null)
  const rafRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const getScrollAmount = useCallback(() => {
    if (!trackRef.current || !rightRef.current) return 0
    return Math.max(0, trackRef.current.scrollWidth - rightRef.current.offsetWidth)
  }, [])

  const setupWrapper = useCallback(() => {
    if (!wrapperRef.current) return
    if (window.innerWidth < 768) {
      wrapperRef.current.style.height = 'auto'
      return
    }
    wrapperRef.current.style.height = `${window.innerHeight + getScrollAmount()}px`
  }, [getScrollAmount])

  const updateScroll = useCallback(() => {
    if (!wrapperRef.current || !trackRef.current) return

    if (window.innerWidth < 768) {
      trackRef.current.style.transform = 'none'
      if (progRef.current) progRef.current.style.transform = 'scaleX(0)'
      return
    }

    const sa = getScrollAmount()
    if (sa === 0) return
    const scrolled = -wrapperRef.current.getBoundingClientRect().top
    if (scrolled < 0 || scrolled > sa) return

    const p = Math.min(1, scrolled / sa)
    trackRef.current.style.transform = `translateX(${-(p * sa)}px)`
    trackRef.current.style.transition = 'none'
    if (progRef.current) progRef.current.style.transform = `scaleX(${p})`
    setProgress(p)
  }, [getScrollAmount])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateScroll)
    }
    const onResize = () => {
      checkMobile()
      setupWrapper()
      updateScroll()
    }
    const init = () => {
      checkMobile()
      setupWrapper()
      updateScroll()
    }

    document.fonts?.ready ? document.fonts.ready.then(init) : window.addEventListener('load', init, { once: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    checkMobile() // Initial check

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [setupWrapper, updateScroll])

  return (
    <div ref={wrapperRef} id='modules' className="relative">
      <div className={`
        ${isMobile ? 'relative h-auto' : 'sticky top-0 h-screen overflow-hidden'}
      `} style={{ background: '#fafaf8' }}>

        {/* Top strip */}
        <div className={`
          ${isMobile ? 'relative px-6' : 'absolute inset-x-0 top-0 z-30 px-11'}
          flex items-center justify-between border-b border-[#e8e6e1]
        `}
          style={{ height: 52, background: '#fafaf8' }}>
          <span className="text-[10.5px] font-medium tracking-widest uppercase text-[#999]">
            {isMobile ? 'Modules' : 'iSchool — Core Modules'}
          </span>
          <span className="flex items-center gap-2 text-[10.5px] font-medium text-[#444]">
            <span className="w-1.25 h-1.25 rounded-full bg-[#c9000a] animate-pulse" />
            {moduleFeatures.length} {isMobile ? 'Modules' : 'integrated modules'}
          </span>
        </div>

        {/* Left panel */}
        <div
          className={`
            ${isMobile ? 'relative w-full border-b' : 'absolute left-0 z-20 border-r h-full'}
            flex flex-col justify-between border-[#e8e6e1]
          `}
          style={{
            top: isMobile ? 0 : 52,
            width: isMobile ? '100%' : 340,
            background: '#f3f1ec',
            padding: isMobile ? '40px 24px' : '52px 44px',
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,0,0,0.028) 39px,rgba(0,0,0,0.028) 40px)',
          }}
        >
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-6 h-0.5 bg-[#c9000a]" />
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#c9000a]">Integrated Ecosystem</span>
            </div>
            <h2
              className="leading-[1.06] tracking-[-0.02em] mb-5 text-[#0d0d0d]"
              style={{ fontSize: 'clamp(2.4rem,3.2vw,3.6rem)' }}
            >
              Powerful<br /><em className="italic text-[#c9000a]">Modules</em><br />Built&nbsp;to Scale
            </h2>
            <p className="text-sm leading-[1.8] text-[#444] font-light max-w-52.5 mb-7">
              The core pillars that make iSchool the most comprehensive school management platform.
            </p>
            <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 bg-white border border-[#e8e6e1] rounded-full text-[11px] font-medium text-[#444]">
              <strong className="text-[15px] font-bold text-[#0d0d0d]">{moduleFeatures.length}</strong> integrated modules
            </div>
          </div>

          {!isMobile && (
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-2 text-[10px] tracking-[0.08em] text-[#999] font-medium">
                  <span>Progress</span><span>{Math.round(progress * 100)}%</span>
                </div>
                <div className="h-px bg-[#e8e6e1] rounded-full overflow-hidden">
                  <div ref={progRef} className="h-full bg-[#0d0d0d] rounded-full"
                    style={{ transform: 'scaleX(0)', transformOrigin: 'left' }} />
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-medium tracking-[0.15em] uppercase text-[#999]">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-6.5 h-6.5 rounded-full border border-[#e8e6e1] flex items-center justify-center shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
                Scroll to explore
              </div>
            </div>
          )}
        </div>

        {/* Right — card track */}
        <div
          ref={rightRef}
          className={`
            ${isMobile ? 'relative w-full overflow-x-auto pb-12' : 'absolute right-0 overflow-hidden'}
          `}
          style={{
            top: isMobile ? 0 : 52,
            bottom: 0,
            left: isMobile ? 0 : 340
          }}
        >
          {/* Fades - hidden on mobile for better scrolling experience */}
          {!isMobile && (
            <>
              <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none bg-linear-to-r from-[#fafaf8] to-transparent" />
              <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none bg-linear-to-l from-[#fafaf8] to-transparent" />
            </>
          )}

          <div
            ref={trackRef}
            className={`flex items-center gap-6 ${isMobile ? 'px-6 py-10' : 'h-full px-20'}`}
          >
            {moduleFeatures.map((mod, i) => (
              <div key={i} className={isMobile ? 'min-w-70 sm:min-w-[320px]' : ''}>
                <ModuleCard module={mod} index={i} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default HorizontalFeatures