import {
  Agent,
  Review,
  Deployment,
  User,
  SearchFilters,
  PaginatedResponse,
  Category,
  CategoryInfo,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Simulated data for development - will be replaced with real API calls
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'CodeAssistant Pro',
    description: 'An advanced AI coding assistant that helps you write, review, and debug code across multiple programming languages. Features include intelligent code completion, automated testing, and real-time collaboration.',
    shortDescription: 'Advanced AI coding assistant for writing, reviewing, and debugging code',
    author: { id: 'u1', name: 'DevLabs', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devlabs', verified: true },
    category: 'coding',
    tags: ['code', 'development', 'debugging', 'review'],
    rating: 4.8,
    reviewCount: 342,
    installCount: 15420,
    pricing: { type: 'subscription', amount: 9.99, currency: 'USD', interval: 'month' },
    version: '2.1.0',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/code1/400/300',
    features: ['Multi-language support', 'Code review', 'Auto-completion', 'Test generation'],
    requirements: ['Node.js 18+', 'API key required'],
  },
  {
    id: '2',
    name: 'ResearchBot',
    description: 'Comprehensive research assistant that scans academic papers, news articles, and web sources to compile detailed reports. Perfect for students, researchers, and professionals.',
    shortDescription: 'Research assistant for compiling reports from multiple sources',
    author: { id: 'u2', name: 'AI Scholars', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aischolars', verified: true },
    category: 'research',
    tags: ['research', 'academic', 'analysis', 'reports'],
    rating: 4.6,
    reviewCount: 189,
    installCount: 8750,
    pricing: { type: 'free' },
    version: '1.5.2',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-18T09:15:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/research1/400/300',
    features: ['Multi-source search', 'Citation management', 'Report generation', 'Summarization'],
    requirements: ['Internet connection'],
  },
  {
    id: '3',
    name: 'ContentWriter AI',
    description: 'Create engaging blog posts, marketing copy, and social media content with AI-powered writing assistance. Includes SEO optimization and tone adjustment features.',
    shortDescription: 'AI writing assistant for blogs, marketing, and social media',
    author: { id: 'u3', name: 'WriteTech', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=writetech', verified: false },
    category: 'writing',
    tags: ['writing', 'content', 'marketing', 'SEO'],
    rating: 4.4,
    reviewCount: 267,
    installCount: 12300,
    pricing: { type: 'subscription', amount: 14.99, currency: 'USD', interval: 'month' },
    version: '3.0.1',
    createdAt: '2023-11-20T12:00:00Z',
    updatedAt: '2024-03-22T16:45:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/writing1/400/300',
    features: ['SEO optimization', 'Tone adjustment', 'Template library', 'Plagiarism check'],
    requirements: ['API key required'],
  },
  {
    id: '4',
    name: 'DataAnalyzer',
    description: 'Powerful data analysis agent that processes CSV, Excel, and database files to generate insights, visualizations, and reports. Supports statistical analysis and ML predictions.',
    shortDescription: 'Data analysis and visualization for spreadsheets and databases',
    author: { id: 'u4', name: 'DataMinds', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dataminds', verified: true },
    category: 'data-analysis',
    tags: ['data', 'analytics', 'visualization', 'statistics'],
    rating: 4.7,
    reviewCount: 156,
    installCount: 6420,
    pricing: { type: 'paid', amount: 49.99, currency: 'USD' },
    version: '2.4.0',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-03-19T11:20:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/data1/400/300',
    features: ['Multiple formats', 'Visualizations', 'ML predictions', 'Report export'],
    requirements: ['Python 3.9+', '8GB RAM recommended'],
  },
  {
    id: '5',
    name: 'TaskAutomator',
    description: 'Automate repetitive tasks with this intelligent workflow agent. Connect apps, schedule actions, and create complex automation chains without coding.',
    shortDescription: 'Workflow automation for connecting apps and scheduling tasks',
    author: { id: 'u5', name: 'AutoFlow', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=autoflow', verified: true },
    category: 'automation',
    tags: ['automation', 'workflow', 'productivity', 'integration'],
    rating: 4.5,
    reviewCount: 423,
    installCount: 28900,
    pricing: { type: 'free' },
    version: '4.2.1',
    createdAt: '2023-09-10T09:00:00Z',
    updatedAt: '2024-03-21T13:00:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/automation1/400/300',
    features: ['Visual builder', '200+ integrations', 'Scheduling', 'Error handling'],
    requirements: ['None'],
  },
  {
    id: '6',
    name: 'EmailGenius',
    description: 'Smart email management and composition agent. Draft professional emails, categorize inbox, set reminders, and automate follow-ups with AI assistance.',
    shortDescription: 'Email management and composition with AI assistance',
    author: { id: 'u6', name: 'MailTech', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mailtech', verified: false },
    category: 'communication',
    tags: ['email', 'communication', 'productivity', 'automation'],
    rating: 4.3,
    reviewCount: 198,
    installCount: 9850,
    pricing: { type: 'subscription', amount: 4.99, currency: 'USD', interval: 'month' },
    version: '1.8.3',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-03-17T10:30:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/email1/400/300',
    features: ['Smart compose', 'Auto-categorize', 'Follow-up reminders', 'Templates'],
    requirements: ['Email account connection'],
  },
];

const mockReviews: Review[] = [
  {
    id: 'r1',
    userId: 'u10',
    userName: 'Alex Johnson',
    userAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    rating: 5,
    comment: 'Excellent agent! Has significantly improved my coding workflow. The code review feature alone is worth the subscription.',
    createdAt: '2024-03-15T14:20:00Z',
    helpful: 24,
  },
  {
    id: 'r2',
    userId: 'u11',
    userName: 'Sarah Chen',
    userAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    rating: 4,
    comment: 'Very useful for most tasks. Would love to see better TypeScript support in future updates.',
    createdAt: '2024-03-10T09:45:00Z',
    helpful: 18,
  },
  {
    id: 'r3',
    userId: 'u12',
    userName: 'Mike Peters',
    userAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    rating: 5,
    comment: 'Game changer for my team. We have integrated it into our CI/CD pipeline and it has caught numerous bugs.',
    createdAt: '2024-03-05T16:30:00Z',
    helpful: 31,
  },
];

const mockCategories: CategoryInfo[] = [
  { id: 'productivity', name: 'Productivity', icon: 'Zap', description: 'Boost your efficiency and get more done', agentCount: 245 },
  { id: 'coding', name: 'Coding', icon: 'Code', description: 'Development tools and coding assistants', agentCount: 189 },
  { id: 'writing', name: 'Writing', icon: 'PenTool', description: 'Content creation and editing tools', agentCount: 156 },
  { id: 'research', name: 'Research', icon: 'Search', description: 'Research and information gathering', agentCount: 98 },
  { id: 'automation', name: 'Automation', icon: 'Settings', description: 'Workflow automation and integrations', agentCount: 134 },
  { id: 'communication', name: 'Communication', icon: 'MessageSquare', description: 'Email, chat, and communication tools', agentCount: 87 },
  { id: 'data-analysis', name: 'Data Analysis', icon: 'BarChart', description: 'Data processing and visualization', agentCount: 112 },
  { id: 'creative', name: 'Creative', icon: 'Palette', description: 'Art, design, and creative tools', agentCount: 203 },
  { id: 'education', name: 'Education', icon: 'GraduationCap', description: 'Learning and educational content', agentCount: 145 },
  { id: 'other', name: 'Other', icon: 'Box', description: 'Other specialized agents', agentCount: 67 },
];

class ApiClient {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_URL) {
      return this.handleMockRequest<T>(endpoint, options);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  private handleMockRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Agents
        if (endpoint === '/agents') {
          const params = new URLSearchParams(options?.body as string || '');
          let filtered = [...mockAgents];
          
          if (params.get('category')) {
            filtered = filtered.filter(a => a.category === params.get('category'));
          }
          if (params.get('minRating')) {
            filtered = filtered.filter(a => a.rating >= Number(params.get('minRating')));
          }
          if (params.get('pricingType')) {
            filtered = filtered.filter(a => a.pricing.type === params.get('pricingType'));
          }
          
          resolve({
            data: filtered,
            total: filtered.length,
            page: 1,
            pageSize: 20,
            hasMore: false,
          } as T);
          return;
        }

        // Single agent
        const agentMatch = endpoint.match(/\/agents\/([^/]+)/);
        if (agentMatch) {
          const agent = mockAgents.find(a => a.id === agentMatch[1]);
          resolve(agent as T);
          return;
        }

        // Reviews
        const reviewsMatch = endpoint.match(/\/agents\/([^/]+)\/reviews/);
        if (reviewsMatch) {
          resolve({
            data: mockReviews,
            total: mockReviews.length,
            page: 1,
            pageSize: 20,
            hasMore: false,
          } as T);
          return;
        }

        // Categories
        if (endpoint === '/categories') {
          resolve(mockCategories as T);
          return;
        }

        // Featured agents
        if (endpoint === '/agents/featured') {
          resolve(mockAgents.slice(0, 4) as T);
          return;
        }

        // User deployments
        if (endpoint === '/user/deployments') {
          resolve([
            {
              id: 'd1',
              agentId: '1',
              agentName: 'CodeAssistant Pro',
              status: 'active',
              deployedAt: '2024-03-01T10:00:00Z',
              lastUsed: '2024-03-22T14:30:00Z',
              usageCount: 156,
            },
            {
              id: 'd2',
              agentId: '5',
              agentName: 'TaskAutomator',
              status: 'active',
              deployedAt: '2024-02-15T08:00:00Z',
              lastUsed: '2024-03-21T09:15:00Z',
              usageCount: 89,
            },
          ] as T);
          return;
        }

        // Published agents
        if (endpoint === '/user/agents') {
          resolve([mockAgents[1], mockAgents[4]] as T);
          return;
        }

        resolve({} as T);
      }, 200); // Simulate network delay
    });
  }

  // Agents
  async getAgents(filters?: SearchFilters): Promise<PaginatedResponse<Agent>> {
    const params = new URLSearchParams();
    if (filters?.query) params.set('query', filters.query);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.minRating) params.set('minRating', String(filters.minRating));
    if (filters?.pricingType) params.set('pricingType', filters.pricingType);
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    
    return this.fetch<PaginatedResponse<Agent>>(`/agents?${params.toString()}`);
  }

  async getAgent(id: string): Promise<Agent | null> {
    return this.fetch<Agent | null>(`/agents/${id}`);
  }

  async getFeaturedAgents(): Promise<Agent[]> {
    return this.fetch<Agent[]>('/agents/featured');
  }

  async getAgentReviews(agentId: string): Promise<PaginatedResponse<Review>> {
    return this.fetch<PaginatedResponse<Review>>(`/agents/${agentId}/reviews`);
  }

  // Categories
  async getCategories(): Promise<CategoryInfo[]> {
    return this.fetch<CategoryInfo[]>('/categories');
  }

  // User
  async getUserDeployments(): Promise<Deployment[]> {
    return this.fetch<Deployment[]>('/user/deployments');
  }

  async getUserAgents(): Promise<Agent[]> {
    return this.fetch<Agent[]>('/user/agents');
  }

  // Actions
  async installAgent(agentId: string): Promise<{ success: boolean; deploymentId: string }> {
    return this.fetch('/agents/install', {
      method: 'POST',
      body: JSON.stringify({ agentId }),
    });
  }

  async publishAgent(data: Partial<Agent>): Promise<Agent> {
    return this.fetch('/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitReview(agentId: string, review: { rating: number; comment: string }): Promise<Review> {
    return this.fetch(`/agents/${agentId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }
}

export const api = new ApiClient();
