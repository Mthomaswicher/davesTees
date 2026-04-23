import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Gallery from './components/Gallery.jsx'
import Designer from './components/Designer.jsx'
import Process from './components/Process.jsx'
import Contact from './components/Contact.jsx'
import Policies from './components/Policies.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  // Simple scroll-reveal observer
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Gallery />
        <Designer />
        <Process />
        <Contact />
        <Policies />
      </main>
      <Footer />
    </>
  )
}
