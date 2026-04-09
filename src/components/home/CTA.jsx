import React from 'react'
import { motion } from 'framer-motion'
import ctaVectorLeft from '../../assets/iSchool_files/cta-vector-1.png'
import ctaVectorRight from '../../assets/iSchool_files/cta-vector-2.png'
import ctaImageVector from '../../assets/iSchool_files/cta-img-vector.svg'
import ctaImage from '../../assets/iSchool_files/cta-img.png'
import appStoreImg from '../../assets/app-store.svg'
import googlePlayImg from '../../assets/google-play.svg'
import { SectionReveal } from './SectionReveal'
import { fadeInUp, scaleUp } from '../../lib/animations'

export function CTA() {
  return (
    <section className="relative overflow-hidden py-0" style={{ background: 'linear-gradient(135deg, #003a5f 0%, #005280 50%, #0369a1 100%)' }}>
      {/* Vectors — pinned to edges */}
      <div className="absolute left-0 top-0 h-full pointer-events-none">
        <img src={ctaVectorLeft} alt="" className="h-full object-cover object-right opacity-60" />
      </div>
      <div className="absolute right-0 top-0 h-full pointer-events-none">
        <img src={ctaVectorRight} alt="" className="h-full object-cover object-left opacity-60" />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(56,189,248,0.15) 0%, transparent 60%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-12 py-20 lg:py-28">
        {/* Text */}
        <SectionReveal className="flex-1 max-w-xl">
          <div className="flex flex-col gap-6">
            <motion.span variants={fadeInUp} className="inline-block text-yellow-400 text-xs uppercase tracking-[0.2em] font-bold">
              Get the App
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-black text-white leading-tight">
              Download<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #38bdf8, #7dd3fc)' }}>
                iSchool
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/65 text-base leading-relaxed">
              Simplify, Learn, Grow! Get iSchool on your device and transform your school's management experience today.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <motion.a
                href="https://apps.apple.com/pk/app/i-school/id6450982421"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                target="_blank" rel="noopener noreferrer"
              >
                <img src={appStoreImg} className="h-12" alt="App Store" />
              </motion.a>
              <motion.a
                href="https://play.google.com/store/apps/details?id=com.ischool.pk&hl=en_US"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                target="_blank" rel="noopener noreferrer"
              >
                <img src={googlePlayImg} className="h-12" alt="Google Play" />
              </motion.a>
            </motion.div>
          </div>
        </SectionReveal>

        {/* CTA Image */}
        <SectionReveal className="flex-1 flex justify-center lg:justify-end">
          <motion.div
            variants={scaleUp}
            className="relative"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src={ctaImageVector} alt="" className="absolute inset-0 w-full h-full object-contain opacity-60 pointer-events-none" />
            <img src={ctaImage} alt="Download iSchool" className="relative w-72 lg:w-96 drop-shadow-2xl" />
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  )
}
