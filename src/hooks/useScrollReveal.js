import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal
 * GSAP-powered scroll reveal for .reveal-item children.
 * Supports staggered depth: each item can carry data-reveal-depth="n"
 * to offset its y further, creating natural layering without extra markup.
 */
export const useScrollReveal = (options = {}) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll('.reveal-item');
      if (!elements?.length) return;

      // Split elements into batches by DOM order for depth-aware stagger
      gsap.fromTo(
        elements,
        (i, el) => ({
          opacity: 0,
          y: (options.y || 52) + (parseFloat(el.dataset.revealDepth || 0) * 14),
          scale: options.scale ?? 0.97,
          filter: 'blur(5px)',
        }),
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: options.duration || 1.2,
          stagger: {
            each: options.stagger || 0.13,
            ease: 'power2.inOut',  // stagger pacing — ease-in-out for naturalness
          },
          ease: options.ease || 'expo.out',
          clearProps: 'filter,scale',  // avoid compositing cost after animation
          scrollTrigger: {
            trigger: containerRef.current,
            start: options.start || 'top 82%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
};