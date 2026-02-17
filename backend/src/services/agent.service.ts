import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentSearchParams, AgentVersion, PaginatedResponse, AppError, ErrorCode, Category } from '../types';
import { agentRepository } from '../repositories';
import store from '../store';

export class AgentService {
  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return agentRepository.findAll();
  }

  /**
   * Get agent by ID
   */
  getAgentById(id: string): Agent {
    const agent = agentRepository.findById(id);
    if (!agent) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Agent not found', 404);
    }
    return agent;
  }

  /**
   * Search agents with filters
   */
  searchAgents(params: AgentSearchParams): PaginatedResponse<Agent> {
    return agentRepository.search(params);
  }

  /**
   * Get agents by author
   */
  getAgentsByAuthor(authorId: string): Agent[] {
    return agentRepository.findByAuthorId(authorId);
  }

  /**
   * Create a new agent
   */
  createAgent(data: Omit<Agent, 'id' | 'downloads' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>): Agent {
    const agent: Agent = {
      ...data,
      id: uuidv4(),
      downloads: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return agentRepository.create(agent);
  }

  /**
   * Update an agent
   */
  updateAgent(id: string, updates: Partial<Agent>): Agent {
    const agent = this.getAgentById(id);
    
    // Prevent updating certain fields
    const protectedFields = ['id', 'createdAt', 'downloads', 'rating', 'reviewCount'];
    const safeUpdates = { ...updates };
    protectedFields.forEach(field => delete safeUpdates[field as keyof typeof safeUpdates]);

    const updated = agentRepository.update(id, { ...safeUpdates, updatedAt: new Date() });
    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to update agent', 500);
    }
    
    return updated;
  }

  /**
   * Delete an agent
   */
  deleteAgent(id: string): void {
    const agent = this.getAgentById(id);
    agentRepository.delete(agent.id);
  }

  /**
   * Publish an agent (change status from draft to published)
   */
  publishAgent(id: string): Agent {
    const agent = this.getAgentById(id);
    
    if (agent.status === 'published') {
      throw new AppError(ErrorCode.BAD_REQUEST, 'Agent is already published', 400);
    }

    const updated = agentRepository.update(id, {
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to publish agent', 500);
    }

    return updated;
  }

  /**
   * Deprecate an agent
   */
  deprecateAgent(id: string): Agent {
    const agent = this.getAgentById(id);
    
    const updated = agentRepository.update(id, {
      status: 'deprecated',
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to deprecate agent', 500);
    }

    return updated;
  }

  /**
   * Get agent versions
   */
  getAgentVersions(agentId: string): AgentVersion[] {
    this.getAgentById(agentId); // Verify agent exists
    return agentRepository.getVersions(agentId);
  }

  /**
   * Add a new version to an agent
   */
  addAgentVersion(
    agentId: string,
    version: string,
    changelog?: string,
    config?: Record<string, unknown>
  ): AgentVersion {
    const agent = this.getAgentById(agentId);

    // Check if version already exists
    const existingVersions = agentRepository.getVersions(agentId);
    if (existingVersions.some(v => v.version === version)) {
      throw new AppError(ErrorCode.CONFLICT, 'Version already exists', 409);
    }

    const newVersion: AgentVersion = {
      id: uuidv4(),
      agentId,
      version,
      changelog,
      config: config || {},
      createdAt: new Date(),
    };

    agentRepository.addVersion(newVersion);

    // Update agent's current version
    agentRepository.update(agentId, { version, updatedAt: new Date() });

    return newVersion;
  }

  /**
   * Get all categories
   */
  getCategories(): Category[] {
    return store.getCategories();
  }

  /**
   * Get category by slug
   */
  getCategoryBySlug(slug: string): Category | undefined {
    return store.getCategoryBySlug(slug);
  }

  /**
   * Increment download count
   */
  incrementDownloads(id: string): void {
    agentRepository.incrementDownloads(id);
  }
}

export const agentService = new AgentService();
export default agentService;
