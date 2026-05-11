'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, Settings, LogOut, Wallet, Star, TrendingUp, Shield,
  ChevronRight, Edit3, Check, X, Loader2, Bell, Search,
  Briefcase, Award, Zap, Eye, Lock, Save, ArrowRight,
  BarChart2, Tag, MapPin, Phone, Globe, FileText, RefreshCw,
  CheckCircle, AlertCircle, Home, Users,
  Package, ShoppingBag, Plus, Clock, DollarSign, MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL

// ── Types ──────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string; email: string; fullName: string; avatarUrl?: string
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN'; providerType?: 'PERSON' | 'ORGANISM'
  emailVerified: boolean; verified: boolean; firstName?: string; lastName?: string
  phoneNumber?: string; city?: string; wilaya?: string; bio?: string
  businessName?: string; businessDescription?: string; websiteUrl?: string
  yearsExperience?: number; providerLevel: 'NEW' | 'RISING' | 'TOP' | 'EXPERT'
  averageRating: number; totalReviews: number; completedOrders: number
  walletBalance: number; categories: Category[]; skills: string[]
  preferredLanguage: string; createdAt: string
}
interface Category { id: number; name: string; slug: string; level: number; parentId?: number; iconName?: string }

// ── Helpers ─────────────────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('accessToken')
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

function levelConfig(level: string) {
  const map: Record<string, { color: string; bg: string; progress: number; next: string }> = {
    NEW:    { color: '#8888aa', bg: 'rgba(136,136,170,0.1)', progress: 10,  next: 'RISING' },
    RISING: { color: '#ffb347', bg: 'rgba(255,179,71,0.1)',  progress: 40,  next: 'TOP' },
    TOP:    { color: '#6c63ff', bg: 'rgba(108,99,255,0.1)',  progress: 75,  next: 'EXPERT' },
    EXPERT: { color: '#00d9a3', bg: 'rgba(0,217,163,0.1)',   progress: 100, next: '—' },
  }
  return map[level] || map.NEW
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ w = '100%', h = '16px', r = '8px' }: { w?: string; h?: string; r?: string }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r }} />
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [allCategories, setAllCategories] = useState<Category[]>([])

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/v1/me`, { headers: authHeaders() })
      if (res.status === 401) { router.push('/auth/login'); return }
      const data = await res.json()
      setProfile(data.data)
    } catch {
      toast.error('Erreur de chargement du profil')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/auth/login'); return }
    fetchProfile()
    fetch(`${API}/api/v1/categories/flat`)
      .then(r => r.json()).then(d => setAllCategories(d.data || []))
      .catch(() => {})
  }, [fetchProfile, router])

  const handleLogout = async () => {
    try {
      const userId = profile?.id
      await fetch(`${API}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { ...authHeaders(), 'X-User-Id': userId || '' },
      })
    } catch {}
    localStorage.clear()
    router.push('/')
    toast.success('À bientôt !')
  }

  const isProvider = profile?.role === 'PROVIDER'

  // ── Sidebar nav items ──────────────────────────────────
  const navItems = [
    { id: 'overview',  label: 'Aperçu',            icon: Home },
    { id: 'profile',   label: 'Mon profil',         icon: User },
    ...(isProvider ? [
      { id: 'services',  label: 'Mes services',     icon: Package },
      { id: 'orders',    label: 'Commandes reçues', icon: ShoppingBag },
      { id: 'categories',label: 'Catégories',       icon: Tag },
    ] : [
      { id: 'orders',    label: 'Mes commandes',    icon: ShoppingBag },
    ]),
    { id: 'security',  label: 'Sécurité',           icon: Lock },
  ]

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-5"
          style={{ background: 'var(--accent)', top: '10%', left: '-10%' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-5"
          style={{ background: 'var(--accent3)', bottom: '10%', right: '-5%' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex gap-6">

        {/* ── SIDEBAR ─────────────────────────────────────── */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-3">

            {/* Avatar card */}
            <div className="card p-5 text-center">
              {loading ? (
                <div className="space-y-3 flex flex-col items-center">
                  <Skeleton w="64px" h="64px" r="50%" />
                  <Skeleton w="120px" h="14px" />
                  <Skeleton w="80px" h="12px" />
                </div>
              ) : (
                <>
                  <div className="relative inline-block mb-3">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto"
                      style={{ background: 'linear-gradient(135deg, var(--accent), #a78bfa)', color: 'white' }}>
                      {profile?.fullName?.[0]?.toUpperCase() || '?'}
                    </div>
                    {profile?.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--success)' }}>
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-sm truncate">{profile?.fullName}</div>
                  <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{profile?.email}</div>
                  <div className="mt-2">
                    <span className="badge" style={{
                      background: isProvider ? 'var(--accent-glow)' : 'rgba(0,217,163,0.1)',
                      color: isProvider ? 'var(--accent)' : 'var(--accent3)',
                      border: `1px solid ${isProvider ? 'rgba(108,99,255,0.2)' : 'rgba(0,217,163,0.2)'}`,
                    }}>
                      {isProvider ? 'Prestataire' : 'Client'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Nav */}
            <nav className="card p-2 space-y-0.5">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                  style={{
                    background: activeTab === id ? 'var(--accent-glow)' : 'transparent',
                    color: activeTab === id ? 'var(--accent)' : 'var(--text-muted)',
                    border: activeTab === id ? '1px solid rgba(108,99,255,0.2)' : '1px solid transparent',
                  }}>
                  <Icon size={16} />
                  {label}
                </button>
              ))}
              <div className="pt-1 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                  style={{ color: 'var(--error)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,107,107,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* Mobile nav */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: activeTab === id ? 'var(--accent)' : 'var(--bg-card)',
                  color: activeTab === id ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>

          {/* ─────────── OVERVIEW TAB ─────────── */}
          {activeTab === 'overview' && (
            <OverviewTab profile={profile} loading={loading} isProvider={isProvider} />
          )}

          {/* ─────────── PROFILE TAB ─────────── */}
          {activeTab === 'profile' && (
            <ProfileTab profile={profile} loading={loading} onUpdated={fetchProfile} isProvider={isProvider} />
          )}

          {/* ─────────── SERVICES TAB (PROVIDER) ─────────── */}
          {activeTab === 'services' && isProvider && (
            <ServicesTab profile={profile} />
          )}

          {/* ─────────── ORDERS TAB ─────────── */}
          {activeTab === 'orders' && (
            <OrdersTab isProvider={isProvider} />
          )}

          {/* ─────────── CATEGORIES TAB (PROVIDER) ─────────── */}
          {activeTab === 'categories' && isProvider && (
            <CategoriesTab profile={profile} allCategories={allCategories} onUpdated={fetchProfile} />
          )}

          {/* ─────────── SECURITY TAB ─────────── */}
          {activeTab === 'security' && (
            <SecurityTab profile={profile} />
          )}
        </main>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ══════════════════════════════════════════════════════════════════════════════
function OverviewTab({ profile, loading, isProvider }: { profile: UserProfile | null; loading: boolean; isProvider: boolean }) {
  const lvl = levelConfig(profile?.providerLevel || 'NEW')

  const clientStats = [
    { label: 'Wallet', value: loading ? null : `${profile?.walletBalance?.toFixed(2) || '0.00'} DZD`, icon: Wallet, color: 'var(--accent)' },
    { label: 'Commandes actives', value: loading ? null : '0', icon: Briefcase, color: 'var(--accent3)' },
    { label: 'Prestataires vus', value: loading ? null : '—', icon: Eye, color: 'var(--warning)' },
    { label: 'Membre depuis', value: loading ? null : (profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-DZ', { month: 'short', year: 'numeric' }) : '—'), icon: Award, color: '#a78bfa' },
  ]

  const providerStats = [
    { label: 'Wallet', value: loading ? null : `${profile?.walletBalance?.toFixed(2) || '0.00'} DZD`, icon: Wallet, color: 'var(--accent)' },
    { label: 'Commandes finies', value: loading ? null : String(profile?.completedOrders ?? 0), icon: CheckCircle, color: 'var(--accent3)' },
    { label: 'Note moyenne', value: loading ? null : (profile?.averageRating ? `${profile.averageRating.toFixed(1)} ★` : 'N/A'), icon: Star, color: 'var(--warning)' },
    { label: 'Avis reçus', value: loading ? null : String(profile?.totalReviews ?? 0), icon: Users, color: '#a78bfa' },
  ]

  const stats = isProvider ? providerStats : clientStats

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome banner */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 0% 50%, var(--accent) 0%, transparent 60%)' }} />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold mono mb-1" style={{ color: 'var(--accent)' }}>
              // TABLEAU DE BORD
            </p>
            <h1 className="text-2xl font-bold">
              Bonjour, {loading ? '...' : profile?.fullName?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {isProvider ? 'Gérez vos services et suivez vos performances.' : 'Trouvez les meilleurs prestataires pour vos projets.'}
            </p>
          </div>
          {isProvider && !loading && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: lvl.bg, border: `1px solid ${lvl.color}30` }}>
              <TrendingUp size={16} style={{ color: lvl.color }} />
              <span className="font-bold text-sm" style={{ color: lvl.color }}>
                Niveau {profile?.providerLevel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            {value === null
              ? <Skeleton w="60px" h="24px" r="6px" />
              : <div className="text-xl font-bold">{value}</div>
            }
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Provider level card */}
      {isProvider && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold mono mb-1" style={{ color: 'var(--text-muted)' }}>// PROGRESSION</p>
              <h3 className="font-bold">Niveau de prestataire</h3>
            </div>
            {loading ? <Skeleton w="60px" h="24px" /> : (
              <span className="badge" style={{ background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.color}30` }}>
                {profile?.providerLevel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-3">
            {['NEW', 'RISING', 'TOP', 'EXPERT'].map((l, i) => {
              const c = levelConfig(l)
              const current = ['NEW', 'RISING', 'TOP', 'EXPERT'].indexOf(profile?.providerLevel || 'NEW')
              const done = i <= current
              return (
                <div key={l} className="flex-1 text-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 transition-all"
                    style={{ background: done ? c.bg : 'var(--bg-card2)', border: `2px solid ${done ? c.color : 'var(--border)'}` }}>
                    {done ? <Check size={12} style={{ color: c.color }} /> : <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{i + 1}</span>}
                  </div>
                  <div className="text-xs font-medium" style={{ color: done ? c.color : 'var(--text-faint)' }}>{l}</div>
                </div>
              )
            })}
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card2)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${lvl.progress}%`, background: `linear-gradient(90deg, var(--accent), ${lvl.color})` }} />
          </div>
          {lvl.next !== '—' && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Complétez plus de commandes pour atteindre le niveau <span style={{ color: lvl.color }}>{lvl.next}</span>
            </p>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="card p-6">
        <p className="text-xs font-semibold mono mb-4" style={{ color: 'var(--text-muted)' }}>// ACTIONS RAPIDES</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(isProvider ? [
            { label: 'Créer un nouveau service', icon: Plus, href: '/services/create', color: 'var(--accent)' },
            { label: 'Voir mon profil public', icon: Eye, href: `/providers/${profile?.id}`, color: 'var(--accent3)' },
          ] : [
            { label: 'Trouver un prestataire', icon: Search, href: '/providers', color: 'var(--accent)' },
            { label: 'Explorer les services', icon: Briefcase, href: '/services', color: 'var(--accent3)' },
          ]).map(({ label, icon: Icon, href, color }) => (
            <Link key={label} href={href}
              className="flex items-center gap-3 p-4 rounded-xl transition-all group"
              style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}08` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="font-medium text-sm flex-1">{label}</span>
              <ArrowRight size={14} style={{ color: 'var(--text-faint)' }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Profile completeness */}
      {!loading && profile && (
        <ProfileCompleteness profile={profile} isProvider={isProvider} />
      )}
    </div>
  )
}

function ProfileCompleteness({ profile, isProvider }: { profile: UserProfile; isProvider: boolean }) {
  const checks = [
    { label: 'Email vérifié', done: profile.emailVerified },
    { label: 'Prénom & nom', done: !!(profile.firstName && profile.lastName) },
    { label: 'Wilaya renseignée', done: !!profile.wilaya },
    { label: 'Téléphone', done: !!profile.phoneNumber },
    ...(isProvider ? [
      { label: 'Bio remplie', done: !!profile.bio },
      { label: 'Catégories choisies', done: profile.categories?.length > 0 },
      { label: 'Profil vérifié', done: profile.verified },
    ] : []),
  ]
  const done = checks.filter(c => c.done).length
  const pct = Math.round((done / checks.length) * 100)

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold mono mb-1" style={{ color: 'var(--text-muted)' }}>// PROFIL</p>
          <h3 className="font-bold">Complétude du profil</h3>
        </div>
        <span className="text-2xl font-bold" style={{ color: pct === 100 ? 'var(--success)' : 'var(--accent)' }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: 'var(--bg-card2)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: pct === 100 ? 'var(--success)' : 'linear-gradient(90deg, var(--accent), #a78bfa)' }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {checks.map(({ label, done }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            {done
              ? <CheckCircle size={13} style={{ color: 'var(--success)', flexShrink: 0 }} />
              : <AlertCircle size={13} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
            }
            <span style={{ color: done ? 'var(--text)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE TAB
// ══════════════════════════════════════════════════════════════════════════════
function ProfileTab({ profile, loading, onUpdated, isProvider }: {
  profile: UserProfile | null; loading: boolean; onUpdated: () => void; isProvider: boolean
}) {
  const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '', city: '', wilaya: '', bio: '', businessName: '', businessDescription: '', websiteUrl: '', yearsExperience: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) setForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phoneNumber: profile.phoneNumber || '',
      city: profile.city || '',
      wilaya: profile.wilaya || '',
      bio: profile.bio || '',
      businessName: profile.businessName || '',
      businessDescription: profile.businessDescription || '',
      websiteUrl: profile.websiteUrl || '',
      yearsExperience: profile.yearsExperience?.toString() || '',
    })
  }, [profile])

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      const body: any = { ...form, yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined }
      const res = await fetch(`${API}/api/v1/me`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur')
      toast.success('Profil mis à jour !')
      onUpdated()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="space-y-4 animate-fade-up">
      <div className="card p-6 space-y-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} h="48px" r="12px" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold mono mb-1" style={{ color: 'var(--accent)' }}>// MON PROFIL</p>
          <h2 className="text-xl font-bold">Informations personnelles</h2>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {/* Info badge */}
      {profile?.verified && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: 'rgba(0,217,163,0.08)', border: '1px solid rgba(0,217,163,0.2)', color: 'var(--success)' }}>
          <Shield size={15} /> Votre profil est vérifié par l'équipe FreelanceDZ
        </div>
      )}

      {/* Basic info */}
      <div className="card p-6">
        <h3 className="font-bold mb-5 flex items-center gap-2">
          <User size={16} style={{ color: 'var(--accent)' }} /> Informations de base
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Prénom</label>
            <input className="input" value={form.firstName} onChange={e => upd('firstName', e.target.value)} placeholder="Votre prénom" />
          </div>
          <div>
            <label className="label">Nom</label>
            <input className="input" value={form.lastName} onChange={e => upd('lastName', e.target.value)} placeholder="Votre nom" />
          </div>
          <div>
            <label className="label flex items-center gap-1"><Phone size={11} /> Téléphone</label>
            <input className="input" value={form.phoneNumber} onChange={e => upd('phoneNumber', e.target.value)} placeholder="+213 ..." />
          </div>
          <div>
            <label className="label flex items-center gap-1"><MapPin size={11} /> Wilaya</label>
            <select className="input" value={form.wilaya} onChange={e => upd('wilaya', e.target.value)}>
              <option value="">Choisir une wilaya</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Ville</label>
            <input className="input" value={form.city} onChange={e => upd('city', e.target.value)} placeholder="Votre ville" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={profile?.email || ''} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
          </div>
        </div>
      </div>

      {/* Provider-specific fields */}
      {isProvider && (
        <div className="card p-6">
          <h3 className="font-bold mb-5 flex items-center gap-2">
            <Briefcase size={16} style={{ color: 'var(--accent)' }} /> Profil prestataire
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Bio</label>
              <textarea className="input" rows={4} value={form.bio} onChange={e => upd('bio', e.target.value)}
                placeholder="Décrivez votre expertise, votre parcours..." style={{ resize: 'vertical' }} />
            </div>
            {profile?.providerType === 'ORGANISM' && (
              <>
                <div>
                  <label className="label">Nom de l'organisme</label>
                  <input className="input" value={form.businessName} onChange={e => upd('businessName', e.target.value)} />
                </div>
                <div>
                  <label className="label">Description de l'organisme</label>
                  <textarea className="input" rows={3} value={form.businessDescription} onChange={e => upd('businessDescription', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
              </>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1"><Globe size={11} /> Site web</label>
                <input className="input" value={form.websiteUrl} onChange={e => upd('websiteUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="label">Années d'expérience</label>
                <input className="input" type="number" min="0" max="50" value={form.yearsExperience} onChange={e => upd('yearsExperience', e.target.value)} placeholder="Ex: 3" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save button bottom */}
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORIES TAB
// ══════════════════════════════════════════════════════════════════════════════
function CategoriesTab({ profile, allCategories, onUpdated }: {
  profile: UserProfile | null; allCategories: Category[]; onUpdated: () => void
}) {
  const [selected, setSelected] = useState<number[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile?.categories) setSelected(profile.categories.map(c => c.id))
  }, [profile])

  const toggle = (id: number) => {
    setSelected(s => s.includes(id)
      ? s.filter(x => x !== id)
      : s.length < 5 ? [...s, id] : (toast.error('Maximum 5 catégories'), s))
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/v1/me/categories`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ categoryIds: selected }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success('Catégories mises à jour !')
      onUpdated()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const roots = allCategories.filter(c => c.level === 0)
  const subs = allCategories.filter(c => c.level === 1)

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold mono mb-1" style={{ color: 'var(--accent)' }}>// CATÉGORIES</p>
          <h2 className="text-xl font-bold">Domaines d'activité</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {selected.length}/5 catégories sélectionnées
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Sauvegarder
        </button>
      </div>

      {allCategories.length === 0 ? (
        <div className="card p-12 text-center">
          <Loader2 size={24} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Chargement des catégories...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roots.map(root => {
            const children = subs.filter(c => c.parentId === root.id)
            const items = children.length > 0 ? children : [root]
            return (
              <div key={root.id} className="card p-5">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Tag size={14} style={{ color: 'var(--accent)' }} />
                  {root.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map(cat => {
                    const sel = selected.includes(cat.id)
                    return (
                      <button key={cat.id} onClick={() => toggle(cat.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: sel ? 'var(--accent)' : 'var(--bg-card2)',
                          color: sel ? 'white' : 'var(--text-muted)',
                          border: `1px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                          transform: sel ? 'scale(1.02)' : 'scale(1)',
                        }}>
                        {sel && <Check size={11} />}
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SECURITY TAB
// ══════════════════════════════════════════════════════════════════════════════
function SecurityTab({ profile }: { profile: UserProfile | null }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [show, setShow] = useState({ cur: false, new: false, con: false })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (form.newPassword !== form.confirmPassword) return toast.error('Les mots de passe ne correspondent pas')
    if (form.newPassword.length < 8) return toast.error('Minimum 8 caractères')
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/v1/me/password`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur')
      toast.success('Mot de passe modifié !')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <p className="text-xs font-semibold mono mb-1" style={{ color: 'var(--accent)' }}>// SÉCURITÉ</p>
        <h2 className="text-xl font-bold">Paramètres de sécurité</h2>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Shield size={16} style={{ color: 'var(--accent)' }} /> Informations du compte
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Email', value: profile?.email, icon: User },
            { label: 'Statut email', value: profile?.emailVerified ? 'Vérifié ✓' : 'Non vérifié', icon: CheckCircle, color: profile?.emailVerified ? 'var(--success)' : 'var(--warning)' },
            { label: 'Rôle', value: profile?.role, icon: Award },
            { label: 'Compte actif', value: 'Oui', icon: CheckCircle, color: 'var(--success)' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Icon size={14} /> {label}
              </div>
              <span className="text-sm font-semibold" style={{ color: color || 'var(--text)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <h3 className="font-bold mb-5 flex items-center gap-2">
          <Lock size={16} style={{ color: 'var(--accent)' }} /> Changer le mot de passe
        </h3>
        <div className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Mot de passe actuel', showKey: 'cur' as const },
            { key: 'newPassword', label: 'Nouveau mot de passe', showKey: 'new' as const },
            { key: 'confirmPassword', label: 'Confirmer le nouveau mot de passe', showKey: 'con' as const },
          ].map(({ key, label, showKey }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <div className="relative">
                <input
                  type={show[showKey] ? 'text' : 'password'}
                  className="input pr-12"
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}>
                  {show[showKey] ? <Eye size={15} /> : <Eye size={15} style={{ opacity: 0.4 }} />}
                </button>
              </div>
            </div>
          ))}
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
            {saving ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Wilayas list
const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira',
  'Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda',
  'Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',"M'Sila",'Mascara',
  'Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf',
  'Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma',
  'Aïn Témouchent','Ghardaïa','Relizane',"El M'Ghair",'El Meniaa','Ouled Djellal',
  'Bordj Badji Mokhtar','In Salah','In Guezzam','Touggourt','Djanet','Timimoun','Béni Abbès'
]

// ══════════════════════════════════════════════════════════════════════════════
// SERVICES TAB (PROVIDER ONLY)
// ══════════════════════════════════════════════════════════════════════════════
function ServicesTab({ profile }: { profile: UserProfile | null }) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold mono mb-1" style={{ color: 'var(--accent)' }}>// MES SERVICES</p>
          <h2 className="text-xl font-bold">Mes services (Gigs)</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Gérez vos offres de services
          </p>
        </div>
        <Link href="/services/create" className="btn-primary">
          <Plus size={15} /> Nouveau service
        </Link>
      </div>

      {/* Empty state */}
      <div className="card p-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--accent-glow)' }}>
          <Package size={28} style={{ color: 'var(--accent)' }} />
        </div>
        <h3 className="font-bold text-lg mb-2">Aucun service publié</h3>
        <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
          Créez votre premier service pour commencer à recevoir des commandes de clients.
        </p>
        <Link href="/services/create" className="btn-primary inline-flex">
          <Plus size={15} /> Créer mon premier service
        </Link>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS TAB (CLIENT + PROVIDER)
// ══════════════════════════════════════════════════════════════════════════════
function OrdersTab({ isProvider }: { isProvider: boolean }) {
  const [filter, setFilter] = useState('Toutes')
  const filters = ['Toutes', 'En cours', 'Livrées', 'Terminées', 'Annulées']

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <p className="text-xs font-semibold mono mb-1" style={{ color: 'var(--accent)' }}>// COMMANDES</p>
        <h2 className="text-xl font-bold">{isProvider ? 'Commandes reçues' : 'Mes commandes'}</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {isProvider ? 'Suivez les commandes de vos clients' : 'Suivez vos commandes en cours'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: filter === f ? 'var(--accent)' : 'var(--bg-card2)',
              color: filter === f ? 'white' : 'var(--text-muted)',
              border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="card p-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(0,217,163,0.1)' }}>
          <ShoppingBag size={28} style={{ color: 'var(--accent3)' }} />
        </div>
        <h3 className="font-bold text-lg mb-2">Aucune commande</h3>
        <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
          {isProvider
            ? 'Vous n\'avez pas encore reçu de commandes. Complétez votre profil pour attirer plus de clients.'
            : 'Vous n\'avez pas encore passé de commande. Explorez nos services pour trouver ce dont vous avez besoin.'}
        </p>
        {!isProvider && (
          <Link href="/services" className="btn-primary inline-flex">
            <Search size={15} /> Explorer les services
          </Link>
        )}
      </div>
    </div>
  )
}