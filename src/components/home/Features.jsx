import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import formImg from '../../assets/form-img.png'
import { featuresNotice } from './data'
import { SectionReveal } from './SectionReveal'
import { fadeInUp, slideInLeft, slideInRight, fadeIn } from '../../lib/animations'

// FEATURE DIALOG
function FeatureDialog({ feature, onClose }) {

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]"
        style={{ willChange: 'opacity' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden z-10"
        style={{ 
          willChange: 'transform, opacity, scale',
          contain: 'layout paint strict'
        }}
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ 
          type: 'spring', 
          stiffness: 450, 
          damping: 32,
          mass: 0.6
        }}
      >
        <div className="relative px-8 pt-8 pb-6 text-white" style={{ background: `linear-gradient(135deg, #005280 0%, #0284c7 100%)` }}>
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: feature.accent, transform: 'translate(30%, -30%)', willChange: 'transform' }}
          />

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center ring-2 ring-white/30 overflow-hidden">
              <img src={feature.dialogueImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Features</p>
              <h2 className="text-white text-2xl font-bold">{feature.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-6 max-h-[55vh] overflow-y-auto custom-scroll">
          <ul className="space-y-3">
              {feature.list.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 text-sm"
                  style={{ willChange: 'opacity, transform' }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.02, duration: 0.3 }}
                >
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: feature.accent ?? '#005280' }}
                >
                  ✓
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="px-8 pb-7 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #005280, #0284c7)' }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Features() {
  const [dialogueFeature, setDialogueFeature] = useState(null)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    const width = window.innerWidth - document.documentElement.clientWidth
    setScrollbarWidth(width)
  }, [])

  useEffect(() => {
    const body = document.body
    const html = document.documentElement
    
    if (dialogueFeature) {
      body.classList.add('modal-open')
      if (scrollbarWidth > 0) {
        html.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
      }
    } else {
      body.classList.remove('modal-open')
      html.style.removeProperty('--scrollbar-width')
    }

    return () => {
      body.classList.remove('modal-open')
      html.style.removeProperty('--scrollbar-width')
    }
  }, [dialogueFeature, scrollbarWidth])

  return (
    <section id="features" className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — App Overview */}
          <SectionReveal className="flex flex-col gap-0">
            <motion.div variants={slideInLeft} className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #005280 0%, #0284c7 100%)' }}>
              <div className="px-10 py-8">
                <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold mb-1">About</p>
                <h3 className="text-white text-3xl font-black">App Overview</h3>
              </div>
            </motion.div>
            <motion.div variants={fadeIn} className="mt-5 w-full h-[400px] flex justify-center">
              <img src={formImg} alt="App" className="w-[330px] object-cover h-full" />
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-4">
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                Simplifying School Management with User-Friendly Software.
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                iSchool Mobile App enables management & teachers to update important & urgent information at anytime
                while students & parents get notifications and can track progress in real time.
              </p>
            </motion.div>
          </SectionReveal>

          {/* Right — Key Specs */}
          <SectionReveal className="flex flex-col gap-0">
            <motion.div 
              variants={slideInRight} 
              className="rounded-2xl overflow-hidden" 
              style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #005280 100%)', willChange: 'transform, opacity' }}
            >
              <div className="px-10 py-8">
                <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold mb-1">Features</p>
                <h3 className="text-white text-3xl font-black">Key Specifications</h3>
              </div>
            </motion.div>

            <motion.div 
              className="mt-8 flex flex-col gap-6"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 }
                }
              }}
              style={{ willChange: 'transform' }}
            >
              {featuresNotice.map((feat, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  style={{ willChange: 'transform, opacity' }}
                  className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer"
                  onClick={() => setDialogueFeature(feat)}
                >
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl overflow-hidden"
                    style={{ ringColor: feat.accent }}
                  >
                    <img src={feat.image} alt={feat.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 mb-2">{feat.title}</h4>
                    <ul className="flex flex-col gap-1 mb-3">
                      {feat.list.slice(0, 3).map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-slate-500 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: feat.accent }} />
                          {item}
                        </li>
                      ))}
                      <li className="text-slate-400 text-xs">+{feat.list.length - 3} more features</li>
                    </ul>
                    <button
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 cursor-pointer"
                      style={{ background: feat.accent ?? '#005280' }}
                    >
                      View All Features
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </SectionReveal>
        </div>
      </div>

      <AnimatePresence>
        {dialogueFeature && (
          <FeatureDialog feature={dialogueFeature} onClose={() => setDialogueFeature(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
