import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Instruments from '@/components/sections/Instruments'
import Testimonials from '@/components/sections/Testimonials'
import CTA from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'Galilea Music Education | Escuela de Música — Piano, Guitarra y Batería',
  description:
    'Galilea Music Education ofrece clases profesionales de Piano, Guitarra y Batería en Barrio Piñalito. Maestros especializados, horarios flexibles. Desde $40.000 COP/mes. ¡Inscríbete hoy!',
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Stats />
        <Instruments />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
