import React from 'react'
import { motion } from 'framer-motion'
import { lists } from './data'
import { SectionReveal } from './SectionReveal'
import { fadeInUp, scaleUp } from '../../lib/animations'
import vector from '../../assets/admission-vector-1.svg'

export function WhyISchool() {
  return (
    <section id="whyischool" className="py-16 lg:py-20 overflow-hidden relative" style={{ background: '#f8fafc' }}>
      <div className="absolute top-52 left-0 w-72">
        <img src={vector} alt="" className="h-full w-full object-contain" />
      </div>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <SectionReveal>
          <div className="flex flex-col gap-3 mb-16">
            <motion.span variants={fadeInUp} className="text-[#005280] text-xs uppercase tracking-[0.2em] font-bold">
              Why Choose
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-black text-slate-900">
              iSchool
            </motion.h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {lists.map((item, i) => (
            <SectionReveal key={i}>
              <motion.div
                variants={scaleUp}
                whileHover={{ y: -6, boxShadow: '0 20px 30px rgba(0,82,128,0.12)' }}
                className="bg-white shadow rounded-2xl p-8 flex flex-col gap-5 border border-slate-100 cursor-default transition-all duration-300 h-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14">
                    <img src={item.img} alt="" className="h-14 w-14 object-contain" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
