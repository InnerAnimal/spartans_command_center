import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { InnerAnimalHelper } from '@/components/InnerAnimalHelper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inner Animal Platform - Your Unified Integration Hub',
  description: 'Access all integrations and services in one place. Inner Animal Platform connects you to Vercel, Stripe, Resend, Cloudflare, Supabase, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <InnerAnimalHelper />
      </body>
    </html>
  )
}

