// =============================================
// Types globaux — Freelance DZ
// =============================================

export type UserRole = 'CLIENT' | 'PROVIDER' | 'ADMIN'
export type ProviderType = 'PERSON' | 'ORGANISM'
export type ProviderLevel = 'NEW' | 'RISING' | 'TOP' | 'EXPERT'

export interface UserSummary {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: UserRole
  providerType?: ProviderType
  emailVerified: boolean
  verified: boolean
}

export interface User extends UserSummary {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  city?: string
  wilaya?: string
  preferredLanguage: string
  bio?: string
  businessName?: string
  businessDescription?: string
  websiteUrl?: string
  yearsExperience?: number
  providerLevel: ProviderLevel
  averageRating: number
  totalReviews: number
  completedOrders: number
  walletBalance: number
  categories: CategoryFlat[]
  skills: string[]
  createdAt: string
}

// ── Category ────────────────────────────────────────────

export interface CategoryResponse {
  id: number
  name: string
  nameAr?: string
  slug: string
  description?: string
  iconName?: string
  parentId?: number
  level: number
  active: boolean
  sortOrder: number
  providerCount: number
  serviceCount: number
  children?: CategoryResponse[]
}

export interface CategoryFlat {
  id: number
  name: string
  nameAr?: string
  slug: string
  iconName?: string
  parentId?: number
  parentName?: string
  level: number
}

// ── Auth ─────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserSummary
}

export interface RegisterRequest {
  email: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
  phoneNumber?: string
  city?: string
  wilaya?: string
  providerType?: ProviderType
  businessName?: string
  businessDescription?: string
  websiteUrl?: string
}

export interface LoginRequest {
  email: string
  password: string
}

// ── API ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

// ── Service / Gig (Phase 3) ──────────────────────────────

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'

// Wilayas d'Algérie
export const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa',
  'Biskra', 'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa',
  'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel',
  'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla',
  'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès',
  'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma',
  'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'El M\'Ghair',
  'El Meniaa', 'Ouled Djellal', 'Bordj Badji Mokhtar', 'In Salah',
  'In Guezzam', 'Touggourt', 'Djanet', 'M\'Ghair', 'El Mghair'
]
