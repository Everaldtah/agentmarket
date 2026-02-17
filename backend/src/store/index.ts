import { v4 as uuidv4 } from 'uuid';
import { Agent, User, Review, Deployment, Category, AgentVersion, AgentAnalytics } from '../types';

// In-memory data stores
class DataStore {
  // Initialize with empty stores
  private agents: Map<string, Agent> = new Map();
  private agentVersions: Map<string, AgentVersion[]> = new Map();
  private users: Map<string, User> = new Map();
  private reviews: Map<string, Review[]> = new Map();
  private deployments: Map<string, Deployment[]> = new Map();
  private analytics: Map<string, AgentAnalytics[]> = new Map();
  private categories: Map<string, Category> = new Map();

  constructor() {
    this.seedData();
  }

  // Seed initial data
  private seedData(): void {
    // Seed Categories
    const categories: Category[] = [
      { id: 'cat-1', name: 'Productivity', slug: 'productivity', description: 'Agents that boost productivity', icon: '⚡', agentCount: 0 },
      { id: 'cat-2', name: 'Development', slug: 'development', description: 'Coding and development assistants', icon: '💻', agentCount: 0 },
      { id: 'cat-3', name: 'Creative', slug: 'creative', description: 'Art, writing, and creative tools', icon: '🎨', agentCount: 0 },
      { id: 'cat-4', name: 'Research', slug: 'research', description: 'Research and analysis agents', icon: '🔬', agentCount: 0 },
      { id: 'cat-5', name: 'Communication', slug: 'communication', description: 'Chat and communication helpers', icon: '💬', agentCount: 0 },
      { id: 'cat-6', name: 'Data Analysis', slug: 'data-analysis', description: 'Data processing and visualization', icon: '📊', agentCount: 0 },
    ];

    categories.forEach(cat => {
      this.categories.set(cat.id, cat);
    });

    // Seed Users
    const users: User[] = [
      {
        id: 'user-1',
        email: 'john@example.com',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        bio: 'AI enthusiast and developer',
        role: 'developer',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 'user-2',
        email: 'jane@example.com',
        username: 'janesmith',
        displayName: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        bio: 'Full-stack developer',
        role: 'developer',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
    ];

    users.forEach(user => {
      this.users.set(user.id, user);
    });

    // Seed Agents
    const agents: Agent[] = [
      {
        id: 'agent-1',
        name: 'CodeHelper Pro',
        description: 'Your intelligent coding assistant',
        longDescription: 'CodeHelper Pro is an advanced AI coding assistant that helps you write better code faster. It supports multiple programming languages and integrates with popular IDEs.',
        version: '2.1.0',
        authorId: 'user-1',
        category: 'development',
        tags: ['coding', 'assistant', 'ide', 'productivity'],
        icon: '👨‍💻',
        documentation: 'https://docs.codehelper.pro',
        repository: 'https://github.com/johndoe/codehelper',
        license: 'MIT',
        price: 0,
        status: 'published',
        downloads: 15420,
        rating: 4.7,
        reviewCount: 234,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-06-15'),
        publishedAt: new Date('2024-01-21'),
      },
      {
        id: 'agent-2',
        name: 'DataViz Wizard',
        description: 'Transform data into stunning visualizations',
        longDescription: 'DataViz Wizard helps you create beautiful, interactive data visualizations from your datasets. Supports charts, graphs, and custom visualizations.',
        version: '1.5.0',
        authorId: 'user-2',
        category: 'data-analysis',
        tags: ['visualization', 'charts', 'analytics', 'data'],
        icon: '📊',
        documentation: 'https://docs.datavizwizard.com',
        license: 'Apache-2.0',
        price: 29.99,
        status: 'published',
        downloads: 8756,
        rating: 4.5,
        reviewCount: 156,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-06-10'),
        publishedAt: new Date('2024-02-12'),
      },
      {
        id: 'agent-3',
        name: 'WriteBot',
        description: 'AI-powered content creation assistant',
        longDescription: 'WriteBot helps you create engaging content for blogs, social media, and marketing materials. Features include tone adjustment, SEO optimization, and plagiarism checking.',
        version: '3.0.0',
        authorId: 'user-1',
        category: 'creative',
        tags: ['writing', 'content', 'marketing', 'seo'],
        icon: '✍️',
        license: 'Commercial',
        price: 49.99,
        status: 'published',
        downloads: 23150,
        rating: 4.8,
        reviewCount: 512,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-06-20'),
        publishedAt: new Date('2024-01-26'),
      },
    ];

    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
      this.agentVersions.set(agent.id, [{
        id: uuidv4(),
        agentId: agent.id,
        version: agent.version,
        changelog: 'Initial version',
        config: {},
        createdAt: agent.createdAt,
      }]);
      this.reviews.set(agent.id, []);
    });

    // Update category agent counts
    this.updateCategoryCounts();
  }

  private updateCategoryCounts(): void {
    const counts = new Map<string, number>();
    
    this.agents.forEach(agent => {
      if (agent.status === 'published') {
        counts.set(agent.category, (counts.get(agent.category) || 0) + 1);
      }
    });

    this.categories.forEach((cat, id) => {
      cat.agentCount = counts.get(cat.slug) || 0;
      this.categories.set(id, cat);
    });
  }

  // Agent operations
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgentById(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  createAgent(agent: Agent): Agent {
    this.agents.set(agent.id, agent);
    this.agentVersions.set(agent.id, []);
    this.reviews.set(agent.id, []);
    this.updateCategoryCounts();
    return agent;
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updated = { ...agent, ...updates, updatedAt: new Date() };
    this.agents.set(id, updated);
    this.updateCategoryCounts();
    return updated;
  }

  deleteAgent(id: string): boolean {
    const deleted = this.agents.delete(id);
    if (deleted) {
      this.agentVersions.delete(id);
      this.reviews.delete(id);
      this.deployments.delete(id);
      this.updateCategoryCounts();
    }
    return deleted;
  }

  // Agent versions
  getAgentVersions(agentId: string): AgentVersion[] {
    return this.agentVersions.get(agentId) || [];
  }

  addAgentVersion(version: AgentVersion): void {
    const versions = this.agentVersions.get(version.agentId) || [];
    versions.push(version);
    this.agentVersions.set(version.agentId, versions);
  }

  // User operations
  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Review operations
  getReviewsByAgentId(agentId: string): Review[] {
    return this.reviews.get(agentId) || [];
  }

  getReviewById(id: string): Review | undefined {
    for (const reviews of this.reviews.values()) {
      const review = reviews.find(r => r.id === id);
      if (review) return review;
    }
    return undefined;
  }

  createReview(review: Review): Review {
    const reviews = this.reviews.get(review.agentId) || [];
    reviews.push(review);
    this.reviews.set(review.agentId, reviews);
    
    // Update agent rating
    this.updateAgentRating(review.agentId);
    
    return review;
  }

  updateReview(id: string, updates: Partial<Review>): Review | undefined {
    for (const [agentId, reviews] of this.reviews.entries()) {
      const index = reviews.findIndex(r => r.id === id);
      if (index !== -1) {
        reviews[index] = { ...reviews[index], ...updates, updatedAt: new Date() };
        this.reviews.set(agentId, reviews);
        this.updateAgentRating(agentId);
        return reviews[index];
      }
    }
    return undefined;
  }

  deleteReview(id: string): boolean {
    for (const [agentId, reviews] of this.reviews.entries()) {
      const index = reviews.findIndex(r => r.id === id);
      if (index !== -1) {
        reviews.splice(index, 1);
        this.reviews.set(agentId, reviews);
        this.updateAgentRating(agentId);
        return true;
      }
    }
    return false;
  }

  private updateAgentRating(agentId: string): void {
    const reviews = this.reviews.get(agentId) || [];
    const agent = this.agents.get(agentId);
    
    if (agent && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      agent.rating = Math.round(avgRating * 10) / 10;
      agent.reviewCount = reviews.length;
      this.agents.set(agentId, agent);
    }
  }

  // Deployment operations
  getDeploymentsByUserId(userId: string): Deployment[] {
    return this.deployments.get(userId) || [];
  }

  getDeploymentById(id: string): Deployment | undefined {
    for (const deployments of this.deployments.values()) {
      const deployment = deployments.find(d => d.id === id);
      if (deployment) return deployment;
    }
    return undefined;
  }

  createDeployment(deployment: Deployment): Deployment {
    const deployments = this.deployments.get(deployment.userId) || [];
    deployments.push(deployment);
    this.deployments.set(deployment.userId, deployments);
    
    // Increment agent download count
    const agent = this.agents.get(deployment.agentId);
    if (agent) {
      agent.downloads += 1;
      this.agents.set(agent.id, agent);
    }
    
    return deployment;
  }

  updateDeployment(id: string, updates: Partial<Deployment>): Deployment | undefined {
    for (const [userId, deployments] of this.deployments.entries()) {
      const index = deployments.findIndex(d => d.id === id);
      if (index !== -1) {
        deployments[index] = { ...deployments[index], ...updates, updatedAt: new Date() };
        this.deployments.set(userId, deployments);
        return deployments[index];
      }
    }
    return undefined;
  }

  deleteDeployment(id: string): boolean {
    for (const [userId, deployments] of this.deployments.entries()) {
      const index = deployments.findIndex(d => d.id === id);
      if (index !== -1) {
        deployments.splice(index, 1);
        this.deployments.set(userId, deployments);
        return true;
      }
    }
    return false;
  }

  // Category operations
  getCategories(): Category[] {
    return Array.from(this.categories.values());
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.get(id);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return Array.from(this.categories.values()).find(c => c.slug === slug);
  }

  // Analytics operations
  getAnalytics(agentId: string): AgentAnalytics[] {
    return this.analytics.get(agentId) || [];
  }

  recordAnalytics(data: AgentAnalytics): void {
    const analytics = this.analytics.get(data.agentId) || [];
    analytics.push(data);
    this.analytics.set(data.agentId, analytics);
  }
}

// Export singleton instance
export const store = new DataStore();
export default store;
