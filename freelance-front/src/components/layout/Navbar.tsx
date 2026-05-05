'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Zap, ChevronDown, User, LayoutDashboard, LogOut, Settings } from 'lucide-react'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  // Fake auth state — sera remplacé par Zustand store
  const user = null // TODO: useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/services', label: 'Explorer' },
    { href: '/providers', label: 'Prestataires' },
    { href: '/how-it-works', label: 'Comment ça marche' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
      style={{ position: 'fixed' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--accent-glow)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Freelance<span style={{ color: 'var(--accent)' }}>DZ</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`btn-ghost ${pathname === link.href ? 'text-white bg-[var(--bg-card2)]' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--accent)' }}>
                    A
                  </div>
                  <span className="text-sm font-medium">Mon compte</span>
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--bg-card2)] transition-colors">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--bg-card2)] transition-colors">
                      <User size={14} /> Mon profil
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--bg-card2)] transition-colors">
                      <Settings size={14} /> Paramètres
                    </Link>
                    <hr style={{ borderColor: 'var(--border)' }} />
                    <button className="flex items-center gap-2 px-4 py-3 text-sm w-full text-left hover:bg-[var(--bg-card2)] transition-colors"
                      style={{ color: 'var(--error)' }}>
                      <LogOut size={14} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost">
                  Connexion
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Commencer gratuitement
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass animate-fade-in"
          style={{ borderTop: '1px solid var(--border)' }}>
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="btn-ghost py-3 justify-start"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="divider my-2" />
            <Link href="/auth/login" className="btn-secondary justify-center" onClick={() => setOpen(false)}>
              Connexion
            </Link>
            <Link href="/auth/register" className="btn-primary justify-center" onClick={() => setOpen(false)}>
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
