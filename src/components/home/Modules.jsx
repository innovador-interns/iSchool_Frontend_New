import React from 'react'
import { motion } from 'framer-motion'
import phone from '../../assets/iSchool_files/phone.svg'
import { moduleFeatures } from './data'
import { SectionReveal } from './SectionReveal'
import { fadeInUp } from '../../lib/animations'

export function Modules() {
  return (
    <section id="modules" className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row items-start gap-16">

          {/* Left */}
          <SectionReveal className="flex-1 max-w-lg">
            <div className="flex flex-col gap-6">
              <motion.span variants={fadeInUp} className="text-[#005280] text-xs uppercase tracking-[0.2em] font-bold">
                Modules
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                Empower Your Experience: Discover iSchool Modules
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-500 text-sm leading-relaxed">
                Explore the full potential of iSchool with a suite of dynamic modules designed to enhance your
                experience and streamline your workflow.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mt-2">
                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 flex items-center justify-center rounded-xl text-white text-md font-semibold shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #005280, #0284c7)' }}
                  href="https://www.innovadorsolutions.com/?fluent-form=7"
                  target="_blank"
                >
                  Request a Demo
                </motion.a>
                <a
                  href="tel:+923324666823"
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 border-slate-200 hover:border-[#005280] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#005280]/90 flex items-center justify-center group-hover:bg-[#005280]/70 transition-colors">
                    <img src={phone} className="w-4 h-4" alt="Phone" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider">Call Us Now</p>
                    <p className="text-[#005280] font-bold text-sm">+92 332 466 6823</p>
                  </div>
                </a>
              </motion.div>
            </div>
          </SectionReveal>

          {/* Right — Module cards */}
          <div className="flex-1 flex flex-col gap-5">
            {moduleFeatures.map((mod, i) => (
              <SectionReveal key={i}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-5 p-6 rounded-2xl border border-slate-100 bg-white cursor-default transition-all duration-300 hover:shadow-md"
                >
                  <div
                    className="shrink-0 w-13 h-13 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', width: 52, height: 52 }}
                  >
                    <img src={mod.icon} alt={mod.title} className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5">{mod.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{mod.description}</p>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
