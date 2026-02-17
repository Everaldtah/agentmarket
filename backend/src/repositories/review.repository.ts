import { Review } from '../types'

export class ReviewRepository {
  private reviews: Map<string, Review> = new Map()

  findByAgentId(agentId: string): Review[] {
    return this.findAll().filter(r => r.agentId === agentId)
  }

  findByUserId(userId: string): Review[] {
    return this.findAll().filter(r => r.userId === userId)
  }

  findAll(): Review[] {
    return Array.from(this.reviews.values())
  }

  findById(id: string): Review | undefined {
    return this.reviews.get(id)
  }

  create(review: Review): Review {
    this.reviews.set(review.id, review)
    return review
  }

  update(id: string, updates: Partial<Review>): Review | undefined {
    const review = this.reviews.get(id)
    if (!review) return undefined
    const updated = { ...review, ...updates, updatedAt: new Date() }
    this.reviews.set(id, updated)
    return updated
  }

  delete(id: string): boolean {
    return this.reviews.delete(id)
  }
}
