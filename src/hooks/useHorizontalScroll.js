import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useHorizontalScroll
 * Pins a section and translates its inner container horizontally on scroll.
 * scrub: 1.4 gives a gentle momentum lag that feels physical, not mechanical.
 */
export const useHorizontalScroll = (options = {}) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const section = sectionRef.current;
      if (!container || !section) return;

      // Recalc on resize via invalidateOnRefresh
      const getTotal = () => container.scrollWidth - window.innerWidth;

      const tween = gsap.to(container, {
        x: () => -getTotal(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          anticipatePin: 1,
          scrub: options.scrub ?? 1.4,   // momentum lag — feels premium
          start: 'top top',
          end: () => `+=${getTotal()}`,
          invalidateOnRefresh: true,
          // Subtle snap to item boundaries if itemCount is passed
          ...(options.itemCount && {
            snap: {
              snapTo: 1 / (options.itemCount - 1),
              duration: { min: 0.2, max: 0.6 },
              ease: 'power3.inOut',
            },
          }),
        },
      });

      return () => tween.kill();
    }, sectionRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sectionRef, containerRef };
};