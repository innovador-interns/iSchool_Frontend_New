import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import aboutImg from '../../assets/about-img.png'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// Stagger container variants — Framer Motion for micro
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    }
  }
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } // expo.out
  }
}

export function About() {
  const sectionRef = useRef(null)

  // GSAP scroll reveal for .reveal-item elements
  const containerRef = useScrollReveal({
    y: 48,
    stagger: 0.13,
    duration: 1.15,
    ease: 'power4.out',
    start: 'top 80%',
  });

  // Parallax for the image — Framer Motion scrub
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])
  const bgBlobY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section
      id="about"
      ref={(el) => {
        containerRef.current = el
        sectionRef.current = el
      }}
      className="py-28 lg:py-40 bg-white overflow-hidden relative"
    >
      {/* ── Layered Depth Background ── */}
      <motion.div
        style={{ y: bgBlobY }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        {/* Primary glow */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-[480px] h-[480px] bg-[#005280]/6 rounded-full blur-[80px]" />
        {/* Accent glow */}
        <div className="absolute bottom-10 right-0 w-[300px] h-[300px] bg-[#C90606]/4 rounded-full blur-[60px]" />
        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#005280 1px, transparent 1px), linear-gradient(90deg, #005280 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 flex flex-col lg:flex-row items-center gap-24 lg:gap-32">

        {/* ── Left: Image Block ── */}
        <div className="reveal-item flex-1 relative group w-full max-w-xl lg:max-w-none">

          {/* Halo glow behind image */}
          <div className="absolute -inset-6 bg-gradient-to-tr from-[#005280]/12 via-transparent to-[#C90606]/8 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Decorative offset frame */}
          <div className="absolute -top-4 -left-4 w-full h-full rounded-[2.25rem] border border-[#005280]/10 z-0" />

          <div className="relative overflow-hidden rounded-[2rem] border border-gray-100/80 shadow-[0_30px_80px_-10px_rgba(0,82,128,0.14)] z-10">
            <motion.div style={{ y: imgY }}>
              <motion.img
                src={aboutImg}
                alt="About iSchool"
                className="w-full h-auto object-cover will-change-transform"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>

            {/* Gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none" />
          </div>

          {/* Floating Stat Badge */}
          <motion.div
            className="reveal-item absolute -bottom-7 -right-5 lg:-right-8 bg-white px-7 py-5 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.1)] border border-gray-100/80 z-20"
            whileHover={{ y: -4, boxShadow: '0 24px 56px rgba(0,82,128,0.15)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-4xl font-black text-[#005280] leading-none tracking-tight">10+</p>
            <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#999] mt-1">Years of Excellence</p>
          </motion.div>

          {/* Small accent dot cluster */}
          <div className="absolute -top-6 -right-6 grid grid-cols-3 gap-1.5 opacity-30">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#005280]" />
            ))}
          </div>
        </div>

        {/* ── Right: Content ── */}
        <motion.div
          className="flex-1 flex flex-col gap-7"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Pill */}
          <motion.div variants={fadeUpVariants} className="reveal-item">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005280]/8 text-[#005280] text-[11px] font-bold uppercase tracking-[0.16em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#005280] animate-pulse" />
              Legacy of Innovation
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeUpVariants}
            className="reveal-item text-[2.6rem] lg:text-[3.6rem] font-extrabold text-[#1A1A1A] leading-[1.08] tracking-tight"
          >
            Welcome to the <br />
            <span className="text-[#005280] relative inline-block">
              Future of Education
              {/* Underline stroke */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 6 Q75 2 150 5 Q225 8 298 4"
                  stroke="#C90606"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </span>
          </motion.h2>

          {/* Divider */}
          <motion.div
            variants={fadeUpVariants}
            className="reveal-item flex items-center gap-3"
          >
            <div className="w-12 h-[3px] bg-[#C90606] rounded-full" />
            <div className="w-3 h-[3px] bg-[#C90606]/40 rounded-full" />
          </motion.div>

          {/* Body copy */}
          <motion.div variants={fadeUpVariants} className="reveal-item space-y-5">
            <p className="text-[#555] text-[1.05rem] leading-[1.8]">
              iSchool Mobile App empowers management and educators to broadcast critical updates instantly,
              ensuring a seamless flow of information across your institution.
            </p>
            <p className="text-[#555] text-[1.05rem] leading-[1.8]">
              Don't miss the opportunity to revolutionize your school's management — discover a world of
              simplicity, efficiency, and enhanced communication.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUpVariants}
            className="reveal-item flex gap-10 pt-2"
          >
            {[
              { value: '500+', label: 'Institutions' },
              { value: '98%', label: 'Satisfaction' },
              { value: '50k+', label: 'Active Users' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-black text-[#005280] tracking-tight">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#999] font-bold">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUpVariants} className="reveal-item pt-2">
            <motion.a
              href="https://www.innovadorsolutions.com/?fluent-form=7"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#005280] text-white rounded-2xl font-bold text-base shadow-[0_12px_32px_rgba(0,82,128,0.28)] hover:bg-[#003d61] transition-colors duration-300 overflow-hidden relative"
              whileHover={{ scale: 1.04, x: 4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Shimmer sweep */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-120%' }}
                whileHover={{ x: '160%' }}
                transition={{ duration: 0.55 }}
              />
              <span className="relative z-10">Learn More About Us</span>
              <motion.svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10"
                animate={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </motion.svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}