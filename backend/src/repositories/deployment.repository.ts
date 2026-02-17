import { Deployment } from '../types'

export class DeploymentRepository {
  private deployments: Map<string, Deployment> = new Map()

  findByUserId(userId: string): Deployment[] {
    return this.findAll().filter(d => d.userId === userId)
  }

  findByAgentId(agentId: string): Deployment[] {
    return this.findAll().filter(d => d.agentId === agentId)
  }

  findAll(): Deployment[] {
    return Array.from(this.deployments.values())
  }

  findById(id: string): Deployment | undefined {
    return this.deployments.get(id)
  }

  create(deployment: Deployment): Deployment {
    this.deployments.set(deployment.id, deployment)
    return deployment
  }

  update(id: string, updates: Partial<Deployment>): Deployment | undefined {
    const deployment = this.deployments.get(id)
    if (!deployment) return undefined
    const updated = { ...deployment, ...updates }
    this.deployments.set(id, updated)
    return updated
  }

  delete(id: string): boolean {
    return this.deployments.delete(id)
  }
}
