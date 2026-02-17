export interface Agent {
  id: string
  name: string
  description: string
  longDescription?: string
  authorId: string
  author?: { name: string; verified: boolean }
  category: string
  tags: string[]
  version: string
  pricing: 'free' | 'paid' | 'subscription'
  price?: number
  icon?: string
  screenshots?: string[]
  config?: {
    capabilities: string[]
    modelRequirements?: string[]
    environmentVars?: Record<string, string>
  }
  downloads: number
  rating: number
  reviewCount: number
  status: 'draft' | 'published' | 'deprecated' | 'removed'
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  agentId: string
  userId: string
  user?: string
  rating: number
  title: string
  content: string
  helpful: number
  createdAt: Date
  updatedAt?: Date
}

export interface Deployment {
  id: string
  agentId: string
  userId: string
  status: 'pending' | 'active' | 'failed' | 'stopped'
  config?: Record<string, any>
  deployedAt: Date
  lastActivity?: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'developer' | 'admin'
  createdAt: Date
}

export interface Category {
  name: string
  slug: string
  icon?: string
  description?: string
  count: number
}
