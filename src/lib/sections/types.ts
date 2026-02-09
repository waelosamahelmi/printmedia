// Section type definitions for database-driven pages

export interface CTALink {
  text: string
  href: string
}

export interface HeroSettings {
  subtitle?: string
  title: string
  description: string
  primaryCta?: CTALink
  secondaryCta?: CTALink
  image?: string
  features?: string[]
}

export interface Feature {
  icon: string // lucide icon name
  title: string
  description: string
}

export interface FeaturesSettings {
  title: string
  subtitle?: string
  features: Feature[]
}

export interface CategoriesSettings {
  title?: string
  subtitle?: string
  mode: 'manual' | 'auto'
  categoryIds?: string[] // if manual mode
  limit?: number // if auto mode
}

export interface ProductsSettings {
  title?: string
  subtitle?: string
  mode: 'manual' | 'featured' | 'category'
  productIds?: string[] // if manual mode
  categoryId?: string // if category mode
  limit?: number
  viewAllHref?: string
}

export interface CTASettings {
  variant: 'default' | 'dark' | 'gradient'
  title: string
  description: string
  primaryCta?: CTALink
  secondaryCta?: CTALink
  image?: string
}

export interface ContactSettings {
  showMap: boolean
}

export interface ContentSettings {
  html: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface CustomHTMLSettings {
  html: string
  dangerouslyAllowScripts?: boolean
}

// Union type for all section settings
export type SectionSettings =
  | HeroSettings
  | FeaturesSettings
  | CategoriesSettings
  | ProductsSettings
  | CTASettings
  | ContactSettings
  | ContentSettings
  | CustomHTMLSettings

// Section type enum
export type SectionType =
  | 'hero'
  | 'features'
  | 'categories'
  | 'products'
  | 'cta'
  | 'contact'
  | 'content'
  | 'custom_html'

// Full section interface (matches database Section model)
export interface PageSection {
  id: string
  pageId: string
  type: SectionType
  title?: string | null
  content?: string | null
  settings?: string | null // JSON string
  sortOrder: number
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
}

// Helper type for parsed settings
export interface ParsedSection extends Omit<PageSection, 'settings'> {
  settings: SectionSettings
}
