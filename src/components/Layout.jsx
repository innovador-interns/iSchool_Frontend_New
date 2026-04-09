import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative">
      <Nav />
      <main className="w-full max-w-8xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
