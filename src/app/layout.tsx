import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Nunito, Dancing_Script, Quicksand, Fredoka } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
})

const nunito = Nunito({
  variable: '--font-sans',
  subsets: ['latin'],
})

const dancingScript = Dancing_Script({
  variable: '--font-handwritten',
  subsets: ['latin'],
  weight: ['600', '700'],
})

const quicksand = Quicksand({
  variable: '--font-clean',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const fredoka = Fredoka({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Baby Shower — Una historia de amor',
  description: 'Invitación digital al baby shower',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${nunito.variable} ${dancingScript.variable} ${quicksand.variable} ${fredoka.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
