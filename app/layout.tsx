import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Galilea Music Education | Escuela de Música en Barrio Piñalito',
    template: '%s | Galilea Music Education',
  },
  description:
    'Instituto de música Galilea Music Education ofrece clases de Piano, Guitarra y Batería en el Barrio Piñalito. Aprende con maestros especializados a $40.000 COP al mes. ¡Inscríbete hoy!',
  keywords: [
    'clases de música',
    'escuela de música',
    'clases de piano',
    'clases de guitarra',
    'clases de batería',
    'Galilea Music Education',
    'barrio piñalito',
    'academia de música',
    'aprender piano',
    'aprender guitarra',
    'aprender batería',
    'música Colombia',
  ],
  authors: [{ name: 'Galilea Music Education' }],
  creator: 'Galilea Music Education',
  publisher: 'Galilea Music Education',
  category: 'education',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Galilea Music Education',
    title: 'Galilea Music Education | Escuela de Música',
    description:
      'Aprende Piano, Guitarra y Batería con maestros especializados. Clases desde $40.000 COP/mes. Inscríbete hoy en Galilea Music Education.',
    images: [
      {
        url: '/images/piano-hero.png',
        width: 1200,
        height: 630,
        alt: 'Galilea Music Education - Escuela de Música',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galilea Music Education | Escuela de Música',
    description: 'Clases de Piano, Guitarra y Batería. ¡Empieza tu viaje musical hoy!',
    images: ['/images/piano-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#111111',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Galilea Music Education',
  description:
    'Instituto de música con clases de Piano, Guitarra y Batería en el Barrio Piñalito.',
  telephone: '+57+57123456789',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Barrio Piñalito',
    addressCountry: 'CO',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Clases de Piano',
      price: '40000',
      priceCurrency: 'COP',
    },
    {
      '@type': 'Offer',
      name: 'Clases de Guitarra',
      price: '40000',
      priceCurrency: 'COP',
    },
    {
      '@type': 'Offer',
      name: 'Clases de Batería',
      price: '40000',
      priceCurrency: 'COP',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CO">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="geo.region" content="CO" />
        <meta name="geo.placename" content="Barrio Piñalito, Colombia" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

