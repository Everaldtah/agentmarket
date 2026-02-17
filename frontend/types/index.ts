// Core types for AgentMarket

export interface Agent {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  author: Author;
  category: Category;
  tags: string[];
  rating: number;
  reviewCount: number;
  installCount: number;
  pricing: Pricing;
  version: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string;
  features: string[];
  requirements: string[];
  documentation?: string;
}

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
}

export type Category =
  | 'productivity'
  | 'coding'
  | 'writing'
  | 'research'
  | 'automation'
  | 'communication'
  | 'data-analysis'
  | 'creative'
  | 'education'
  | 'other';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
  agentCount: number;
}

export type PricingType = 'free' | 'paid' | 'subscription';

export interface Pricing {
  type: PricingType;
  amount?: number;
  currency?: string;
  interval?: 'month' | 'year';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Deployment {
  id: string;
  agentId: string;
  agentName: string;
  status: 'active' | 'inactive' | 'error';
  deployedAt: string;
  lastUsed: string;
  usageCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  publishedAgents: Agent[];
  deployments: Deployment[];
}

export interface SearchFilters {
  query?: string;
  category?: Category;
  minRating?: number;
  pricingType?: PricingType;
  sortBy?: 'popular' | 'rating' | 'newest' | 'name';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
