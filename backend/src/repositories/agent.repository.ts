import { Agent } from '../types'

export class AgentRepository {
  private agents: Map<string, Agent> = new Map()

  findAll(): Agent[] {
    return Array.from(this.agents.values())
  }

  findById(id: string): Agent | undefined {
    return this.agents.get(id)
  }

  findByAuthor(authorId: string): Agent[] {
    return this.findAll().filter(a => a.authorId === authorId)
  }

  findByCategory(category: string): Agent[] {
    return this.findAll().filter(a => a.category.toLowerCase() === category.toLowerCase())
  }

  create(agent: Agent): Agent {
    this.agents.set(agent.id, agent)
    return agent
  }

  update(id: string, updates: Partial<Agent>): Agent | undefined {
    const agent = this.agents.get(id)
    if (!agent) return undefined
    const updated = { ...agent, ...updates }
    this.agents.set(id, updated)
    return updated
  }

  delete(id: string): boolean {
    return this.agents.delete(id)
  }

  seed(): void {
    const agents: Agent[] = [
      {
        id: '1',
        name: 'Code Assistant Pro',
        description: 'AI-powered code review and generation',
        longDescription: 'Code Assistant Pro is a powerful AI agent that helps developers write better code faster. It provides intelligent code suggestions, automated code reviews, and can even generate entire functions based on natural language descriptions.',
        authorId: 'user1',
        author: { name: 'DevTools Inc', verified: true },
        category: 'Development',
        tags: ['code', 'development', 'review', 'generation'],
        version: '2.1.0',
        pricing: 'free',
        icon: '💻',
        config: { capabilities: ['Code Review', 'Code Generation', 'Bug Detection', 'Documentation'] },
        downloads: 15420,
        rating: 4.8,
        reviewCount: 234,
        status: 'published',
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2026-02-15'),
      },
      {
        id: '2',
        name: 'Data Analyst Bot',
        description: 'Analyze datasets and generate insights',
        longDescription: 'Transform raw data into actionable insights with our advanced analytics agent. Supports CSV, Excel, and database connections.',
        authorId: 'user2',
        author: { name: 'DataMinds', verified: true },
        category: 'Analytics',
        tags: ['data', 'analytics', 'visualization', 'insights'],
        version: '1.5.0',
        pricing: 'paid',
        price: 29,
        icon: '📊',
        config: { capabilities: ['Data Analysis', 'Visualization', 'Report Generation'] },
        downloads: 8930,
        rating: 4.6,
        reviewCount: 156,
        status: 'published',
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-02-10'),
      },
      {
        id: '3',
        name: 'Content Writer',
        description: 'Generate high-quality content for any purpose',
        longDescription: 'Create blog posts, marketing copy, social media content, and more with our AI-powered content generation agent.',
        authorId: 'user3',
        author: { name: 'ContentAI', verified: false },
        category: 'Content',
        tags: ['content', 'writing', 'marketing', 'blog'],
        version: '3.0.0',
        pricing: 'subscription',
        price: 9,
        icon: '✍️',
        config: { capabilities: ['Blog Writing', 'Copywriting', 'SEO Optimization', 'Social Media'] },
        downloads: 23100,
        rating: 4.9,
        reviewCount: 512,
        status: 'published',
        createdAt: new Date('2025-11-15'),
        updatedAt: new Date('2026-02-14'),
      },
      {
        id: '4',
        name: 'Customer Support AI',
        description: '24/7 automated customer support agent',
        longDescription: 'Handle customer inquiries automatically with our intelligent support agent. Integrates with popular helpdesk platforms.',
        authorId: 'user4',
        author: { name: 'SupportLabs', verified: true },
        category: 'Support',
        tags: ['support', 'customer service', 'chatbot', 'automation'],
        version: '2.3.0',
        pricing: 'subscription',
        price: 49,
        icon: '🎧',
        config: { capabilities: ['Ticket Response', 'FAQ Handling', 'Escalation', 'Multi-language'] },
        downloads: 12500,
        rating: 4.7,
        reviewCount: 289,
        status: 'published',
        createdAt: new Date('2025-10-20'),
        updatedAt: new Date('2026-02-12'),
      },
      {
        id: '5',
        name: 'SEO Optimizer',
        description: 'Optimize content for search engines',
        longDescription: 'Analyze and optimize your content for better search engine rankings. Includes keyword research and competitor analysis.',
        authorId: 'user5',
        author: { name: 'RankBoost', verified: false },
        category: 'Marketing',
        tags: ['seo', 'marketing', 'optimization', 'keywords'],
        version: '1.8.0',
        pricing: 'paid',
        price: 19,
        icon: '🔍',
        config: { capabilities: ['Keyword Research', 'Content Optimization', 'Competitor Analysis'] },
        downloads: 6700,
        rating: 4.5,
        reviewCount: 98,
        status: 'published',
        createdAt: new Date('2026-01-05'),
        updatedAt: new Date('2026-02-08'),
      },
      {
        id: '6',
        name: 'Research Assistant',
        description: 'Deep research and summarization',
        longDescription: 'Conduct comprehensive research on any topic and generate detailed summaries with citations.',
        authorId: 'user6',
        author: { name: 'ResearchAI', verified: true },
        category: 'Research',
        tags: ['research', 'summarization', 'citations', 'analysis'],
        version: '1.2.0',
        pricing: 'free',
        icon: '🔬',
        config: { capabilities: ['Web Research', 'Paper Analysis', 'Citation Generation', 'Summary'] },
        downloads: 9200,
        rating: 4.8,
        reviewCount: 167,
        status: 'published',
        createdAt: new Date('2026-01-20'),
        updatedAt: new Date('2026-02-11'),
      },
    ]

    agents.forEach(agent => this.agents.set(agent.id, agent))
  }
}
