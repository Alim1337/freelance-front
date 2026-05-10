'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowRight, ArrowLeft, Loader2, User, Building2, Briefcase, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira',
  'Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda',
  'Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem','M\'Sila','Mascara',
  'Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf',
  'Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma',
  'Aïn Témouchent','Ghardaïa','Relizane','El M\'Ghair','El Meniaa','Ouled Djellal',
  'Bordj Badji Mokhtar','In Salah','In Guezzam','Touggourt','Djanet','Timimoun','Béni Abbès'
]

type Step = 1 | 2 | 3 | 4
type Role = 'CLIENT' | 'PROVIDER'
type ProviderType = 'PERSON' | 'ORGANISM'

interface Category { id: number; name: string; slug: string; iconName?: string; parentId?: number; level: number }

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'provider' ? 'PROVIDER' : 'CLIENT'

  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [showPwd, setShowPwd] = useState(false)

  const [form, setForm] = useState({
    role: defaultRole as Role,
    providerType: 'PERSON' as ProviderType,
    email: '', password: '',
    firstName: '', lastName: '',
    phoneNumber: '', wilaya: '',
    businessName: '',
    categoryIds: [] as number[],
  })

  // Load categories from backend
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/flat`)
      .then(r => r.json())
      .then(d => setCategories(d.data || []))
      .catch(() => {})
  }, [])

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }))

  const toggleCategory = (id: number) => {
    setForm(f => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter(c => c !== id)
        : f.categoryIds.length < 5 ? [...f.categoryIds, id] : f.categoryIds
    }))
  }

  const totalSteps = form.role === 'PROVIDER' ? 4 : 3

  const next = () => {
    if (step === 1 && !form.role) return toast.error('Choisissez un type de compte')
    if (step === 2) {
      if (!form.email || !form.password) return toast.error('Email et mot de passe obligatoires')
      if (form.password.length < 8) return toast.error('Mot de passe : minimum 8 caractères')
      if (!form.firstName || !form.lastName) return toast.error('Prénom et nom obligatoires')
    }
    if (step === 3 && form.role === 'PROVIDER' && form.providerType === 'ORGANISM' && !form.businessName)
      return toast.error('Nom de l\'organisme obligatoire')
    setStep(s => (s + 1) as Step)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const body: any = {
        email: form.email,
        password: form.password,
        role: form.role,
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber || undefined,
        wilaya: form.wilaya || undefined,
      }
      if (form.role === 'PROVIDER') {
        body.providerType = form.providerType
        if (form.providerType === 'ORGANISM') body.businessName = form.businessName
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription')

      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      router.push('/auth/login')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const rootCategories = categories.filter(c => c.level === 0)
  const subCategories = categories.filter(c => c.level === 1)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--accent)' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-up">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent)', boxShadow: '0 0 24px var(--accent-glow)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl">Freelance<span style={{ color: 'var(--accent)' }}>DZ</span></span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Étape {step} sur {totalSteps}</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6 animate-fade-up">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{ background: i < step ? 'var(--accent)' : 'var(--border-light)' }} />
          ))}
        </div>

        <div className="card p-8 animate-fade-up delay-100">

          {/* ── STEP 1: Choisir le rôle ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Quel est votre profil ?</h2>
              {[
                { role: 'CLIENT' as Role, icon: Briefcase, title: 'Client', desc: 'Je cherche des prestataires pour mes projets' },
                { role: 'PROVIDER' as Role, icon: User, title: 'Prestataire', desc: 'Je propose mes services et compétences' },
              ].map(({ role, icon: Icon, title, desc }) => (
                <button key={role} onClick={() => update('role', role)}
                  className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all"
                  style={{
                    background: form.role === role ? 'var(--accent-glow)' : 'var(--bg-card2)',
                    border: `2px solid ${form.role === role ? 'var(--accent)' : 'var(--border)'}`,
                  }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: form.role === role ? 'var(--accent)' : 'var(--bg-card)' }}>
                    <Icon size={20} className={form.role === role ? 'text-white' : ''} style={{ color: form.role === role ? 'white' : 'var(--text-muted)' }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{title}</div>
                    <div className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                  {form.role === role && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--accent)' }}>
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
              <button onClick={next} className="btn-primary w-full justify-center py-3.5 mt-2">
                Continuer <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Infos personnelles ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Vos informations</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Prénom</label>
                  <input className="input" placeholder="Yacine" value={form.firstName}
                    onChange={e => update('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="label">Nom</label>
                  <input className="input" placeholder="Benali" value={form.lastName}
                    onChange={e => update('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="vous@exemple.com" value={form.email}
                  onChange={e => update('email', e.target.value)} />
              </div>
              <div>
                <label className="label">Mot de passe</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} className="input pr-12"
                    placeholder="Minimum 8 caractères" value={form.password}
                    onChange={e => update('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[4, 6, 8, 10].map(len => (
                      <div key={len} className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: form.password.length >= len ? 'var(--accent)' : 'var(--border)' }} />
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Téléphone <span style={{ color: 'var(--text-faint)' }}>(optionnel)</span></label>
                  <input className="input" placeholder="0555 ..." value={form.phoneNumber}
                    onChange={e => update('phoneNumber', e.target.value)} />
                </div>
                <div>
                  <label className="label">Wilaya <span style={{ color: 'var(--text-faint)' }}>(optionnel)</span></label>
                  <select className="input" value={form.wilaya} onChange={e => update('wilaya', e.target.value)}
                    style={{ background: 'var(--bg-card2)' }}>
                    <option value="">Choisir...</option>
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">
                  <ArrowLeft size={16} /> Retour
                </button>
                <button onClick={next} className="btn-primary flex-1 justify-center">
                  Continuer <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Type prestataire ou confirmation client ── */}
          {step === 3 && (
            <div className="space-y-4">
              {form.role === 'PROVIDER' ? (
                <>
                  <h2 className="text-xl font-bold mb-6">Type de prestataire</h2>
                  {[
                    { type: 'PERSON' as ProviderType, icon: User, title: 'Personne physique', desc: 'Freelance individuel' },
                    { type: 'ORGANISM' as ProviderType, icon: Building2, title: 'Organisme / Entreprise', desc: 'Agence, société, association' },
                  ].map(({ type, icon: Icon, title, desc }) => (
                    <button key={type} onClick={() => update('providerType', type)}
                      className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all"
                      style={{
                        background: form.providerType === type ? 'var(--accent-glow)' : 'var(--bg-card2)',
                        border: `2px solid ${form.providerType === type ? 'var(--accent)' : 'var(--border)'}`,
                      }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: form.providerType === type ? 'var(--accent)' : 'var(--bg-card)' }}>
                        <Icon size={20} style={{ color: form.providerType === type ? 'white' : 'var(--text-muted)' }} />
                      </div>
                      <div>
                        <div className="font-bold">{title}</div>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                      </div>
                      {form.providerType === type && (
                        <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--accent)' }}>
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}

                  {form.providerType === 'ORGANISM' && (
                    <div>
                      <label className="label">Nom de l'organisme / entreprise</label>
                      <input className="input" placeholder="Ex: DevAgency SARL, Studio Pixel..."
                        value={form.businessName} onChange={e => update('businessName', e.target.value)} />
                    </div>
                  )}
                </>
              ) : (
                // Client — résumé avant soumission
                <div>
                  <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>
                  <div className="space-y-3 p-4 rounded-xl" style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
                    {[
                      { label: 'Nom', value: `${form.firstName} ${form.lastName}` },
                      { label: 'Email', value: form.email },
                      { label: 'Type de compte', value: 'Client' },
                      { label: 'Wilaya', value: form.wilaya || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
                    Votre compte sera actif immédiatement après l'inscription.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">
                  <ArrowLeft size={16} /> Retour
                </button>
                {form.role === 'PROVIDER' ? (
                  <button onClick={next} className="btn-primary flex-1 justify-center">
                    Continuer <ArrowRight size={16} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>Créer mon compte <Check size={16} /></>}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 4: Catégories (PROVIDER only) ── */}
          {step === 4 && form.role === 'PROVIDER' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Vos domaines d'activité</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Choisissez jusqu'à 5 catégories. Modifiable à tout moment.
                </p>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                  <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                  Chargement des catégories...
                </div>
              ) : (
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {rootCategories.map(root => {
                    const children = subCategories.filter(c => c.parentId === root.id)
                    return (
                      <div key={root.id}>
                        <p className="text-xs font-semibold mb-2 uppercase tracking-wider"
                          style={{ color: 'var(--text-muted)' }}>
                          {root.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(children.length > 0 ? children : [root]).map(cat => {
                            const selected = form.categoryIds.includes(cat.id)
                            return (
                              <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                                style={{
                                  background: selected ? 'var(--accent)' : 'var(--bg-card2)',
                                  border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                                  color: selected ? 'white' : 'var(--text-muted)',
                                }}>
                                {selected && <Check size={11} className="inline mr-1" />}
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

              {form.categoryIds.length > 0 && (
                <p className="text-xs" style={{ color: 'var(--accent)' }}>
                  {form.categoryIds.length} catégorie{form.categoryIds.length > 1 ? 's' : ''} sélectionnée{form.categoryIds.length > 1 ? 's' : ''}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(3)} className="btn-secondary flex-1 justify-center">
                  <ArrowLeft size={16} /> Retour
                </button>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Créer mon compte <Check size={16} /></>}
                </button>
              </div>
              <p className="text-xs text-center" style={{ color: 'var(--text-faint)' }}>
                Vous pourrez modifier vos catégories depuis votre profil
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
