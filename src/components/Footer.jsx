import { motion } from 'framer-motion'
import { Mail, Phone, Globe } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FaFacebook, FaLinkedin } from 'react-icons/fa'
import { NavLink } from 'react-router-dom';
import logoImg from '../assets/logo.png';

function Footer() {
  const footerRef = useRef(null)
  const glowRef = useRef(null)
  const canvasRef = useRef(null)

  /* CURSOR + VELOCITY GLOW */
  useEffect(() => {
    const el = footerRef.current
    const glow = glowRef.current
    if (!el || !glow) return

    let lastX = 0
    let lastY = 0

    const move = (e) => {
      const rect = el.getBoundingClientRect()

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const vx = x - lastX
      const vy = y - lastY

      lastX = x
      lastY = y

      gsap.to(glow, {
        x: x - 200 + vx * 0.5,
        y: y - 200 + vy * 0.5,
        scale: 1 + Math.abs(vx + vy) * 0.002,
        duration: 0.6,
        ease: "power3.out",
      })
    }

    el.addEventListener("mousemove", move)
    return () => el.removeEventListener("mousemove", move)
  }, [])

  /* CONSTELLATION BACKGROUND */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = 400

    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.fillStyle = "rgba(15,23,42,0.25)"
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)

          if (dist < 120) {
            ctx.strokeStyle = `rgba(201,0,10,${1 - dist / 120})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  /* SCRAMBLE TEXT EFFECT */
  const scramble = (el, text) => {
    const chars = "iSchool"
    let iterations = 0

    const interval = setInterval(() => {
      el.innerText = text
        .split("")
        .map((letter, i) =>
          i < iterations ? text[i] : chars[Math.floor(Math.random() * chars.length)]
        )
        .join("")

      iterations += 1 / 3
      if (iterations >= text.length) clearInterval(interval)
    }, 30)
  }

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#f8fafc] text-[#0f172a]"
    >

      {/* CONSTELLATION CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-[0.30]"
      />

      {/* LIQUID SVG BLOB */}
      <svg className="absolute w-full h-full opacity-[0.08]">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" />
        </filter>

        {/* <g filter="url(#goo)">
          <circle cx="30%" cy="40%" r="120" fill="#c9000a">
            <animate attributeName="cy" values="40%;60%;40%" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="70%" cy="50%" r="160" fill="#0f172a">
            <animate attributeName="cy" values="50%;30%;50%" dur="10s" repeatCount="indefinite" />
          </circle>
        </g> */}
      </svg>

      {/* GLOW */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-[420px] h-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 0, 60, 0.12), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-7">

        {/* HEADER */}
        <div className="mb-16">
          <div className="group relative z-110">
            <motion.div>
              <motion.img
                src={logoImg}
                alt="iSchool"
                className="h-12 w-auto object-contain lg:h-12"
              />
            </motion.div>
          </div>

          <p className="text-[#475569] mt-4 max-w-md">
            A living ecosystem for modern education systems.
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-14">

          {/* CONTACT */}
          <div>
            <h3 className="text-xs tracking-[0.3em] text-[#64748b] uppercase mb-6">
              Contact
            </h3>

            <div className="space-y-4 text-[#475569] text-sm">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-[#c9000a]" />
                +92 332 466 6823
              </div>

              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#c9000a]" />
                info@ischool.com
              </div>

              <div className="flex items-center gap-3">
                <Globe size={14} className="text-[#c9000a]" />
                www.ischool.com
              </div>
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-xs tracking-[0.3em] text-[#64748b] uppercase mb-6">
              Quick Links
            </h3>

            <div className="space-y-3 text-[#475569] text-sm">
              {["Home", "About", "Why iSchool", "Features", "Modules"].map((item, i) => (
                <motion.a
                  key={i}
                  onClick={() => {
                    const target = document.querySelector(`#${item.toLowerCase().replace(/\s+/g, '-')}`);
                    if (target) {
                      const rect = target.getBoundingClientRect();
                      const scrollTop = window.scrollY || document.documentElement.scrollTop;
                      const targetY = scrollTop + rect.top - 20;
                      window.scrollTo({ top: targetY, behavior: 'smooth' });
                    }
                  }}
                  whileHover={{ color: "#c9000a", y: -3 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="cursor-pointer block"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-xs tracking-[0.3em] text-[#64748b] uppercase mb-6">
              Follow Us
            </h3>

            <div className="flex gap-3">
              {[{ Icon: FaFacebook, href: 'https://www.facebook.com/innovadors/' }, { Icon: FaLinkedin, href: 'https://www.linkedin.com/company/innovadorsolutions/' }].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target="_blank"
                  whileHover={{ scale: 1.1, color: "#c9000a" }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-white border border-[#e2e8f0] shadow-sm"
                >
                  <item.Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-24 border-t border-[#e2e8f0] pt-6 flex justify-between text-xs text-[#64748b]">
          <p>© 2026 iSchool</p>
          <p className="text-[#c9000a] font-semibold">
            Powered by Innovador Solutions
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer