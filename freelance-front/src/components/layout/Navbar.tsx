'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Zap, ChevronDown, User, LayoutDashboard, LogOut, Settings, Wallet } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

interface AuthUser {
  id: string
  fullName: string
  email: string
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN'
  walletBalance?: number
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Load user from localStorage + optionally validate token
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { setLoadingUser(false); return }

    fetch(`${API}/api/v1/me`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data.data))
      .catch(() => { localStorage.clear(); setUser(null) })
      .finally(() => setLoadingUser(false))
  }, [pathname]) // re-check on route change

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 'X-User-Id': user?.id || '' },
      })
    } catch {}
    localStorage.clear()
    setUser(null)
    setUserMenuOpen(false)
    router.push('/')
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const isProvider = user?.role === 'PROVIDER'

  const navLinks = [
    { href: '/services', label: 'Explorer' },
    { href: '/providers', label: 'Prestataires' },
    { href: '/how-it-works', label: 'Comment ça marche' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass' : 'bg-transparent'}`}
      style={{
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full" style={{
        background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent3), transparent)',
        opacity: scrolled ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{
                background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}
            >
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Freelance<span style={{ color: 'var(--accent)' }}>DZ</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? 'var(--text)' : 'var(--text-muted)',
                    background: active ? 'var(--bg-card2)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.color = 'var(--text)'
                    if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.color = 'var(--text-muted)'
                    if (!active) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--accent)' }} />
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Auth area ── */}
          <div className="hidden md:flex items-center gap-3">
            {loadingUser ? (
              <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: 'var(--bg-card2)' }} />
            ) : user ? (
              /* ── Logged-in user menu ── */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200"
                  style={{
                    background: userMenuOpen ? 'var(--bg-card2)' : 'var(--bg-card)',
                    border: `1px solid ${userMenuOpen ? 'var(--accent)' : 'var(--border)'}`,
                    boxShadow: userMenuOpen ? '0 0 0 3px var(--accent-glow)' : 'none',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--accent), #a78bfa)', color: 'white' }}
                  >
                    {initials}
                  </div>

                  {/* Name + role */}
                  <div className="text-left leading-none">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {user.fullName.split(' ')[0]}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--accent)' }}>
                      {isProvider ? 'Prestataire' : 'Client'}
                    </div>
                  </div>

                  <ChevronDown
                    size={13}
                    style={{
                      color: 'var(--text-muted)',
                      transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
                      animation: 'fadeSlideDown 0.15s ease',
                    }}
                  >
                    {/* User header inside dropdown */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="font-semibold text-sm truncate">{user.fullName}</div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>

                    <div className="p-1.5">
                      <DropdownItem icon={LayoutDashboard} label="Tableau de bord" href="/dashboard" onClick={() => setUserMenuOpen(false)} />
                      <DropdownItem icon={User} label="Mon profil" href="/dashboard" onClick={() => setUserMenuOpen(false)} />
                      {user.walletBalance !== undefined && (
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm mx-0.5"
                          style={{ background: 'rgba(108,99,255,0.08)', color: 'var(--accent)' }}>
                          <Wallet size={14} />
                          <span className="flex-1">Wallet</span>
                          <span className="font-bold text-xs">{user.walletBalance.toFixed(2)} DZD</span>
                        </div>
                      )}
                    </div>

                    <div className="p-1.5" style={{ borderTop: '1px solid var(--border)' }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm w-full text-left transition-all duration-150 mx-0.5"
                        style={{ color: 'var(--error)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={14} />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Guest buttons ── */
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{ color: 'var(--text-muted)', border: '1px solid transparent' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--text)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'var(--bg-card2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                    color: 'white',
                    boxShadow: '0 4px 15px var(--accent-glow)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px var(--accent-glow)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px var(--accent-glow)'
                  }}
                >
                  Commencer gratuitement
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile burger ── */}
          <button
            className="md:hidden p-2 rounded-xl transition-all"
            style={{ background: open ? 'var(--bg-card2)' : 'transparent', border: '1px solid var(--border)' }}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: pathname === link.href ? 'var(--bg-card2)' : 'transparent',
                  color: pathname === link.href ? 'var(--text)' : 'var(--text-muted)',
                }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              {user ? (
                <>
                  {/* Mobile user info */}
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl"
                    style={{ background: 'var(--bg-card2)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--accent), #a78bfa)', color: 'white' }}>
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{user.fullName}</div>
                      <div className="text-xs" style={{ color: 'var(--accent)' }}>
                        {isProvider ? 'Prestataire' : 'Client'}
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onClick={() => setOpen(false)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LayoutDashboard size={15} /> Tableau de bord
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setOpen(false) }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-colors mt-1"
                    style={{ color: 'var(--error)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} /> Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/auth/login"
                    className="text-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
                    onClick={() => setOpen(false)}>
                    Connexion
                  </Link>
                  <Link href="/auth/register"
                    className="text-center px-4 py-3 rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, var(--accent), #a78bfa)', color: 'white' }}
                    onClick={() => setOpen(false)}>
                    Commencer gratuitement
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </nav>
  )
}

// ── Reusable dropdown item ─────────────────────────────────────────────────
function DropdownItem({
  icon: Icon, label, href, onClick,
}: { icon: React.ElementType; label: string; href: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 mx-0.5"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--bg-card2)'
        e.currentTarget.style.color = 'var(--text)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--text-muted)'
      }}
    >
      <Icon size={14} />
      {label}
    </Link>
  )
}