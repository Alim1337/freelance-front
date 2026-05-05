import Link from 'next/link'
import {
  ArrowRight, Search, Star, Shield, Zap, TrendingUp,
  Code2, Palette, Building2, Megaphone, BookOpen, Calculator,
  ChevronRight, Users, Briefcase, Award
} from 'lucide-react'

const STATS = [
  { value: '2 400+', label: 'Prestataires actifs', icon: Users },
  { value: '8 700+', label: 'Services publiés', icon: Briefcase },
  { value: '98%', label: 'Clients satisfaits', icon: Star },
  { value: '48', label: 'Wilayas couvertes', icon: Award },
]

const CATEGORIES = [
  { name: 'Informatique', sub: 'Dév web · Mobile · DevOps', icon: Code2, color: '#6c63ff', count: 420 },
  { name: 'Design', sub: 'Graphisme · UI/UX · Vidéo', icon: Palette, color: '#ff6b6b', count: 318 },
  { name: 'Architecture', sub: 'Intérieur · Plans 3D · BIM', icon: Building2, color: '#00d9a3', count: 145 },
  { name: 'Marketing', sub: 'SEO · Réseaux · Rédaction', icon: Megaphone, color: '#ffb347', count: 267 },
  { name: 'Formation', sub: 'Cours · Tutorat · Coaching', icon: BookOpen, color: '#a78bfa', count: 189 },
  { name: 'Comptabilité', sub: 'Fisc · Paie · Conseil', icon: Calculator, color: '#34d399', count: 98 },
]

const FEATURED = [
  { title: 'Développement site web vitrine', provider: 'Yacine B.', rating: 4.9, reviews: 47, price: '15 000', level: 'TOP', cat: 'Développement web' },
  { title: 'Logo & identité visuelle complète', provider: 'Sarah M.', rating: 5.0, reviews: 83, price: '8 000', level: 'EXPERT', cat: 'Design graphique' },
  { title: 'Application mobile React Native', provider: 'DevPro SARL', rating: 4.8, reviews: 31, price: '45 000', level: 'TOP', cat: 'Développement mobile' },
  { title: 'Gestion réseaux sociaux (1 mois)', provider: 'Amira K.', rating: 4.7, reviews: 62, price: '12 000', level: 'RISING', cat: 'Marketing digital' },
]

export default function HomePage() {
  return (
    <div style={{ paddingTop: '64px' }}>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'var(--accent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: 'var(--accent3)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-sm font-medium animate-fade-up"
            style={{ background: 'var(--accent-glow)', border: '1px solid rgba(108,99,255,0.3)', color: 'var(--accent)' }}>
            <div className="glow-dot" />
            La première plateforme freelance 100% algérienne
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6 animate-fade-up delay-100">
            Trouvez le bon{' '}
            <span className="gradient-text">prestataire</span>
            <br />pour votre projet
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-up delay-200"
            style={{ color: 'var(--text-muted)' }}>
            Des milliers de freelances et organismes qualifiés en Algérie — développement, design, marketing,
            architecture et bien plus.
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto animate-fade-up delay-300">
            <div className="flex items-center gap-3 p-2 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
              <Search size={18} className="ml-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Rechercher un service, une compétence..."
                className="flex-1 bg-transparent outline-none text-sm py-2"
                style={{ color: 'var(--text)', fontFamily: 'Sora, sans-serif' }}
              />
              <Link href="/services" className="btn-primary flex-shrink-0">
                Rechercher
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-5 animate-fade-up delay-300">
            {['Développement web', 'Logo & branding', 'SEO', 'Application mobile', 'Design UI'].map(tag => (
              <Link key={tag} href={`/services?q=${encodeURIComponent(tag)}`}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: 'var(--bg-card2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)'
                }}>
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="card p-6 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'var(--accent-glow)' }}>
                <Icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-3xl font-bold mb-1">{value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold mb-2 mono" style={{ color: 'var(--accent)' }}>// EXPLORER</p>
              <h2 className="section-title">Catégories populaires</h2>
              <p className="section-subtitle">Toutes les compétences dont vous avez besoin</p>
            </div>
            <Link href="/services" className="btn-ghost hidden md:flex">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map(({ name, sub, icon: Icon, color, count }) => (
              <Link
                key={name}
                href={`/services?category=${encodeURIComponent(name.toLowerCase())}`}
                className="card p-6 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${color}15` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <span className="badge badge-accent text-xs">{count}</span>
                </div>
                <h3 className="font-bold text-base mb-1">{name}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color }}>
                  Explorer <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold mb-2 mono" style={{ color: 'var(--accent3)' }}>// TENDANCES</p>
              <h2 className="section-title">Services populaires</h2>
              <p className="section-subtitle">Les plus demandés cette semaine</p>
            </div>
            <Link href="/services" className="btn-ghost hidden md:flex">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED.map(({ title, provider, rating, reviews, price, level, cat }) => (
              <div key={title} className="card p-5 group cursor-pointer">
                {/* Image placeholder */}
                <div className="w-full h-36 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: 'var(--bg-card2)' }}>
                  <Briefcase size={28} style={{ color: 'var(--text-faint)' }} />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-md"
                    style={{ background: 'var(--bg-card2)', color: 'var(--text-muted)' }}>
                    {cat}
                  </span>
                  <span className={`badge text-xs ${
                    level === 'EXPERT' ? 'badge-accent' :
                    level === 'TOP' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {level}
                  </span>
                </div>

                <h3 className="font-semibold text-sm mb-2 leading-snug line-clamp-2">{title}</h3>

                <div className="flex items-center gap-1 mb-3" style={{ color: 'var(--text-muted)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--accent)' }}>
                    {provider[0]}
                  </div>
                  <span className="text-xs">{provider}</span>
                </div>

                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-1">
                    <Star size={11} style={{ color: 'var(--warning)' }} fill="var(--warning)" />
                    <span className="text-xs font-semibold">{rating}</span>
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>({reviews})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>À partir de</span>
                    <div className="text-sm font-bold">{price} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>DZD</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold mb-2 mono" style={{ color: 'var(--accent2)' }}>// POURQUOI NOUS</p>
            <h2 className="section-title">Conçu pour l'Algérie</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Pas une copie. Une plateforme pensée pour les besoins et la réalité du marché algérien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, color: 'var(--accent)', title: 'Prestataires vérifiés', desc: 'Chaque profil est vérifié par notre équipe. Travaillez avec des professionnels de confiance.' },
              { icon: Zap, color: 'var(--accent3)', title: 'Paiement sécurisé', desc: 'Système d\'escrow intégré. Votre argent est libéré uniquement à la livraison.' },
              { icon: TrendingUp, color: 'var(--warning)', title: 'Croissez ensemble', desc: 'Programme de niveaux pour les prestataires. Plus vous travaillez, plus vous gagnez en visibilité.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card p-7">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}15` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(circle at 50% 0%, var(--accent) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Prêt à démarrer ?</h2>
              <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
                Rejoignez des milliers de professionnels algériens sur FreelanceDZ.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/register?role=client" className="btn-primary text-base px-8 py-4">
                  Je cherche un prestataire <ArrowRight size={18} />
                </Link>
                <Link href="/auth/register?role=provider" className="btn-secondary text-base px-8 py-4">
                  Je propose mes services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent)' }}>
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold">FreelanceDZ</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 FreelanceDZ. Fait avec ♥ en Algérie.
          </p>
          <div className="flex gap-4">
            {['Confidentialité', 'CGU', 'Contact'].map(l => (
              <Link key={l} href="#" className="text-sm transition-colors"
                style={{ color: 'var(--text-muted)' }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
