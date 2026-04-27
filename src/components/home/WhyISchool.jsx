import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { lists } from './data'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import vector from '../../assets/admission-vector-1.svg'

// Per-card Framer variants — intentional, not accidental
const cardVariants = {
  rest: {
    y: 0,
    boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
  },
  hover: {
    y: -16,
    boxShadow: '0 28px 64px rgba(0,82,128,0.11)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
  }
}

const glowVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

const lineVariants = {
  rest: { width: '3rem', background: 'linear-gradient(to right, #e5e7eb, #e5e7eb)' },
  hover: {
    width: '100%',
    background: 'linear-gradient(to right, #C90606, #005280)',
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
  }
}

export function WhyISchool() {
  const sectionRef = useRef(null);

  const containerRef = useScrollReveal({
    y: 56,
    stagger: 0.1,
    duration: 1.25,
    ease: 'expo.out',
    start: 'top 80%',
  });

  // Background parallax drift — GSAP handles the cards, Framer handles bg blobs
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const vectorY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section
      id="whyischool"
      ref={(el) => {
        containerRef.current = el;
        sectionRef.current = el;
      }}
      className="py-28 lg:py-44 overflow-hidden relative bg-white"
    >
      {/* ── Layered Background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Tinted right panel */}
        <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-l from-[#005280]/[0.025] to-transparent" />

        {/* Animated blobs */}
        <motion.div style={{ y: blobY }} className="absolute inset-0">
          <div className="absolute bottom-1/4 -left-16 w-72 h-72 bg-[#C90606]/[0.035] rounded-full blur-[60px]" />
          <div className="absolute top-16 right-[10%] w-64 h-64 bg-[#005280]/[0.04] rounded-full blur-[56px]" />
        </motion.div>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'radial-gradient(circle, #005280 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Watermark vector */}
      <motion.div
        style={{ y: vectorY }}
        className="absolute top-24 left-8 w-80 opacity-[0.025] pointer-events-none select-none rotate-[14deg] z-0"
      >
        <img src={vector} alt="" className="h-full w-full object-contain" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 relative z-10">

        {/* ── Section Header ── */}
        <div className="reveal-item flex flex-col items-center text-center gap-6 mb-28">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C90606]/8 text-[#C90606] text-[11px] font-bold uppercase tracking-[0.18em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C90606] animate-pulse" />
            Distinction
          </span>

          <h2 className="text-4xl md:text-[3.6rem] font-extrabold text-[#1A1A1A] tracking-tight leading-[1.1]">
            Why Educational Leaders <br />
            <span className="text-[#005280] relative inline-block">
              Choose iSchool
              {/* Animated underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 340 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 6 Q85 2 170 5 Q255 8 338 4"
                  stroke="#C90606"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </span>
          </h2>

          {/* Divider pill group */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-[3px] bg-[#C90606] rounded-full" />
            <div className="w-3 h-[3px] bg-[#C90606]/40 rounded-full" />
            <div className="w-1.5 h-[3px] bg-[#C90606]/20 rounded-full" />
          </div>

          <p className="max-w-2xl text-[#666] text-[1.05rem] md:text-lg leading-[1.8]">
            Discover why educational institutions worldwide trust iSchool to transform
            their administrative and academic horizons.
          </p>
        </div>

        {/* ── Features Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {lists.map((item, i) => (
            <motion.div
              key={i}
              className="reveal-item group relative"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
            >
              {/* Glow halo */}
              <motion.div
                variants={glowVariants}
                className="absolute -inset-2 bg-gradient-to-br from-[#005280]/18 via-transparent to-[#C90606]/8 rounded-[44px] blur-2xl z-0"
              />

              <div className="relative bg-white p-10 rounded-[36px] border border-gray-100/90 transition-colors duration-500 group-hover:border-blue-100/60 flex flex-col h-full z-10 overflow-hidden">

                {/* Number watermark */}
                <div className="absolute top-5 right-7 text-[5rem] font-black text-gray-50 group-hover:text-[#005280]/[0.06] transition-colors duration-500 leading-none select-none">
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </div>

                {/* Icon */}
                <motion.div
                  className="w-[72px] h-[72px] rounded-2xl bg-gray-50 flex items-center justify-center mb-10 group-hover:bg-[#005280] transition-all duration-500 shadow-inner"
                  whileHover={{ rotate: 9, scale: 1.07 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-9 w-9 object-contain group-hover:invert group-hover:brightness-0 transition-all duration-500"
                  />
                </motion.div>

                {/* Text */}
                <div className="mt-auto">
                  <h3 className="text-[1.35rem] font-bold text-[#1A1A1A] mb-3 group-hover:text-[#005280] transition-colors duration-300 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[#666] text-[0.9rem] leading-[1.8]">
                    {item.desc}
                  </p>
                </div>

                {/* Animated bottom rule */}
                <motion.div
                  variants={lineVariants}
                  className="mt-8 h-[3px] rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}