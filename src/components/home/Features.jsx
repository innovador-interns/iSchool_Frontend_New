import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import formImg from '../../assets/form-img.png'
import { featuresNotice } from './data'
import { SectionReveal } from './SectionReveal'
import { X, Check, ChevronRight } from 'lucide-react'

function FeaturePanel({ feature, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      role="presentation"
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-panel-title"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="relative z-10 flex h-full w-full max-w-full flex-col bg-white shadow-2xl sm:max-w-[440px] sm:rounded-l-3xl sm:border-l sm:border-slate-100"
      >
        <div
          className="relative overflow-hidden px-6 pb-7 pt-8 text-white mt-18"
          style={{
            background: `linear-gradient(145deg, ${feature.accent} 0%, color-mix(in srgb, ${feature.accent} 55%, #0f172a) 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div className="relative flex items-start gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-1 shadow-inner backdrop-blur-sm">
              <img
                src={feature.image}
                alt=""
                className="h-full w-full rounded-[0.65rem] object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                Feature overview
              </p>
              <h2 id="feature-panel-title" className="mt-1 text-xl font-bold leading-snug">
                {feature.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label="Close panel"
            >
              <X size={20} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
          <p className="mb-4 text-sm font-medium text-slate-500">
            Everything included in this area
          </p>
          <ul className="space-y-2">
            {feature.list.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-sm leading-relaxed text-slate-700"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${feature.accent} 18%, white)`,
                    color: feature.accent,
                  }}
                >
                  <Check size={12} strokeWidth={3} aria-hidden />
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Features() {
  const [activeFeature, setActiveFeature] = useState(null)
  const closePanel = useCallback(() => setActiveFeature(null), [])

  return (
    <section id="features" className="overflow-hidden bg-gradient-to-b from-white via-slate-50/80 to-slate-100/60 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <SectionReveal>
            <div className="relative">
              <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-sky-100/80 blur-3xl" />
              <div className="absolute -bottom-12 -right-8 h-80 w-80 rounded-full bg-rose-100/70 blur-3xl" />

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                <p className="mb-3 inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-800">
                  Why iSchool
                </p>
                <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-[2.5rem]">
                  Simplifying school management software.
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
                  iSchool brings students, teachers, and communication together in one place—with a
                  calm, modern experience your whole school can rely on.
                </p>

                <div className="relative mt-10 w-full max-w-[min(100%,380px)]">
                  <div
                    className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-100/50 to-rose-100/40 blur-xl"
                    aria-hidden
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                    className="relative overflow-hidden"
                  >
                    <img
                      src={formImg}
                      alt="iSchool dashboard preview"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="flex flex-col gap-4">
              <p className="mb-1 text-sm font-medium text-slate-500 lg:hidden">
                Tap a card to see the full feature list
              </p>
              {featuresNotice.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md focus-within:border-slate-300 focus-within:shadow-md focus-within:outline-none"
                  style={{ boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)' }}
                  onClick={() => setActiveFeature(feat)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveFeature(feat)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open details for ${feat.title}`}
                >
                  <div
                    className="pointer-events-none absolute bottom-4 left-0 top-4 w-1 rounded-r-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
                    style={{ backgroundColor: feat.accent }}
                    aria-hidden
                  />
                  <div className="relative flex items-start gap-4">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-inner ring-1 ring-black/[0.04]"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${feat.accent} 12%, white)`,
                      }}
                    >
                      <img src={feat.image} alt="" className="h-11 w-11 object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:justify-between">
                        <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                        <span
                          className="inline-flex items-center gap-0.5 text-xs font-semibold transition-colors sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                          style={{ color: feat.accent }}
                        >
                          Read features
                          <ChevronRight size={14} strokeWidth={2.5} className="opacity-80" />
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {feat.list[0]}
                      </p>
                      <div className="mt-4 h-px w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full w-0 transition-all duration-300 group-hover:w-full group-focus-within:w-full"
                          style={{ backgroundColor: feat.accent }}
                          aria-hidden
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>

      <AnimatePresence>
        {activeFeature && <FeaturePanel feature={activeFeature} onClose={closePanel} />}
      </AnimatePresence>
    </section>
  )
}
