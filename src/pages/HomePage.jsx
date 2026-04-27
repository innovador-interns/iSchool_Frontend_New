import React from 'react'
import { Hero } from '../components/home/Hero'
import { About } from '../components/home/About'
import { WhyISchool } from '../components/home/WhyISchool'
import { Features } from '../components/home/Features'
import { CTA } from '../components/home/CTA'
import { AppScreens } from '../components/home/AppScreens'
import HorizontalFeatures from '../components/home/HorizontalFeatures'

function HeroSection() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <About />
      <WhyISchool />
      <Features />
      <HorizontalFeatures />
      <AppScreens />
      <CTA />
    </div>
  )
}

export default HeroSection