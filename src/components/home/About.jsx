import React from 'react'
import { motion } from 'framer-motion'
import aboutImg from '../../assets/about-img.png'
import { SectionReveal } from './SectionReveal'
import { slideInLeft, fadeInUp } from '../../lib/animations'

export function About() {
  return (
    <section id="about" className="py-16 lg:py-18 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 flex flex-col lg:flex-row items-center gap-16">
        <SectionReveal className="flex-1">
          <motion.div variants={slideInLeft} className="relative">
            <img src={aboutImg} alt="About iSchool" className="relative w-full" />
          </motion.div>
        </SectionReveal>

        <SectionReveal className="flex-1">
          <div className="flex flex-col gap-6">
            <motion.span
              variants={fadeInUp}
              className="text-[#005280] text-xs uppercase tracking-[0.2em] font-bold"
            >
              About Us
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight"
            >
              Welcome to<br />
              <span className="text-[#005280]">iSchool</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-base leading-relaxed">
              iSchool Mobile App enables management & teachers to update important & urgent information or
              announcements at any time, while students & parents receive instant notifications and can track
              progress in real time.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-slate-500 text-base leading-relaxed">
              Don't miss the opportunity to revolutionize your school's management! Experience the power of
              iSchool today and discover a world of simplicity, efficiency, and enhanced communication within
              your educational institution.
            </motion.p>
            
            {/* Stats commented out per user's latest change */}
            {/* <motion.div variants={fadeInUp} className="flex gap-8 mt-2">
              {[['500+', 'Schools'], ['50K+', 'Students'], ['99%', 'Uptime']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-3xl font-black text-[#005280]">{n}</p>
                  <p className="text-slate-400 text-sm">{l}</p>
                </div>
              ))}
            </motion.div> */}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
