'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur de connexion')

      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      toast.success('Connexion réussie !')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--accent)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-up">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent)', boxShadow: '0 0 24px var(--accent-glow)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl">Freelance<span style={{ color: 'var(--accent)' }}>DZ</span></span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Bon retour !</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Connectez-vous à votre compte FreelanceDZ
          </p>
        </div>

        {/* Card */}
        <div className="card p-8 animate-fade-up delay-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label" style={{ margin: 0 }}>Mot de passe</label>
                <Link href="/auth/forgot-password"
                  className="text-xs transition-colors"
                  style={{ color: 'var(--accent)' }}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base mt-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>
                Se connecter <ArrowRight size={16} />
              </>}
            </button>
          </form>

          <div className="relative my-6">
            <hr className="divider" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
              ou
            </span>
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="font-semibold transition-colors"
              style={{ color: 'var(--accent)' }}>
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
