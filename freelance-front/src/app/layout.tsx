import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'FreelanceDZ — La plateforme freelance algérienne',
  description: 'Trouvez les meilleurs prestataires freelance en Algérie. Développement web, design, marketing, architecture et plus.',
  keywords: 'freelance algérie, prestataire, développeur web algérie, designer algérie',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Navbar />
        <main style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text)',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: 'var(--success)', secondary: 'var(--bg)' } },
            error: { iconTheme: { primary: 'var(--error)', secondary: 'var(--bg)' } },
          }}
        />
      </body>
    </html>
  )
}
