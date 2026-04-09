import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import appStoreImg from '../../assets/app-store.svg'
import googlePlayImg from '../../assets/google-play.svg'
import { features } from './data'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Hero() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, -80])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3])

  return (
    <section className="relative overflow-hidden bg-[#003a5f] min-h-screen flex flex-col">

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        style={{ opacity: heroOpacity }}
        className="flex flex-col items-start justify-center flex-1 gap-7 px-8 sm:px-16 lg:px-32 pt-18 pb-24 max-w-4xl"
      >
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white px-4 py-2 text-xs uppercase tracking-[0.2em] font-semibold backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Welcome to <span className="text-yellow-400">iSchool</span>
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight"
          variants={fadeUp} custom={1} initial="hidden" animate="visible"
        >
          Revolutionize<br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #38bdf8, #7dd3fc)' }}>
            School Management
          </span>
        </motion.h1>

        <motion.p
          className="max-w-xl text-white/70 text-base sm:text-lg leading-relaxed"
          variants={fadeUp} custom={2} initial="hidden" animate="visible"
        >
          Experience state-of-the-art software designed specifically for efficient school management. Effortlessly oversee and regulate all aspects of your school according to your unique requirements.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 mt-2"
          variants={fadeUp} custom={3} initial="hidden" animate="visible"
        >
          <motion.a
            href="https://apps.apple.com/pk/app/i-school/id6450982421"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img src={appStoreImg} className="h-12" alt="App Store" />
          </motion.a>
          <motion.a
            href="https://play.google.com/store/apps/details?id=com.ischool.pk&hl=en_US"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img src={googlePlayImg} className="h-12" alt="Google Play" />
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Feature Cards — bottom */}
      <div className="w-full bg-linear-to-t from-black/30 to-transparent px-4 sm:px-8 lg:px-16 pb-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 max-w-6xl mx-auto border-t border-white/10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center gap-3 px-6 py-8 border-r border-white/10 last:border-r-0 text-center group cursor-default"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-18 h-18 rounded-2xl bg-white flex items-center justify-center group-hover:bg-white/90 transition-colors shadow-lg"
                whileHover={{ rotate: [0, -6, 6, 0] }}
                transition={{ duration: 0.4 }}
              >
                <img src={f.img} className="h-12 w-12 object-contain" alt={f.title} />
              </motion.div>
              <h3 className="text-white font-semibold text-md leading-tight">{f.title}</h3>
              <p className="text-white/55 text-sm">{f.subTitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
