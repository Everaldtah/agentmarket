import { v4 as uuidv4 } from 'uuid';
import { Review, PaginatedResponse, AppError, ErrorCode } from '../types';
import { reviewRepository, agentRepository } from '../repositories';

export class ReviewService {
  /**
   * Get reviews for an agent
   */
  getAgentReviews(
    agentId: string,
    page: number = 1,
    limit: number = 20
  ): PaginatedResponse<Review> {
    // Verify agent exists
    const agent = agentRepository.findById(agentId);
    if (!agent) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Agent not found', 404);
    }

    return reviewRepository.getPaginated(agentId, page, limit);
  }

  /**
   * Get review by ID
   */
  getReviewById(id: string): Review {
    const review = reviewRepository.findById(id);
    if (!review) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Review not found', 404);
    }
    return review;
  }

  /**
   * Create a review
   */
  createReview(
    agentId: string,
    userId: string,
    data: { rating: number; title?: string; comment: string }
  ): Review {
    // Verify agent exists
    const agent = agentRepository.findById(agentId);
    if (!agent) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Agent not found', 404);
    }

    // Check if user has already reviewed
    if (reviewRepository.hasUserReviewed(agentId, userId)) {
      throw new AppError(ErrorCode.CONFLICT, 'You have already reviewed this agent', 409);
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Rating must be between 1 and 5', 400);
    }

    const review: Review = {
      id: uuidv4(),
      agentId,
      userId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      helpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return reviewRepository.create(review);
  }

  /**
   * Update a review
   */
  updateReview(id: string, userId: string, updates: Partial<Review>): Review {
    const review = this.getReviewById(id);

    // Check ownership
    if (review.userId !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, 'You can only edit your own reviews', 403);
    }

    // Validate rating if provided
    if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Rating must be between 1 and 5', 400);
    }

    // Prevent updating certain fields
    const protectedFields = ['id', 'agentId', 'userId', 'helpful', 'createdAt'];
    const safeUpdates = { ...updates };
    protectedFields.forEach(field => delete safeUpdates[field as keyof typeof safeUpdates]);

    const updated = reviewRepository.update(id, { ...safeUpdates, updatedAt: new Date() });
    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to update review', 500);
    }

    return updated;
  }

  /**
   * Delete a review
   */
  deleteReview(id: string, userId: string): void {
    const review = this.getReviewById(id);

    // Check ownership
    if (review.userId !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, 'You can only delete your own reviews', 403);
    }

    reviewRepository.delete(id);
  }

  /**
   * Mark review as helpful
   */
  markReviewHelpful(id: string): Review {
    const review = this.getReviewById(id);
    
    const updated = reviewRepository.markHelpful(id);
    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to mark review as helpful', 500);
    }

    return updated;
  }
}

export const reviewService = new ReviewService();
export default reviewService;
