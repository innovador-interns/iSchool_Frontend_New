import { motion } from 'framer-motion'
import logo from '../assets/Powered-by-logo.png'
import phoneIcon from '../assets/call-icon-yellow.svg'
import emailIcon from '../assets/message-yellow.svg'
import locationIcon from '../assets/karachi.svg'
import locationIcon2 from '../assets/lahore.svg'
import locationIcon3 from '../assets/hyderabad.svg'
import locationIcon4 from '../assets/us.svg'
import locationIcon5 from '../assets/qatar.svg'
import locationIcon6 from '../assets/canada.svg'
import submitIcon from '../assets/submit-icon.svg'
import { FaFacebook, FaGlobe, FaLinkedin } from 'react-icons/fa'

const socialLinks = [{ icon: FaGlobe, href: "https://www.innovadorsolutions.com/" }, { icon: FaFacebook, href: "https://www.facebook.com/innovadors/" }, { icon: FaLinkedin, href: "https://www.linkedin.com/company/innovadorsolutions/" }]

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function Footer() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="bg-[radial-gradient(circle_at_top,rgba(74,222,128,0.15),transparent_40%),linear-gradient(180deg,#005280,#10557B)] text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <motion.div
          variants={container}
          className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4"
        >

          {/* CONTACT */}
          <motion.div variants={item} className="space-y-5">
            <img src={logo} alt="Logo" className="h-16 sm:h-20" />

            <p className="text-sm text-slate-200 leading-relaxed">
              Digital Transformation <br />
              Revolutionizing Businesses
            </p>

            <ul className="space-y-3 text-sm text-slate-200">
              <motion.li whileHover={{ x: 6 }} className="flex items-center gap-3">
                <img src={phoneIcon} alt="" className="h-4" />
                +92 332 466 6823
              </motion.li>

              <motion.li whileHover={{ x: 6 }} className="flex items-center gap-3">
                <img src={emailIcon} alt="" className="h-4" />
                info@innovadorsolutions.com
              </motion.li>
            </ul>
          </motion.div>

          {/* PAKISTAN LOCATIONS */}
          <motion.div variants={item}>
            <h3 className="text-lg font-semibold mb-5">Pakistan</h3>

            <div className="space-y-4">
              {[
                { icon: locationIcon, text: "Karachi" },
                { icon: locationIcon2, text: "Lahore" },
                { icon: locationIcon3, text: "Hyderabad" },
              ].map((loc, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-3"
                >
                  <img src={loc.icon} alt="" className="h-10 w-10 object-contain" />
                  <p className="text-sm text-slate-200">{loc.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* INTERNATIONAL */}
          <motion.div variants={item}>
            <h3 className="text-lg font-semibold mb-5">International</h3>

            <div className="space-y-4">
              {[
                { icon: locationIcon4, text: "USA" },
                { icon: locationIcon5, text: "Qatar" },
                { icon: locationIcon6, text: "Canada" },
              ].map((loc, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-3"
                >
                  <img src={loc.icon} alt="" className="h-10 w-10 object-contain" />
                  <p className="text-sm text-slate-200">{loc.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* NEWSLETTER */}
          <motion.div variants={item} className="space-y-5">
            <h3 className="text-lg font-semibold">Newsletter</h3>

            <p className="text-sm text-slate-200">
              Get weekly updates, tips, and insights directly in your inbox.
            </p>

            <div className="flex items-center w-full rounded-full border border-white/10 bg-white/5 pl-3 pr-1 py-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-300"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 cursor-pointer"
              >
                <img src={submitIcon} alt="" className="h-5" />
              </motion.button>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <p className="text-sm text-slate-200">Follow</p>

              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-slate-300 hover:text-white"
                  target="_blank"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* BOTTOM BAR */}
      <motion.div variants={item} className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left">
            © 2026 iSchool by{" "}
            <span className="font-semibold text-white">
              Innovador Solutions
            </span>
          </p>
        </div>
      </motion.div>
    </motion.footer>
  )
}

export default Footer


{/* LINKS */ }
{/* <motion.div variants={item}>
            <h3 className="text-lg font-semibold text-white">Shortcut links</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {["Home", "About", "Why iSchool", "Features", "Modules"].map((text, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "tween" }}
                >
                  <Link
                    to={text === "Welcome" ? "/" : `/${text.toLowerCase().replace(" ", "")}`}
                    className="transition hover:text-white"
                  >
                    {text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div> */}

{/* FEATURES */ }
{/* <motion.div variants={item}>
            <h3 className="text-lg font-semibold text-white">Features</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {["Health & Fitness", "Healthy Diet"].map((text, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    to={`/${text.toLowerCase().replace(" ", "")}`}
                    className="transition hover:text-white"
                  >
                    {text}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <motion.a
                href="https://apps.apple.com/pk/app/soul-whispers/id6514315560"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
              >
                <img src={appStoreImg} className="h-12" />
              </motion.a>

              <motion.a
                href="https://play.google.com/store/apps/details?id=com.innovadorsolutions.soulwispers"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
              >
                <img src={googlePlayImg} className="h-12" />
              </motion.a>
            </div>
          </motion.div> */}