import { v4 as uuidv4 } from 'uuid';
import { Deployment, PaginatedResponse, AppError, ErrorCode } from '../types';
import { deploymentRepository, agentRepository } from '../repositories';
import { agentService } from './agent.service';

export class DeploymentService {
  /**
   * Get deployments for a user
   */
  getUserDeployments(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): PaginatedResponse<Deployment> {
    return deploymentRepository.getPaginated(userId, page, limit);
  }

  /**
   * Get deployment by ID
   */
  getDeploymentById(id: string): Deployment {
    const deployment = deploymentRepository.findById(id);
    if (!deployment) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Deployment not found', 404);
    }
    return deployment;
  }

  /**
   * Deploy an agent
   */
  deployAgent(
    userId: string,
    data: {
      agentId: string;
      version?: string;
      environment?: string;
      config?: Record<string, unknown>;
    }
  ): Deployment {
    // Verify agent exists and is published
    const agent = agentRepository.findById(data.agentId);
    if (!agent) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Agent not found', 404);
    }

    if (agent.status !== 'published') {
      throw new AppError(ErrorCode.BAD_REQUEST, 'Agent is not available for deployment', 400);
    }

    // Determine version to deploy
    const version = data.version || agent.version;
    
    // Verify version exists
    const versions = agentRepository.getVersions(data.agentId);
    if (!versions.some(v => v.version === version)) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Agent version not found', 404);
    }

    const deployment: Deployment = {
      id: uuidv4(),
      agentId: data.agentId,
      userId,
      version,
      environment: data.environment || 'default',
      status: 'active',
      config: data.config || {},
      deployedAt: new Date(),
      updatedAt: new Date(),
    };

    const created = deploymentRepository.create(deployment);

    // Increment download count
    agentService.incrementDownloads(data.agentId);

    return created;
  }

  /**
   * Update deployment status
   */
  updateDeploymentStatus(
    id: string,
    userId: string,
    status: Deployment['status']
  ): Deployment {
    const deployment = this.getDeploymentById(id);

    // Check ownership
    if (deployment.userId !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, 'You can only update your own deployments', 403);
    }

    const updated = deploymentRepository.update(id, { status, updatedAt: new Date() });
    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to update deployment', 500);
    }

    return updated;
  }

  /**
   * Stop a deployment
   */
  stopDeployment(id: string, userId: string): Deployment {
    return this.updateDeploymentStatus(id, userId, 'stopped');
  }

  /**
   * Restart a deployment
   */
  restartDeployment(id: string, userId: string): Deployment {
    const deployment = this.getDeploymentById(id);
    
    if (deployment.status !== 'stopped') {
      throw new AppError(ErrorCode.BAD_REQUEST, 'Can only restart stopped deployments', 400);
    }

    return this.updateDeploymentStatus(id, userId, 'active');
  }

  /**
   * Delete a deployment
   */
  deleteDeployment(id: string, userId: string): void {
    const deployment = this.getDeploymentById(id);

    // Check ownership
    if (deployment.userId !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, 'You can only delete your own deployments', 403);
    }

    deploymentRepository.delete(id);
  }

  /**
   * Check if user has deployed an agent
   */
  hasUserDeployed(agentId: string, userId: string): boolean {
    return deploymentRepository.hasUserDeployed(agentId, userId);
  }

  /**
   * Get active deployments count for an agent
   */
  getActiveDeploymentsCount(agentId: string): number {
    return deploymentRepository.getActiveByAgentId(agentId).length;
  }
}

export const deploymentService = new DeploymentService();
export default deploymentService;
