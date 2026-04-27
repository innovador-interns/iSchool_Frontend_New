import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import ctaVectorLeft from '../../assets/iSchool_files/cta-vector-1.png'
import ctaVectorRight from '../../assets/iSchool_files/cta-vector-2.png'
import ctaImageVector from '../../assets/iSchool_files/cta-img-vector.svg'
import ctaImage from '../../assets/iSchool_files/cta-img.png'
import appStoreImg from '../../assets/app-store.svg'
import googlePlayImg from '../../assets/google-play.svg'
import { SectionReveal } from './SectionReveal'
import { fadeInUp, scaleUp } from '../../lib/animations'

// Micro-stagger for text children
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
}

const textFade = {
  hidden: { opacity: 0, y: 28, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  }
}

export function CTA() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const imgFloat = useTransform(scrollYProgress, [0, 1], ['3%', '-5%'])
  const vectorParallax = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-0"
      style={{ background: 'linear-gradient(140deg, #001e36 0%, #003a5f 40%, #005280 70%, #0369a1 100%)' }}
    >
      {/* Section transition from dark screens section */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#003a5f] to-transparent z-10 pointer-events-none" />

      {/* ── Background depth ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 28% 55%, rgba(56,189,248,0.12) 0%, transparent 55%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C90606]/8 rounded-full blur-[80px]" />
      </div>

      {/* Edge Vectors — parallax */}
      <motion.div style={{ y: vectorParallax }} className="absolute left-0 top-0 h-full pointer-events-none z-0">
        <img src={ctaVectorLeft} alt="" className="h-full object-cover object-right opacity-50" />
      </motion.div>
      <motion.div style={{ y: vectorParallax }} className="absolute right-0 top-0 h-full pointer-events-none z-0">
        <img src={ctaVectorRight} alt="" className="h-full object-cover object-left opacity-50" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-16 py-24 lg:py-36">

        {/* ── Text ── */}
        <SectionReveal className="flex-1 max-w-xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-6"
          >
            <motion.span variants={textFade} className="inline-flex items-center gap-2 text-yellow-400 text-[11px] uppercase tracking-[0.2em] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Get the App
            </motion.span>

            <motion.h2 variants={textFade} className="text-[2.8rem] lg:text-[3.5rem] font-black text-white leading-[1.08] tracking-tight">
              Download<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#7dd3fc]">
                iSchool
              </span>
            </motion.h2>

            {/* Divider */}
            <motion.div variants={textFade} className="flex items-center gap-2">
              <div className="w-10 h-[2.5px] bg-yellow-400/70 rounded-full" />
              <div className="w-3 h-[2.5px] bg-yellow-400/30 rounded-full" />
            </motion.div>

            <motion.p variants={textFade} className="text-white/60 text-[1.02rem] leading-[1.8]">
              Simplify, Learn, Grow — get iSchool on your device and transform your school's
              management experience today.
            </motion.p>

            <motion.div variants={textFade} className="flex flex-wrap gap-4 pt-2">
              {[
                { href: 'https://apps.apple.com/pk/app/i-school/id6450982421', img: appStoreImg, alt: 'App Store' },
                { href: 'https://play.google.com/store/apps/details?id=com.ischool.pk&hl=en_US', img: googlePlayImg, alt: 'Google Play' },
              ].map(({ href, img, alt }) => (
                <motion.a
                  key={alt}
                  href={href}
                  whileHover={{ scale: 1.06, y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-shadow duration-300"
                >
                  <img src={img} className="h-12" alt={alt} />
                </motion.a>
              ))}
            </motion.div>

            {/* Micro social proof */}
            <motion.div variants={textFade} className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                {['#005280', '#C90606', '#0369a1', '#003a5f'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#003a5f]" style={{ backgroundColor: c, opacity: 0.8 }} />
                ))}
              </div>
              <span className="text-white/50 text-[0.82rem] font-medium">Trusted by 50k+ users</span>
            </motion.div>
          </motion.div>
        </SectionReveal>

        {/* ── Image ── */}
        <SectionReveal className="flex-1 flex justify-center lg:justify-end">
          <motion.div
            className="relative"
            style={{ y: imgFloat }}
          >
            {/* Vector glow bg */}
            <img
              src={ctaImageVector}
              alt=""
              className="absolute inset-0 w-full h-full object-contain opacity-50 pointer-events-none scale-110"
            />

            {/* Phone */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative will-change-transform"
            >
              <img
                src={ctaImage}
                alt="Download iSchool"
                className="relative w-72 lg:w-96 drop-shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
              />
            </motion.div>

            {/* Reflection */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-xl rounded-full opacity-30"
              style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.5) 0%, transparent 70%)' }}
            />
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  )
}