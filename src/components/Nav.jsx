import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, LayoutGroup, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

const navItems = [
  { label: 'Home', to: '/', hash: '' },
  { label: 'About', to: '/#about', hash: 'about' },
  { label: 'Why iSchool', to: '/#whyischool', hash: 'whyischool' },
  { label: 'Features', to: '/#features', hash: 'features' },
  { label: 'Modules', to: '/#modules', hash: 'modules' },
];

// Smooth scroll with offset for fixed header
const scrollToSection = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

// Menu animation variants
const menuVariants = {
  closed: {
    opacity: 0,
    y: '-100%',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 24,
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  closed: { opacity: 0, x: -30, filter: 'blur(4px)' },
  open: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const linkHoverVariants = {
  hover: { scale: 1.08, y: -2, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  tap: { scale: 0.96 }
};

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const headerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // Optimized scroll effect using Framer Motion's high-perf hook
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20 && !scrolled) setScrolled(true);
    else if (latest <= 20 && scrolled) setScrolled(false);
  });
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);
  
  // Intersection Observer for scroll spy
  useEffect(() => {
    // Clear flag on scroll end to ensure observer takes over correctly
    const handleScrollEnd = () => {
      isScrollingRef.current = false;
    };
    window.addEventListener('scrollend', handleScrollEnd);

    const sections = navItems.filter(item => item.hash).map(item => item.hash);
    if (sections.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Skip observer updates while manual scroll is active
        if (isScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });

        // Set to empty if near the top
        if (window.scrollY < 100) {
          setActiveSection('');
        }
      },
      {
        // Use a "scanner line" strategy at the top of the viewport
        rootMargin: '-10% 0px -85% 0px',
        threshold: 0
      }
    );
    
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [location.pathname]);
  
  // Handle hash navigation after route change
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const hash = location.hash.slice(1);
      setTimeout(() => {
        scrollToSection(hash, 80);
      }, 100);
    }
  }, [location]);
  
  // Navigation handler with smooth scroll
  const handleNavigation = useCallback(async (to, hash, e) => {
    e?.preventDefault();
    
    if (location.pathname !== '/') {
      // Navigate to home with hash
      navigate(to);
      return;
    }
    
    // Already on home page, just scroll
    isScrollingRef.current = true;
    
    if (hash) {
      setActiveSection(hash);
      scrollToSection(hash, 80);
      window.history.pushState(null, '', `#${hash}`);
    } else {
      setActiveSection('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
    
    // Reset scrolling flag after animation finishes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
    
    setIsOpen(false);
  }, [location.pathname, navigate]);
  
  // Check if a nav item is active
  const isItemActive = (item) => {
    if (item.hash === '') {
      return activeSection === '' && window.scrollY < 100;
    }
    return activeSection === item.hash;
  };
  
  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-200 h-1 bg-linear-to-r from-[#005280] via-[#0088b0] to-[#005280] origin-left"
        style={{ scaleX, marginRight: 'var(--scrollbar-width, 0px)' }}
      />
      
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-100 transition-[background,padding,box-shadow,border-color] duration-500 ${
          scrolled
            ? 'py-3 bg-white/90 backdrop-blur-md shadow-lg border-b border-slate-200/30'
            : 'py-5 bg-transparent'
        }`}
        style={{ marginRight: 'var(--scrollbar-width, 0px)' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo with 3D tilt effect */}
          <NavLink to="/" className="group relative z-110" onClick={(e) => handleNavigation('/', '', e)}>
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative"
            >
              <motion.img
                src={logoImg}
                alt="iSchool"
                className="h-10 w-auto object-contain lg:h-12"
                animate={{ filter: scrolled ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' : 'none' }}
              />
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-[#005280]/0 via-[#005280]/60 to-[#005280]/0 rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </NavLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <LayoutGroup>
              {navItems.map((item) => (
                <motion.div
                  key={item.to}
                  variants={linkHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="relative"
                >
                  <button
                    onClick={(e) => handleNavigation(item.to, item.hash, e)}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl ${
                      isItemActive(item)
                        ? 'text-[#005280]'
                        : 'text-slate-600 hover:text-[#005280] hover:bg-[#005280]/5'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      {item.label}
                    </span>
                    
                    {/* Animated active background pill */}
                    {isItemActive(item) && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 z-0 rounded-xl bg-linear-to-r from-[#005280]/10 to-[#0088b0]/10 shadow-inner"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    {/* Animated bottom underline */}
                    <motion.div
                      className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#005280]"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{
                        scaleX: isItemActive(item) ? 1 : 0,
                        opacity: isItemActive(item) ? 1 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  </button>
                </motion.div>
              ))}
            </LayoutGroup>
            
            {/* CTA Button with glow effect */}
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,82,128,0.4)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="group relative ml-4 overflow-hidden rounded-full bg-linear-to-r from-[#005280] to-[#0088b0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30"
              href="https://www.innovadorsolutions.com/?fluent-form=7"
              target="_blank"
            >
              <span className="relative z-10 flex items-center gap-2">
                Request a Demo
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 -z-0 bg-linear-to-r from-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.a>
          </nav>
          
          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-110 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 shadow-sm md:hidden"
            whileTap={{ scale: 0.85 }}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-105 bg-slate-900/40 backdrop-blur-md md:hidden"
                transition={{ duration: 0.2 }}
              />
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-x-0 top-0 z-105 overflow-hidden rounded-b-3xl bg-white/95 backdrop-blur-xl shadow-2xl md:hidden"
              >
                <div className="flex flex-col gap-2 px-6 pt-28 pb-12">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.to}
                      variants={itemVariants}
                    >
                      <button
                        onClick={(e) => handleNavigation(item.to, item.hash, e)}
                        className={`group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left text-xl font-semibold transition-all duration-300 ${
                          isItemActive(item)
                            ? 'bg-linear-to-r from-[#005280]/15 to-[#0088b0]/15 text-[#005280]'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {item.label}
                        </span>
                        <ChevronRight
                          size={20}
                          className={`transition-all duration-300 ${
                            isItemActive(item) ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:translate-x-1 group-hover:opacity-100'
                          }`}
                        />
                      </button>
                    </motion.div>
                  ))}
                  <motion.div variants={itemVariants} className="mt-6 px-2">
                    <motion.a
                      whileTap={{ scale: 0.97 }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#005280] to-[#0088b0] py-4 text-lg font-bold text-white shadow-xl shadow-blue-900/30"
                      href="https://www.innovadorsolutions.com/?fluent-form=7"
                      target="_blank"
                    >
                      Get Started
                      <ChevronRight size={18} />
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-20 lg:h-24" />
    </>
  );
}

export default Nav;