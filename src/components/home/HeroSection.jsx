import React from 'react'
import { Hero } from './Hero'
import { About } from './About'
import { WhyISchool } from './WhyISchool'
import { Features } from './Features'
import { CTA } from './CTA'
import { Modules } from './Modules'
import { AppScreens } from './AppScreens'

/**
 * HeroSection Component
 * Composes all home page sections into a single smooth-scrolling experience.
 * Each section is extracted into its own component for better maintainability 
 * and optimized performance.
 */
function HeroSection() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <About />
      <WhyISchool />
      <Features />
      <CTA />
      <Modules />
      <AppScreens />
    </div>
  )
}

export default HeroSection