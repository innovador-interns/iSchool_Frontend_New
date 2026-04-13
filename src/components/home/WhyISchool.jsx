import React from 'react'
import { motion } from 'framer-motion'
import { lists } from './data'
import { fadeInUp, staggerContainer, viewportSettings } from '../../lib/animations'
import vector from '../../assets/admission-vector-1.svg'

// Custom card animation variant
const cardItemVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  }
}

export function WhyISchool() {
  return (
    <section id="whyischool" className="py-16 lg:py-18 overflow-hidden relative bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#005280]/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl animate-pulse" />
      
      {/* Background Vector */}
      <div className="absolute top-52 left-0 w-72 opacity-[0.03] pointer-events-none select-none">
        <img src={vector} alt="" className="h-full w-full object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 relative z-10">
        {/* Section Header - Centered for Premium Look */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="flex flex-col items-center text-center gap-4 mb-20"
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-2">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mt-4">
              Why <span className="text-[#005280] relative">
                iSchool
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 7C20 7 30 2 50 2C70 2 80 7 100 7" stroke="#005280" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </span>
            </h2>
          </motion.div>
          <motion.p variants={fadeInUp} className="max-w-2xl text-slate-500 text-lg leading-relaxed mt-4">
            Discover why educational institutions worldwide trust iSchool to transform their administrative and academic horizons.
          </motion.p>
        </motion.div>

        {/* Features Grid with Staggered Animation */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          {lists.map((item, i) => (
            <motion.div
              key={i}
              variants={cardItemVariant}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className="group relative h-full"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#005280]/5 to-transparent rounded-[2.5rem] -m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white p-8 lg:p-10 rounded-4xl border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-[#005280]/10 transition-all duration-500 flex flex-col gap-6 h-full z-10 overflow-hidden">
                {/* Abstract Shape in Card */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full transition-colors duration-500 -z-10" />
                
                <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] flex items-center justify-center transition-all duration-500 group-hover:rotate-10 shadow-inner">
                  <img 
                    src={item.img} 
                    alt="ordered list"
                    className="h-10 w-10 object-contain transition-all duration-500" 
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-[#005280] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

